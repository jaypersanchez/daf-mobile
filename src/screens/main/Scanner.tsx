/**
 * Serto Mobile App
 *
 */
import React, { useState } from 'react'
import { Container, FabButton, Screen } from '@kancha/kancha-ui'
import { RNCamera } from 'react-native-camera'
import { Colors, Icons } from '../../theme'
import { TextInput } from 'react-native-gesture-handler'

export default (props: any) => {
  const [scannerActive, toggleScanner] = useState(true)
  const [inputMode, toggleInputMode] = useState(false)

  const onPasteJWT = (text: string) => {
    props.navigation.navigate('MessageProcess', {
      message: text,
    })
  }
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
        <Container marginBottom={-16} flexDirection={'row'}>
          <Container flex={1}></Container>
          <Container flex={1} alignItems={'center'}>
            <FabButton
              testID={'CANCEL_SCAN_BTN'}
              color={Colors.CHARCOAL}
              onPress={() => props.navigation.dismiss()}
              icon={Icons.CLOSE}
            />
          </Container>
          <Container flex={1} justifyContent={'flex-start'}>
            {__DEV__ && (
              <FabButton
                testID={'ENABLE_PASTE'}
                color={inputMode ? Colors.CONFIRM : Colors.CHARCOAL}
                onPress={() => toggleInputMode(!inputMode)}
                size={50}
                icon={{ name: 'ios-code', iconFamily: 'Ionicons' }}
              />
            )}
          </Container>
        </Container>
      }
    >
      <Container flex={1} backgroundColor={Colors.BLACK}>
        {inputMode ? (
          <Container justifyContent={'center'} flex={1} padding>
            <TextInput
              autoCapitalize={'none'}
              autoCorrect={false}
              autoCompleteType={'off'}
              placeholder={'Paste JWT'}
              placeholderTextColor={Colors.MEDIUM_GREY}
              onChangeText={onPasteJWT}
              style={{
                padding: 10,
                color: Colors.LIGHT_GREY,
                backgroundColor: Colors.DARK_GREY,
                borderRadius: 5,
                borderWidth: 1,
              }}
            />
          </Container>
        ) : (
          <RNCamera
            captureAudio={false}
            style={{ flex: 1 }}
            onBarCodeRead={onBarCodeRead}
          />
        )}
      </Container>
    </Screen>
  )
}
