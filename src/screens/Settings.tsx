/**
 * Serto Mobile App
 *
 */

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Text, Button, Constants, Screen } from '@kancha/kancha-ui'
import { NavigationScreenProps } from 'react-navigation'
import Config from 'react-native-config'

export default ({ navigation }: NavigationScreenProps) => {
  const { t, i18n } = useTranslation()
  return (
    <Screen scrollEnabled={true} safeArea={true}>
      <Container flex={1}>
        <Button
          type={Constants.BrandOptions.Primary}
          block={Constants.ButtonBlocks.Filled}
          buttonText={t('Logs')}
          onPress={() => navigation.navigate('Logs')}
          navButton
        />

        <Button
          type={Constants.BrandOptions.Primary}
          block={Constants.ButtonBlocks.Filled}
          buttonText={t('Signer')}
          onPress={() => navigation.navigate('Signer')}
          navButton
        />

        <Button
          type={Constants.BrandOptions.Primary}
          block={Constants.ButtonBlocks.Filled}
          buttonText={t('CodePush')}
          onPress={() => navigation.navigate('Codepush')}
          navButton
        />

        <Button
          type={Constants.BrandOptions.Primary}
          block={Constants.ButtonBlocks.Filled}
          buttonText={t('change')}
          onPress={() =>
            i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')
          }
        />

        <Text type={Constants.TextTypes.H2}>{t('Configuration')}</Text>
        <Text type={Constants.TextTypes.Body}>{JSON.stringify(Config)}</Text>
      </Container>
    </Screen>
  )
}
