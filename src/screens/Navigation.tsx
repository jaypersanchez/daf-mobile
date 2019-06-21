import React from 'react'
import {
  createDrawerNavigator,
  createAppContainer,
  createStackNavigator,
} from 'react-navigation'
import i18n from '../lib/I18n'

import { Container, Icon, Button, Constants } from '@kancha/kancha-ui'
import { Icons, Colors } from '../theme'

import Developer from './Developer'
import Welcome from './Welcome'
import Logs from './Logs'
import Codepush from './Codepush'
import Signer from './Signer'

const DebugNavigator = createStackNavigator({
  Developer: {
    screen: Developer,
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
  Signer: {
    screen: Signer,
    navigationOptions: {
      title: i18n.t('Signer'),
    }
  }
})


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

const LogsNavigator = createStackNavigator({
  LogsScreen: {
    screen: Logs,
    navigationOptions: ({ navigation }: any) => {
      return {
        title: 'Logs',
        headerLeft: DrawerMenuButton(navigation),
      }
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

const DeveloperNavigator = createStackNavigator({
  DeveloperScreen: {
    screen: Developer,
    navigationOptions: ({ navigation }: any) => {
      return {
        title: 'Settings',
        headerLeft: DrawerMenuButton(navigation),
      }
    },
  },
})

const DrawerNavigator = createDrawerNavigator({
  Home: HomeNavigator,
  Debug: DebugNavigator,
  Logs: LogsNavigator,
  Developer: DeveloperNavigator,
})

export default createAppContainer(DrawerNavigator)
