/**
 * Serto Mobile App
 *
 */
import * as React from 'react'
import { Container, FabButton, Screen } from '@kancha/kancha-ui'
import { RNCamera } from 'react-native-camera'
import { NavigationScreen } from '../../navigators'
import { Colors, Icons } from '../../theme'

export default (props: NavigationScreen) => {
  const onBarCodeRead = (e: any) => {
    props.navigation.navigate('App')
    props.navigation.state.params.loadRequest({
      type: 'DISCLOSURE',
      data: JSON.parse(e.data),
    })
  }

  return (
    <Screen
      fabButton={
        <Container alignItems={'center'} justifyContent={'flex-end'}>
          <FabButton
            color={Colors.CHARCOAL}
            onPress={() => props.navigation.navigate('App')}
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
