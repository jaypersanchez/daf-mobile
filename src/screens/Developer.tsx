/**
 * Serto Mobile App
 *
 */
import * as React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { useTranslation } from 'react-i18next'
import { Switch } from 'react-native'
import {
  Container,
  Text,
  Button,
  Constants,
  Screen,
  ListItem,
  Section,
} from '@kancha/kancha-ui'
import { Colors } from '../theme'
import { Screens } from '../navigators'
import Config from 'react-native-config'

export default ({ navigation }: NavigationScreenProps) => {
  const { t, i18n } = useTranslation()
  return (
    <Screen scrollEnabled={true} safeArea={true}>
      <Container backgroundColor={Colors.BRAND} padding alignItems={'center'}>
        <Text bold textColor={Colors.WHITE}>
          {t('Environment')}: {Config.ENV}
        </Text>
      </Container>

      <Container>
        <Section title={'Developer tooling'}>
          <ListItem onPress={() => navigation.navigate(Screens.Logs.screen)}>
            {t('Logs')}
          </ListItem>
          <ListItem onPress={() => navigation.navigate(Screens.Config.screen)}>
            {t('Configuration')}
          </ListItem>
          <ListItem onPress={() => navigation.navigate(Screens.Signer.screen)}>
            {t('Signer')}
          </ListItem>
          <ListItem
            onPress={() => navigation.navigate(Screens.Codepush.screen)}
          >
            {t('CodePush')}
          </ListItem>
          <ListItem
            last
            onPress={() => navigation.navigate(Screens.Crash.screen)}
          >
            {t('CrashReporting')}
          </ListItem>
          {/* <ListItem onPress={() => navigation.navigate(Screens.Locale.screen)}>{t('Localisation')}</ListItem> */}
        </Section>

        <Section title={'Language'}>
          <ListItem
            last
            iconLeft={
              <Switch
                value={i18n.language === 'es'}
                onValueChange={() =>
                  i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')
                }
              />
            }
          >
            {i18n.language === 'en' ? t('English') : t('Spanish')}
          </ListItem>
        </Section>
      </Container>

      <Container flex={1} padding>
        {/* <Container marginBottom>
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
            buttonText={t('Configuration')}
            onPress={() => navigation.navigate('Config')}
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
        <Container marginBottom>
          <Button
            fullWidth
            type={Constants.BrandOptions.Warning}
            block={Constants.ButtonBlocks.Outlined}
            buttonText={'Crash App 6'}
            onPress={() => {
              throw new Error('Sample error from JS 6')
            }}
          />
        </Container> */}
      </Container>
    </Screen>
  )
}
