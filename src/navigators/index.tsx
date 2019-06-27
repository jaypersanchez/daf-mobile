import React from 'react'
import {
  createDrawerNavigator,
  createAppContainer,
  createStackNavigator,
} from 'react-navigation'
import i18n from '../lib/I18n'

import { Container, Icon, Button, Constants } from '@kancha/kancha-ui'
import { Icons, Colors } from '../theme'

import Developer from '../screens/Developer'
import Welcome from '../screens/Welcome'
import Logs from '../screens/Logs'
import Codepush from '../screens/Codepush'
import Signer from '../screens/Signer'
import Config from '../screens/Config'

export const Screens = {
  Home: { screen: 'Home', title: 'Serto' },
  Developer: { screen: 'Developer', title: 'Developer' },
  Logs: { screen: 'Logs', title: 'Logs' },
  Codepush: { screen: 'Codepush', title: 'Codepush' },
  Signer: { screen: 'Signer', title: 'Signer' },
  Config: { screen: 'Config', title: 'Config' },
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
  Developer: {
    screen: Developer,
    navigationOptions: ({ navigation }: any) => {
      return {
        title: 'Developer',
        headerLeft: DrawerMenuButton(navigation),
      }
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
  Home: HomeNavigator,
  Developer: DeveloperNavigator,
})

export default createAppContainer(DrawerNavigator)
