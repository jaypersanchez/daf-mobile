/**
 * Serto Mobile App
 *
 */
import React, { useState } from 'react'
import { Container, FabButton, Screen } from '@kancha/kancha-ui'
import { RNCamera } from 'react-native-camera'
import { NavigationScreen } from '../navigators'
import { Colors, Icons } from '../theme'
import { Alert } from 'react-native'
// import { messageFromURL } from '../lib/serto-credentials'
import { saveMessage } from '../lib/Messages'
import Log from '../lib/Log'

export default (props: NavigationScreen) => {
  const [firstDetection, setFirstDetection] = useState(true)

  const onBarCodeRead = async (e: any) => {
    // tslint:disable-next-line:no-console
    if (firstDetection) {
      setFirstDetection(false)
      Log.info('Detected QR Code: ' + e.data, 'Scanner')
      // const message = await messageFromURL(e.data)
      // if (message) {
      //   const messageId = await saveMessage(message)
      // }
      props.navigation.navigate('Messages')
    }
  }

  return (
    <Screen
      fabButton={
        <Container alignItems={'center'} justifyContent={'flex-end'}>
          <FabButton
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
