/**
 * Serto Mobile App
 *
 */
import * as React from 'react'
import { Container, FabButton, Screen } from '@kancha/kancha-ui'
import { RNCamera } from 'react-native-camera'
import { NavigationScreen } from '../navigators'
import { Colors, Icons } from '../theme'
import { Alert } from 'react-native'

export default (props: NavigationScreen) => {
  const onBarCodeRead = (e: any) => {
    // tslint:disable-next-line:no-console
    console.log('Barcode value is ' + e.data, 'Barcode type is ' + e.type)

    props.navigation.goBack()
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
