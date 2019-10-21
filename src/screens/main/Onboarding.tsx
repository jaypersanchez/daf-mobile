import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Screen, Container, Button, Constants } from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks'
import {
  getDidsQuery as GET_DIDS,
  createDidMutation as CREATE_DID,
} from '../../lib/Signer'
import { ActivityIndicator } from 'react-native'
import { Colors } from '../../theme'

interface OnboardingProps extends NavigationStackScreenProps {}

const Onboarding: React.FC<OnboardingProps> = props => {
  const { t } = useTranslation()
  const client = useApolloClient()
  const { data, loading, error } = useQuery(GET_DIDS, {
    onCompleted(response) {
      if (response.dids.length > 0) {
        props.navigation.navigate('App')
      }
    },
  })
  const [createDid] = useMutation(CREATE_DID, {
    onCompleted(response) {
      client.writeData({ data: { selectedDid: response.createDid.did } })
    },
    refetchQueries: ['getDids'],
  })

  return (
    <Screen>
      <Container alignItems={'center'} justifyContent={'center'} flex={1}>
        {loading && <ActivityIndicator size={'large'} color={Colors.BRAND} />}
        {!loading && data && data.dids.length === 0 && (
          <Button
            testID={'CREATE_IDENTITY_BTN'}
            fullWidth
            type={Constants.BrandOptions.Primary}
            block={Constants.ButtonBlocks.Filled}
            buttonText={t('Create New Identity')}
            onPress={() => createDid()}
          />
        )}
      </Container>
    </Screen>
  )
}

export default Onboarding
