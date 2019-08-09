/**
 * Serto Mobile App
 *
 */
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Container,
  Text,
  FabButton,
  Constants,
  Screen,
} from '@kancha/kancha-ui'
import { NavigationScreen } from '../../navigators'
import { Icons } from '../../theme'

export default (props: NavigationScreen) => {
  const { t } = useTranslation()
  const loadRequest = (requestData: any) => {
    setTimeout(() => {
      if (requestData.type === 'DISCLOSURE') {
        props.navigation.navigate('Request', {
          requestData,
        })
      }
    }, 500)
  }

  return (
    <Screen
      fabButton={
        <Container>
          <FabButton
            onPress={() =>
              props.navigation.navigate('Scanner', { loadRequest })
            }
            icon={Icons.SCAN}
          />
        </Container>
      }
    >
      <Container
        flex={1}
        justifyContent={'center'}
        alignItems={'center'}
        backgroundColor={'#F5FCFF'}
      >
        <Container paddingBottom>
          <Text type={Constants.TextTypes.H2}>{t('Scan a QR code')}!</Text>
        </Container>
      </Container>
    </Screen>
  )
}
