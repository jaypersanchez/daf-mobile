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
import { withNavigation, NavigationScreenProps } from 'react-navigation'
import { deleteSeedMutation } from '../lib/Signer'

interface DidViewerProps extends NavigationScreenProps {}

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
          <Mutation mutation={deleteSeedMutation} refetchQueries={['getDids']}>
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
                navButton
              />
            )}
          </Mutation>
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
