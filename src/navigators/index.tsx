import React from 'react'
import { Image } from 'react-native'
import {
  createAppContainer,
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  createSwitchNavigator,
} from 'react-navigation'
import i18n from '../lib/I18n'

import {
  createStackNavigator,
  StackViewTransitionConfigs,
} from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { Icon, Avatar, FabButton, ActivityItem } from '@kancha/kancha-ui'
import { Colors } from '../theme'

const avatar = require('../assets/images/kitten-avatar.jpg')

export const Screens = {
  Home: { screen: 'Home', title: 'Serto' },
  Settings: { screen: 'Settings', title: 'Settings' },
  Logs: { screen: 'Logs', title: 'Logs' },
  Codepush: { screen: 'Codepush', title: 'Codepush' },
  Signer: { screen: 'Signer', title: 'Signer' },
  Config: { screen: 'Config', title: 'Config' },
  Crash: { screen: 'Crash', title: 'Crash Reporting' },
  Scanner: { screen: 'Scanner', title: 'Scanner' },
  Messages: { screen: 'Messages', title: 'Messages' },
  Connections: { screen: 'Connections', title: 'Connections' },
  DidViewer: { screen: 'DidViewer', title: 'DidViewer' },
  ModalDemo: { screen: 'ModalDemo', title: 'Modal Demo' },
  IdentitySelectModal: { screen: 'IdentitySelectModal', title: 'Identities' },
  Claim: { screen: 'Claim', title: 'Claim Demo' },
  DisclosureRequest: {
    screen: 'DisclosureRequest',
    title: 'Disclosure Request',
  },
  Request: {
    screen: 'Request',
    title: 'Request',
  },
  SignJwt: { screen: 'SignJwt', title: 'SignJwt' },
  TrustGraphEdges: { screen: 'TrustGraphEdges', title: 'TG Edges' },
  Credentials: { screen: 'Credentials', title: 'Credentials' },
  Onboarding: { screen: 'Onboarding', title: 'Onboarding' },
  IdentityCheck: { screen: 'IdentityCheck', title: 'Identity Check' },
  Credential: { screen: 'Credential', title: 'Credential' },
}

// Main Screens
import Activity from '../screens/main/Activity'
import Explore from '../screens/main/Explore'
import Profile from '../screens/main/Profile'
import Onboarding from '../screens/main/Onboarding'

import Scanner from '../screens/main/Scanner'
import Request from '../screens/main/Request'
import Credential from '../screens/main/Credential'

// Settings & Internal Demo Screens
import Settings from '../screens/settings/Settings'
import Logs from '../screens/settings/Logs'
import Codepush from '../screens/settings/Codepush'
import Signer from '../screens/settings/Signer'
import Config from '../screens/settings/Config'
import Crash from '../screens/settings/Crash'
import Messages from '../screens/settings/Messages'
import Connections from '../screens/settings/Connections'
import DidViewer from '../screens/settings/DidViewer'
import Claim from '../screens/settings/Claim'
import SignJwt from '../screens/settings/SignJwt'
import TrustGraphEdges from '../screens/settings/TrustGraphEdges'
import Credentials from '../screens/settings/Credentials'
import DisclosureRequest from '../screens/settings/DisclosureRequest'
import ModalDemo from '../screens/settings/ModalDemo'

const SettingsNavigator = createStackNavigator(
  {
    [Screens.Settings.screen]: {
      screen: Settings,
      navigationOptions: {
        title: i18n.t('Settings'),
      },
    },
    [Screens.Messages.screen]: {
      screen: Messages,
      navigationOptions: {
        title: i18n.t('Messages'),
      },
    },
    [Screens.TrustGraphEdges.screen]: {
      screen: TrustGraphEdges,
      navigationOptions: {
        title: i18n.t('Trust Graph Edges'),
      },
    },
    [Screens.Connections.screen]: {
      screen: Connections,
      navigationOptions: {
        title: i18n.t('Connections'),
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
    [Screens.Credentials.screen]: {
      screen: Credentials,
      navigationOptions: {
        title: i18n.t('Credentials'),
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
  },
  {
    defaultNavigationOptions: {
      headerTintColor: Colors.BLACK,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerBackTitle: null,
    },
  },
)

const ActivityNavigator = createStackNavigator(
  {
    Activity: {
      screen: Activity,
      navigationOptions: {
        headerTitle: () => (
          <Image
            source={require('../assets/images/uport_black_horizontal.png')}
            style={{ height: 50 }}
            resizeMode={'contain'}
          />
        ),
      },
    },
    Profile,
  },
  {
    initialRouteName: 'Activity',
    defaultNavigationOptions: {
      headerTintColor: Colors.BLACK,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerBackTitle: null,
    },
  },
)

const ExploreNavigator = createStackNavigator(
  {
    Explore,
  },
  {
    defaultNavigationOptions: {
      headerTintColor: Colors.BLACK,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerBackTitle: null,
    },
  },
)

const ProfileNavigator = createStackNavigator({
  Profile,
})

/**
 * Main TabNavigator
 */
const TabNavigator = createBottomTabNavigator(
  {
    Activity: {
      screen: ActivityNavigator,
      navigationOptions: {
        tabBarIcon: () => {
          return <Icon icon={{ name: 'md-heart', iconFamily: 'Ionicons' }} />
        },
      },
    },
    Explore: {
      screen: ExploreNavigator,
      navigationOptions: {
        tabBarIcon: () => {
          return <Icon icon={{ name: 'ios-search', iconFamily: 'Ionicons' }} />
        },
      },
    },
    Scan: {
      screen: () => null,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: false,
        tabBarIcon: (
          <FabButton
            shadowOpacity={0.1}
            onPress={() => navigation.navigate('Scanner')}
            icon={{ name: 'ios-qr-scanner', iconFamily: 'Ionicons' }}
          />
        ),
      }),
    },
    Settings: {
      screen: SettingsNavigator,
      navigationOptions: {
        tabBarIcon: () => {
          return (
            <Icon icon={{ name: 'ios-settings', iconFamily: 'Ionicons' }} />
          )
        },
      },
    },
    Profile: {
      screen: ProfileNavigator,
      navigationOptions: {
        tabBarIcon: () => {
          return <Avatar source={avatar} />
        },
      },
    },
  },
  {
    initialRouteName: 'Activity',
    backBehavior: 'initialRoute',
    tabBarOptions: {
      showLabel: false,
    },
  },
)

/**
 * Remove modal animation from these screens
 */
const NO_MODAL_ANIM = ['Scanner']

let dynamicModalTransition = (
  transitionProps: any,
  prevTransitionProps: any,
) => {
  const notModal = NO_MODAL_ANIM.some(
    screenName =>
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps &&
        screenName === prevTransitionProps.scene.route.routeName),
  )
  return notModal
    ? StackViewTransitionConfigs.NoAnimation
    : StackViewTransitionConfigs.ModalSlideFromBottomIOS
}

const App = createStackNavigator(
  {
    Tabs: TabNavigator,
    ModalDemo: ModalDemo,
    DisclosureRequest: DisclosureRequest,
    Request: Request,
    Credential: Credential,
    Scanner: Scanner,
  },
  {
    headerMode: 'none',
    transparentCard: true,
    mode: 'modal',
    transitionConfig: dynamicModalTransition,
  },
)

const RootNavigator = createSwitchNavigator(
  {
    App,
    Onboarding,
  },
  { initialRouteName: 'Onboarding' },
)

export interface NavigationScreen {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export default createAppContainer(RootNavigator)
