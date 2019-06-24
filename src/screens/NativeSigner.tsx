/**
 * Serto Mobile App
 *
 */

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Text, Button, Constants, Screen } from '@kancha/kancha-ui'
import { NavigationScreenProps } from 'react-navigation'
import { RNUportHDSigner } from 'react-native-uport-signer'

export default ({ navigation }: NavigationScreenProps) => {
  const { t } = useTranslation()
  const [hasSeed, setHasSeed] = useState(false)

  useEffect(() => {
    RNUportHDSigner.hasSeed().then((a: boolean) => setHasSeed(a))
  }, [])

  useEffect(() => {
    RNUportHDSigner.listSeedAddresses().then((list: any) => {
      console.log({ list })
    })
  }, [])

  return (
    <Screen scrollEnabled={true} safeArea={true}>
      <Container flex={1}>
        {!hasSeed && (
          <Container flex={1}>
            <Button
              type={Constants.BrandOptions.Primary}
              block={Constants.ButtonBlocks.Filled}
              buttonText={t('Create seed')}
              onPress={() => {
                RNUportHDSigner.createSeed('simple').then((seed: any) => {
                  console.log(seed)
                  setHasSeed(true)
                })
              }}
            />
          </Container>
        )}
      </Container>
    </Screen>
  )
}
