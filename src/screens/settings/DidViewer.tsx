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
import { ApolloConsumer } from 'react-apollo'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import {
  GET_MANAGED_IDENTITIES,
  DELETE_IDENTITY,
  SET_VIEWER,
} from '../../lib/rn-packages/rn-graphql/queries'

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
            <Mutation
              mutation={SET_VIEWER}
              refetchQueries={[{ query: GET_MANAGED_IDENTITIES }]}
            >
              {(mutate: any) => (
                <Button
                  fullWidth
                  type={Constants.BrandOptions.Primary}
                  block={Constants.ButtonBlocks.Filled}
                  buttonText={'Make default'}
                  onPress={() => {
                    mutate({
                      variables: {
                        did,
                      },
                    }).then(() => props.navigation.goBack())
                  }}
                />
              )}
            </Mutation>
          </Container>
          <Container>
            <Mutation
              mutation={DELETE_IDENTITY}
              refetchQueries={[{ query: GET_MANAGED_IDENTITIES }]}
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
                        type: 'rnEthr',
                        did,
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
        <Section title={'Seed'}>
          <Container padding>
            <Text>seed</Text>
          </Container>
        </Section>
      </Container>
    </Screen>
  )
}

export default withNavigation(DidViewer)
