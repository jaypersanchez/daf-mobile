import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Screen, Container, Text, Button, Constants } from '@kancha/kancha-ui'
import { NavigationScreen } from '../../navigators'
import { Query, Mutation } from 'react-apollo'
import { Did, getDidsQuery, createDidMutation } from '../../lib/Signer'
import { ActivityIndicator } from 'react-native'
import { Colors } from '../../theme'

interface OnboardingProps extends NavigationScreen {}

interface Resp {
  data: { dids: Did[] }
  loading: boolean
  refetch: () => void
  client: any
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
      {({ data, loading, client }: Resp) => (
        <Screen>
          <Container alignItems={'center'} justifyContent={'center'} flex={1}>
            {!loading && data.dids.length === 0 ? (
              <Mutation
                mutation={createDidMutation}
                refetchQueries={['getDids']}
                onCompleted={({
                  createDid,
                }: {
                  createDid: {
                    address: string
                    did: string
                  }
                }) => {
                  // tslint:disable-next-line:no-console
                  console.log(createDid.address, createDid.did)

                  client.writeData({ data: { selectedDid: createDid.did } })
                }}
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
