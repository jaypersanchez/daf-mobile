/**
 * Serto Mobile App
 *
 */

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Text, Button, Constants, Screen } from '@kancha/kancha-ui'
import { NavigationScreenProps } from 'react-navigation'
import codePush, { LocalPackage } from 'react-native-code-push'
import { handleCodePushStatusChange } from './../lib/CodepushHelpers'

export default ({ navigation }: NavigationScreenProps) => {
  const { t } = useTranslation()
  const [metadata, setMetadata] = useState<LocalPackage | null>(null)

  const codePushSync = () => {
    codePush.sync(
      {
        updateDialog: {
          appendReleaseDescription: true,
        },
        installMode: codePush.InstallMode.IMMEDIATE,
      },
      handleCodePushStatusChange,
    )
  }

  useEffect(() => {
    codePush.getUpdateMetadata().then(updateMetadata => {
      if (updateMetadata) {
        setMetadata(updateMetadata)
      }
    })
  }, [])

  return (
    <Screen scrollEnabled={true} safeArea={true}>
      <Container flex={1}>
        {metadata !== null && (
          <Container paddingBottom>
            <Text type={Constants.TextTypes.Body}>
              App Version: {metadata.appVersion}
            </Text>
            <Text type={Constants.TextTypes.Body}>Label: {metadata.label}</Text>
            <Text type={Constants.TextTypes.Body}>
              Is first run: {metadata.isFirstRun ? 'true' : 'false'}
            </Text>
            <Text type={Constants.TextTypes.Body}>
              Is mandatory: {metadata.isMandatory ? 'true' : 'false'}
            </Text>
            <Text type={Constants.TextTypes.Body}>
              Is pending: {metadata.isPending ? 'true' : 'false'}
            </Text>
          </Container>
        )}

        <Button
          type={Constants.BrandOptions.Primary}
          block={Constants.ButtonBlocks.Filled}
          buttonText={t('Sync')}
          onPress={codePushSync}
        />
      </Container>
    </Screen>
  )
}
