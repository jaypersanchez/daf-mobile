/**
 * Serto Mobile App
 *
 */
import React from 'react'
import { Container, FabButton, Screen } from '@kancha/kancha-ui'
import { RNCamera } from 'react-native-camera'
import { Colors, Icons } from '../../theme'

export default (props: any) => {
  const onBarCodeRead = (e: any) => {}

  return (
    <Screen
      fabButton={
        <Container marginBottom={-16}>
          <FabButton
            testID={'CANCEL_SCAN_BTN'}
            color={Colors.CHARCOAL}
            onPress={() => props.navigation.goBack()}
            icon={Icons.CLOSE}
          />
        </Container>
      }
    >
      <Container flex={1} backgroundColor={Colors.BLACK}>
        <RNCamera
          captureAudio={false}
          style={{ flex: 1 }}
          onBarCodeRead={onBarCodeRead}
        />
      </Container>
    </Screen>
  )
}
