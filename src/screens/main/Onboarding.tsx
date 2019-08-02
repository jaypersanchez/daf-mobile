import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Screen, Container, Text, Button, Constants } from '@kancha/kancha-ui'
import { NavigationScreen } from '../../navigators'
import { Query, Mutation, MutationState } from 'react-apollo'
import {
  Did,
  getDidsQuery,
  createDidMutation,
  importSeedMutation,
} from '../../lib/Signer'
import { ActivityIndicator } from 'react-native'
import { Colors } from '../../theme'

interface OnboardingProps extends NavigationScreen {}

interface Resp {
  data: { dids: Did[] }
  loading: boolean
  refetch: () => void
}

const Onboarding: React.FC<OnboardingProps> = props => {
  const { t } = useTranslation()

  return (
    <Query
      query={getDidsQuery}
      onCompleted={(data: { dids: Did[] }) => {
        if (data.dids.length > 0) {
          props.navigation.navigate('App')
        }
      }}
    >
      {({ data, loading, refetch }: Resp) => (
        <Screen>
          <Container alignItems={'center'} justifyContent={'center'} flex={1}>
            {!loading && data.dids.length === 0 ? (
              <Mutation
                mutation={createDidMutation}
                refetchQueries={['getDids']}
              >
                {(mutate: any) => (
                  <Button
                    fullWidth
                    type={Constants.BrandOptions.Primary}
                    block={Constants.ButtonBlocks.Filled}
                    buttonText={t('Create New Identity')}
                    onPress={() => {
                      mutate()
                    }}
                    navButton
                  />
                )}
              </Mutation>
            ) : (
              <ActivityIndicator size={'large'} color={Colors.BRAND} />
            )}
          </Container>
        </Screen>
      )}
    </Query>
  )
}

export default Onboarding
