/**
 * Serto Mobile App
 *
 */
import * as React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { useTranslation } from 'react-i18next'
import { Switch } from 'react-native'
import { Container, Text, Screen, ListItem, Section } from '@kancha/kancha-ui'
import { Colors } from '../theme'
import Config from 'react-native-config'

const Developer: React.FC<NavigationScreenProps> = ({ navigation }) => {
  const { t, i18n } = useTranslation()
  return (
    <Screen scrollEnabled={true}>
      <Container backgroundColor={Colors.BRAND} padding alignItems={'center'}>
        <Text bold textColor={Colors.WHITE}>
          {t('Environment')}: {Config.ENV}
        </Text>
      </Container>
      <Container>
        <Section title={'Developer tooling'}>
          <ListItem onPress={() => navigation.navigate('Logs')}>
            {t('Logs')}
          </ListItem>
          <ListItem onPress={() => navigation.navigate('Config')}>
            {t('Configuration')}
          </ListItem>
          <ListItem onPress={() => navigation.navigate('Signer')}>
            {t('Signer')}
          </ListItem>
          <ListItem onPress={() => navigation.navigate('Codepush')}>
            {t('CodePush')}
          </ListItem>
          <ListItem last onPress={() => navigation.navigate('Crash')}>
            {t('CrashReporting')}
          </ListItem>
        </Section>
        <Section title={'Language'}>
          <ListItem
            last
            iconLeft={
              <Switch
                testID={'language_switch'}
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
    </Screen>
  )
}

export default Developer
