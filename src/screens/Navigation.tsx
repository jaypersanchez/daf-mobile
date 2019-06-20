import React from 'react'
import {
  createDrawerNavigator,
  createAppContainer,
  createStackNavigator,
} from 'react-navigation'
import i18n from '../lib/I18n'
import Settings from './Settings'
import Welcome from './Welcome'
import Logs from './Logs'
import Codepush from './Codepush'

const SettingsNavigator = createStackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: {
      title: i18n.t('Settings'),
    },
  },
  Logs: {
    screen: Logs,
    navigationOptions: {
      title: i18n.t('Logs'),
    },
  },
  Codepush: {
    screen: Codepush,
    navigationOptions: {
      title: i18n.t('Codepush'),
    },
  },
})

const DrawerNavigator = createDrawerNavigator({
  Home: Welcome,
  Settings: SettingsNavigator,
})

export default createAppContainer(DrawerNavigator)
