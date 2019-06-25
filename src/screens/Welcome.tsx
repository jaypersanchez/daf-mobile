/**
 * Serto Mobile App
 *
 */

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Text, Button, Constants } from '@kancha/kancha-ui'

export default () => {
  const { t } = useTranslation()
  return (
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
  )
}
