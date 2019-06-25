/**
 * Serto Mobile App
 *
 */

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Text, Button, Constants, Screen } from '@kancha/kancha-ui'
import { NavigationScreenProps } from 'react-navigation'

import { Colors } from '../theme'

import Config from 'react-native-config'

export default ({ navigation }: NavigationScreenProps) => {
  const { t, i18n } = useTranslation()
  return (
    <Screen scrollEnabled={true} safeArea={true}>
      <Container backgroundColor={Colors.BRAND} padding alignItems={'center'}>
        <Text textColor={Colors.WHITE}>
          {t('Environment')}: {Config.ENV}
        </Text>
      </Container>

<<<<<<< HEAD
        <Container padding>
          <Button
            block={Constants.ButtonBlocks.Outlined}
            buttonText={'Crash App 6'}
            onPress={() => {
              throw new Error('Sample error from JS 6')
            }}
          />
        </Container>

        <Text type={Constants.TextTypes.H2}>{t('Configuration')}</Text>
        <Text type={Constants.TextTypes.Body}>{JSON.stringify(Config)}</Text>
=======
      <Container flex={1} padding>
        <Container marginBottom>
          <Button
            fullWidth
            type={Constants.BrandOptions.Primary}
            block={Constants.ButtonBlocks.Filled}
            buttonText={t('Logs')}
            onPress={() => navigation.navigate('Logs')}
          />
        </Container>
        <Container marginBottom>
          <Button
            fullWidth
            type={Constants.BrandOptions.Primary}
            block={Constants.ButtonBlocks.Filled}
            buttonText={t('Signer')}
            onPress={() => navigation.navigate('Signer')}
          />
        </Container>
        <Container marginBottom>
          <Button
            fullWidth
            type={Constants.BrandOptions.Primary}
            block={Constants.ButtonBlocks.Filled}
            buttonText={t('CodePush')}
            onPress={() => navigation.navigate('Codepush')}
          />
        </Container>
        <Container marginBottom>
          <Button
            fullWidth
            type={Constants.BrandOptions.Primary}
            block={Constants.ButtonBlocks.Filled}
            buttonText={t('change')}
            onPress={() =>
              i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')
            }
          />
        </Container>
>>>>>>> Cleanup screens
      </Container>
    </Screen>
  )
}
