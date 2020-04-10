import * as React from 'react'
import { Screen, Container, Text, Constants, Section } from '@kancha/kancha-ui'
import { withNavigation } from 'react-navigation'
import { NavigationStackScreenProps } from 'react-navigation-stack'

interface DidViewerProps extends NavigationStackScreenProps {}

export const DidViewer: React.FC<DidViewerProps> = props => {
  const { navigation } = props
  const did = navigation.getParam('did', 'Did does not exist anymore')

  return (
    <Screen
      scrollEnabled
      background={Constants.BrandOptions.Secondary}
      safeArea
    >
      <Container>
        <Section title={'DID'}>
          <Container padding>
            <Text>{did}</Text>
          </Container>
        </Section>
      </Container>
    </Screen>
  )
}

export default withNavigation(DidViewer)
