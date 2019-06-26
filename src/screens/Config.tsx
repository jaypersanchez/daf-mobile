/**
 * Serto Mobile App
 *
 */

import React from 'react'
import { Container, Text, Button, Constants, Screen } from '@kancha/kancha-ui'
import Config from 'react-native-config'

export default () => {
  return (
    <Screen scrollEnabled={true} safeArea={true}>
      <Container backgroundColor={'#F5FCFF'} flex={1} padding>
        {Object.keys(Config.getConstants()).map((key: string) => (
          <Container paddingBottom key={key}>
            <Text type={Constants.TextTypes.SectionHeader}>{key}</Text>
            <Text type={Constants.TextTypes.Body}>{Config[key]}</Text>
          </Container>
        ))}
      </Container>
    </Screen>
  )
}
