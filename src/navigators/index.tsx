import React from 'react'
import { Animated, Easing } from 'react-native'
import {
  createDrawerNavigator,
  createStackNavigator,
  createAppContainer,
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  createSwitchNavigator,
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
import ModalDemo from '../screens/ModalDemo'
import Claim from '../screens/Claim'
import DisclosureRequest from '../screens/DisclosureRequest'
import SignJwt from '../screens/SignJwt'
import IdentitySelectModal from '../screens/main/IdentitySelectionModal'
import Onboarding from '../screens/main/Onboarding'

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
  ModalDemo: { screen: 'ModalDemo', title: 'Modal Demo' },
  IdentitySelectModal: { screen: 'IdentitySelectModal', title: 'Identities' },
  Claim: { screen: 'Claim', title: 'Claim Demo' },
  DisclosureRequest: {
    screen: 'DisclosureRequest',
    title: 'Disclosure Request',
  },
  SignJwt: { screen: 'SignJwt', title: 'SignJwt' },
  Onboarding: { screen: 'Onboarding', title: 'Onboarding' },
  IdentityCheck: { screen: 'IdentityCheck', title: 'Identity Check' },
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
  [Screens.Claim.screen]: {
    screen: Claim,
    navigationOptions: {
      title: i18n.t('Claim Viewer'),
    },
  },
  [Screens.SignJwt.screen]: {
    screen: SignJwt,
    navigationOptions: {
      title: i18n.t('Sign Jwt'),
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
        navigation={props.navigation}
        activeItemkey={props.activeItemKey}
        onItemPress={props.onItemPress}
      />
    ),
  },
)

/**
 * Define custom transitions for views based on routenames
 */
const handleCustomTransition = ({ scenes }: any) => {
  const prevScene = scenes[scenes.length - 2]
  const nextScene = scenes[scenes.length - 1]
  const defaultDuration = 500

  if (
    (prevScene && prevScene.route.routeName === Screens.Scanner.screen) ||
    (nextScene && nextScene.route.routeName === Screens.Scanner.screen)
  ) {
    return {
      transitionSpec: {
        duration: 0,
      },
    }
  }

  return {
    transitionSpec: {
      duration: defaultDuration,
      timing: Animated.timing,
      easing: Easing.out(Easing.poly(7)),
      useNativeDriver: true,
    },
  }
}

const AppNavigator = createStackNavigator(
  {
    Drawer: DrawerNavigator,
    [Screens.Scanner.screen]: {
      screen: Scanner,
    },
    [Screens.ModalDemo.screen]: {
      screen: ModalDemo,
    },
    [Screens.IdentitySelectModal.screen]: {
      screen: IdentitySelectModal,
    },
    [Screens.DisclosureRequest.screen]: {
      screen: DisclosureRequest,
    },
  },
  {
    headerMode: 'none',
    mode: 'modal',
    transparentCard: true,
    transitionConfig: nav => handleCustomTransition(nav),
  },
)

const OnboardingNavigator = createStackNavigator(
  {
    [Screens.Onboarding.screen]: {
      screen: Onboarding,
    },
  },
  {
    headerMode: 'none',
  },
)

const RootNavigator = createSwitchNavigator(
  {
    App: AppNavigator,
    Onboarding: OnboardingNavigator,
  },
  {
    initialRouteName: 'Onboarding',
  },
)

export default createAppContainer(RootNavigator)
