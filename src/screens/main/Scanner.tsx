/**
 * Serto Mobile App
 *
 */
import React from 'react'
import { Container, FabButton, Screen } from '@kancha/kancha-ui'
import { RNCamera } from 'react-native-camera'
import { Colors, Icons } from '../../theme'
import { core } from '../../lib/setup'
import lodash from 'lodash'

export default (props: any) => {
  const onBarCodeRead = (e: any) => {
    core.onRawMessage({
      raw: e.data,
      meta: [
        {
          sourceType: 'qrCode',
        },
      ],
    })
    props.navigation.goBack()
  }

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
          onBarCodeRead={lodash.debounce(onBarCodeRead, 1000)}
        />
      </Container>
    </Screen>
  )
}
