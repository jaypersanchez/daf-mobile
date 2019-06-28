import React from 'react'
import {
  createDrawerNavigator,
  createStackNavigator,
  createAppContainer,
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
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
import Scanner from '../screens/Scanner'

export const Screens = {
  Home: { screen: 'Home', title: 'Serto' },
  Developer: { screen: 'Developer', title: 'Developer' },
  Logs: { screen: 'Logs', title: 'Logs' },
  Codepush: { screen: 'Codepush', title: 'Codepush' },
  Signer: { screen: 'Signer', title: 'Signer' },
  Config: { screen: 'Config', title: 'Config' },
  Crash: { screen: 'Crash', title: 'Crash Reporting' },
  Scanner: { screen: 'Scanner', title: 'Scanner' },
}

export interface NavigationScreen {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

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
  [Screens.Developer.screen]: {
    screen: Developer,
    navigationOptions: ({ navigation }: any) => {
      return {
        title: i18n.t('Developer'),
        headerLeft: DrawerMenuButton(navigation),
      }
    },
  },
  [Screens.Logs.screen]: {
    screen: Logs,
    navigationOptions: {
      title: i18n.t('Logs'),
    },
  },
  [Screens.Codepush.screen]: {
    screen: Codepush,
    navigationOptions: {
      title: i18n.t('Codepush'),
    },
  },
  [Screens.Signer.screen]: {
    screen: Signer,
    navigationOptions: {
      title: i18n.t('Signer'),
    },
  },
  [Screens.Config.screen]: {
    screen: Config,
    navigationOptions: {
      title: i18n.t('Configuration'),
    },
  },
  [Screens.Crash.screen]: {
    screen: Crash,
    navigationOptions: {
      title: i18n.t('CrashReporting'),
    },
  },
})

const HomeNavigator = createStackNavigator({
  [Screens.Home.screen]: {
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
  [Screens.Home.screen]: HomeNavigator,
  Developer: DeveloperNavigator,
})

const RootNavigator = createStackNavigator(
  {
    Drawer: DrawerNavigator,
    [Screens.Scanner.screen]: {
      screen: Scanner,
    },
  },
  {
    headerMode: 'none',
    mode: 'modal',
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,
      },
    }),
  },
)

export default createAppContainer(RootNavigator)
