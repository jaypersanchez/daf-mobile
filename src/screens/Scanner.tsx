/**
 * Serto Mobile App
 *
 */

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Text, Constants, Screen } from '@kancha/kancha-ui'
import { Colors } from '../theme'

const Scanner = () => {
  const { t } = useTranslation()
  return (
    <Screen>
      <Container flex={1} backgroundColor={Colors.BLACK}>
        <Container paddingBottom />
      </Container>
    </Screen>
  )
}

Scanner.navigationOptions = {
  headerMode: 'none',
}
export default Scanner
