/**
 * Serto Mobile App
 *
 */
import * as React from 'react'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { useTranslation } from 'react-i18next'
import { Container, Text, Screen, ListItem, Section } from '@kancha/kancha-ui'
import { Colors } from '../../theme'

const Security: React.FC<NavigationStackScreenProps> = ({ navigation }) => {
  const { t, i18n } = useTranslation()
  return (
    <Screen scrollEnabled={true}>
      <Container>
        <Section title={'Backup'}>
          <ListItem
            onPress={() =>
              navigation.navigate('ShowSecret', { privateKey: true })
            }
          >
            {t('Show Private Key')}
          </ListItem>
          <ListItem
            last
            onPress={() =>
              navigation.navigate('ShowSecret', { seedPhrase: true })
            }
          >
            {t('Show Seed Phrase')}
          </ListItem>
        </Section>
      </Container>
    </Screen>
  )
}

export default Security
