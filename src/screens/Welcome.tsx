/**
 * Serto Mobile App
 *
 */

import * as React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import Config from 'react-native-config'

interface Props {}
interface State {}

export default () => {
  const { t, i18n } = useTranslation()
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>{t('Welcome to Serto')}!</Text>
      <TouchableOpacity
        onPress={() =>
          i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')
        }
      >
        <Text>{t('change')}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: Config.BRAND_COLOR,
  },
})
