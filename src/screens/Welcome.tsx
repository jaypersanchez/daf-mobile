/**
 * Serto Mobile App
 *
 */
import * as React from 'react'
import { useTranslation, composeInitialProps } from 'react-i18next'
import { Container, Text, Button, Constants, Screen } from '@kancha/kancha-ui'
import { NavigationScreen, Screens } from '../navigators'

export default (props: NavigationScreen) => {
  const { t } = useTranslation()
  return (
    <Screen>
      <Container
        flex={1}
        justifyContent={'center'}
        alignItems={'center'}
        backgroundColor={'#F5FCFF'}
      >
        <Container paddingBottom>
          <Text type={Constants.TextTypes.H2}>{t('Welcome to Serto')}!</Text>
        </Container>
      </Container>
    </Screen>
  )
}
