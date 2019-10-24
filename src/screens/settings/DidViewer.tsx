import * as React from 'react'
import {
  Screen,
  Container,
  Text,
  Button,
  Constants,
  Section,
} from '@kancha/kancha-ui'
import { Mutation } from 'react-apollo'
import { withNavigation } from 'react-navigation'
import { deleteSeedMutation, getDidsQuery } from '../../lib/Signer'
import { ApolloConsumer } from 'react-apollo'
import { NavigationStackScreenProps } from 'react-navigation-stack'

interface DidViewerProps extends NavigationStackScreenProps {}

export const DidViewer: React.FC<DidViewerProps> = props => {
  const { navigation } = props
  const did = navigation.getParam('did', 'Did does not exist anymore')
  const address = navigation.getParam(
    'address',
    'Address does not exist anymore',
  )
  const seed = navigation.getParam('seed', 'Seed does not exist anymore')

  return (
    <Screen
      scrollEnabled
      background={Constants.BrandOptions.Secondary}
      safeArea
      footerComponent={
        <Container padding>
          <Container marginBottom>
            <ApolloConsumer>
              {client => (
                <Button
                  fullWidth
                  type={Constants.BrandOptions.Primary}
                  block={Constants.ButtonBlocks.Filled}
                  buttonText={'Make Default'}
                  onPress={() => {
                    client.writeData({ data: { selectedDid: did } })
                    client.reFetchObservableQueries()
                  }}
                />
              )}
            </ApolloConsumer>
          </Container>
          <Container>
            <Mutation
              mutation={deleteSeedMutation}
              refetchQueries={[{ query: getDidsQuery }]}
            >
              {(mutate: any) => (
                <Button
                  fullWidth
                  type={Constants.BrandOptions.Warning}
                  block={Constants.ButtonBlocks.Outlined}
                  buttonText={'Delete Seed'}
                  onPress={() => {
                    mutate({
                      variables: {
                        address,
                      },
                    }).then(() => props.navigation.goBack())
                  }}
                />
              )}
            </Mutation>
          </Container>
        </Container>
      }
    >
      <Container>
        <Section title={'DID'}>
          <Container padding>
            <Text>{did}</Text>
          </Container>
        </Section>
        <Section title={'Address'}>
          <Container padding>
            <Text>{address}</Text>
          </Container>
        </Section>
        <Section title={'Seed'}>
          <Container padding>
            <Text>{seed}</Text>
          </Container>
        </Section>
      </Container>
    </Screen>
  )
}

export default withNavigation(DidViewer)
