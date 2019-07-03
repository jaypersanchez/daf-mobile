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
import DrawerRight from './DrawerRight'
import DrawerLeft from './DrawerLeft'
import DidViewer from '../screens/DidViewer'

export const Screens = {
  Home: { screen: 'Home', title: 'Serto' },
  Developer: { screen: 'Developer', title: 'Developer' },
  Logs: { screen: 'Logs', title: 'Logs' },
  Codepush: { screen: 'Codepush', title: 'Codepush' },
  Signer: { screen: 'Signer', title: 'Signer' },
  Config: { screen: 'Config', title: 'Config' },
  Crash: { screen: 'Crash', title: 'Crash Reporting' },
  Scanner: { screen: 'Scanner', title: 'Scanner' },
  DidViewer: { screen: 'DidViewer', title: 'DidViewer' },
}

export interface NavigationScreen {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

// Use MORE for slack style example and import drawer right
// Use MENU for material design example and import drawer left
const DrawerMenuButton = (navigation: any) => (
  <Container paddingLeft paddingRight>
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
  [Screens.Config.screen]: {
    screen: Config,
    navigationOptions: {
      title: i18n.t('Configuration'),
    },
  },
  [Screens.DidViewer.screen]: {
    screen: DidViewer,
    navigationOptions: {
      title: i18n.t('Did Viewer'),
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

const DrawerNavigator = createDrawerNavigator(
  {
    [Screens.Home.screen]: HomeNavigator,
    Developer: DeveloperNavigator,
  },
  {
    // Use for slack style example and import drawer right
    // drawerPosition: 'right',
    contentComponent: props => (
      <DrawerLeft
        activeItemkey={props.activeItemKey}
        onItemPress={props.onItemPress}
      />
    ),
  },
)

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
