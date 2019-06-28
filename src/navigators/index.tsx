import React from 'react'
import {
  createDrawerNavigator,
  createAppContainer,
  createStackNavigator,
} from 'react-navigation'
import i18n from '../lib/I18n'

import { Container, Icon, Button, Constants } from '@kancha/kancha-ui'
import { Icons, Colors } from '../theme'

import Welcome from '../screens/Welcome'
import Developer from '../screens/Developer'
import Logs from '../screens/Logs'
import Codepush from '../screens/Codepush'
import Signer from '../screens/Signer'
import Config from '../screens/Config'
import Crash from '../screens/Crash'
import Messages from '../screens/Messages'

const DrawerMenuButton = (navigation: any) => (
  <Container paddingLeft>
    <Button
      onPress={() => navigation.openDrawer()}
      block={Constants.ButtonBlocks.Clear}
      iconButton
      icon={<Icon icon={Icons.MENU} size={32} color={Colors.CHARCOAL} />}
    />
  </Container>
)

const DeveloperNavigator = createStackNavigator({
  DeveloperRootScreen: {
    screen: Developer,
    navigationOptions: ({ navigation }: any) => {
      return {
        title: i18n.t('Developer'),
        headerLeft: DrawerMenuButton(navigation),
      }
    },
  },
  Messages: {
    screen: Messages,
    navigationOptions: {
      title: i18n.t('Messages'),
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
  Signer: {
    screen: Signer,
    navigationOptions: {
      title: i18n.t('Signer'),
    },
  },
  Config: {
    screen: Config,
    navigationOptions: {
      title: i18n.t('Configuration'),
    },
  },
  Crash: {
    screen: Crash,
    navigationOptions: {
      title: i18n.t('CrashReporting'),
    },
  },
})

const HomeNavigator = createStackNavigator({
  HomeScreen: {
    screen: Welcome,
    navigationOptions: ({ navigation }: any) => {
      return {
        title: 'Serto',
        headerLeft: DrawerMenuButton(navigation),
      }
    },
  },
})

const DrawerNavigator = createDrawerNavigator({
  Messages,
  Home: HomeNavigator,
  Developer: DeveloperNavigator,
})

// export const Screens = {
//   Home: { screen: 'Home', title: 'Serto' },
//   Developer: { screen: 'Developer', title: 'Developer' },
//   Logs: { screen: 'Logs', title: 'Logs' },
//   Codepush: { screen: 'Codepush', title: 'Codepush' },
//   Signer: { screen: 'Signer', title: 'Signer' },
//   Config: { screen: 'Config', title: 'Config' },
//   Crash: { screen: 'Crash', title: 'Crash Reporting' },
// }

export default createAppContainer(DrawerNavigator)
