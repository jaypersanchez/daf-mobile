/**
 * Serto Mobile App
 *
 */

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Container,
  Button,
  Constants,
  Screen,
  ListItem,
  Section,
} from '@kancha/kancha-ui'
import codePush, { LocalPackage } from 'react-native-code-push'
import { handleCodePushStatusChange } from '../../lib/CodepushHelpers'

export default () => {
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
            <Section>
              <ListItem subTitle={'App Version'}>
                {metadata.appVersion}
              </ListItem>
              <ListItem subTitle={'First time run'}>
                {metadata.isFirstRun ? 'Yes' : 'No'}
              </ListItem>
              <ListItem subTitle={'Is mandatory'}>
                {metadata.isMandatory ? 'Yes' : 'No'}
              </ListItem>
              <ListItem subTitle={'Is pending'}>
                {metadata.isPending ? 'Yes' : 'No'}
              </ListItem>
            </Section>
          </Container>
        )}
        <Container padding>
          <Button
            fullWidth
            type={Constants.BrandOptions.Primary}
            block={Constants.ButtonBlocks.Filled}
            buttonText={t('Sync')}
            onPress={codePushSync}
          />
        </Container>
      </Container>
    </Screen>
  )
}
