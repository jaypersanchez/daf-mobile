/**
 *
 */
import React from 'react'
import { Container, Text, Screen } from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'

const Restore: React.FC<NavigationStackScreenProps> = () => {
  return (
    <Screen scrollEnabled>
      <Container padding>
        <Container marginBottom></Container>
      </Container>
    </Screen>
  )
}

export default Restore
