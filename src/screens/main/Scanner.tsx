/**
 * Serto Mobile App
 *
 */
import React, { useState } from 'react'
import { Container, FabButton, Screen } from '@kancha/kancha-ui'
import { RNCamera } from 'react-native-camera'
import { Colors, Icons } from '../../theme'

export default (props: any) => {
  const [scannerActive, toggleScanner] = useState(true)

  const onBarCodeRead = (e: any) => {
    if (scannerActive) {
      props.navigation.navigate('MessageProcess', {
        message: e.data,
      })
    }
    toggleScanner(false)
  }

  return (
    <Screen
      fabButton={
        <Container marginBottom={-16}>
          <FabButton
            testID={'CANCEL_SCAN_BTN'}
            color={Colors.CHARCOAL}
            onPress={() => props.navigation.dismiss()}
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
