import React from 'react'
import i18n from '../lib/I18n'
import { Image } from 'react-native'
import {
  createAppContainer,
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  createSwitchNavigator,
} from 'react-navigation'
import {
  createStackNavigator,
  StackViewTransitionConfigs,
} from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { Icon, Avatar, FabButton, ActivityItem } from '@kancha/kancha-ui'
import { Colors, Icons } from '../theme'
import { Screens } from './screens'

const avatar = require('../assets/images/kitten-avatar.jpg')

// Main Screens
import Activity from '../screens/main/Activity'
import Explore from '../screens/main/Explore'
import Profile from '../screens/main/Profile'
import Onboarding from '../screens/main/Onboarding'
import Restore from '../screens/main/Restore'
import Intro from '../screens/main/Intro'

import Scanner from '../screens/main/Scanner'
import Request from '../screens/main/Request'
import Credential from '../screens/main/Credential'
import CreatingWallet from '../screens/main/CreateIdentity'

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

const headerLogo = () => (
  <Image
    source={require('../assets/images/uport_black_horizontal.png')}
    style={{ height: 45 }}
    resizeMode={'contain'}
  />
)

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
    [Screens.Activity.screen]: {
      screen: Activity,
      navigationOptions: {
        headerTitle: headerLogo,
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
    [Screens.Explore.screen]: Explore,
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
  [Screens.Profile.screen]: Profile,
})

/**
 * Main TabNavigator
 */
const TabNavigator = createBottomTabNavigator(
  {
    [Screens.Activity.screen]: {
      screen: ActivityNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return <Icon icon={Icons.HEART} color={tintColor} />
        },
      },
    },
    [Screens.Explore.screen]: {
      screen: ExploreNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return <Icon icon={Icons.SEARCH} color={tintColor} />
        },
      },
    },
    Scan: {
      screen: () => null,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: false,
        tabBarOnPress: () => navigation.navigate('Scanner'),
        tabBarIcon: ({ tintColor }) => {
          return <Icon icon={Icons.SCAN} color={Colors.BRAND} />
        },
      }),
    },
    [Screens.Settings.screen]: {
      screen: SettingsNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return <Icon icon={Icons.SETTINGS} color={tintColor} />
        },
      },
    },
    [Screens.Profile.screen]: {
      screen: ProfileNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return <Avatar source={avatar} backgroundColor={tintColor} border />
        },
      },
    },
  },
  {
    initialRouteName: 'Activity',
    backBehavior: 'initialRoute',
    tabBarOptions: {
      showLabel: false,
      activeTintColor: {
        light: Colors.DARK_GREY,
        dark: Colors.BRAND,
      },
    },
  },
)

/**
 * Remove modal animation from these screens
 */
const NO_MODAL_ANIM = ['']

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
    mode: 'modal',
    headerMode: 'none',
    transparentCard: true,
    cardStyle: {
      // makes transparentCard work for android
      opacity: 1.0,
    },
    transitionConfig: dynamicModalTransition,
  },
)

const Onboard = createStackNavigator(
  {
    Intro: {
      screen: Intro,
      navigationOptions: {
        headerTitle: headerLogo,
        headerStyle: { borderBottomWidth: 0 },
      },
    },
    Onboarding: {
      screen: Onboarding,
      navigationOptions: {
        headerTitle: headerLogo,
        headerStyle: { borderBottomWidth: 0 },
      },
    },
    Restore: {
      screen: Restore,
      navigationOptions: {
        headerTitle: headerLogo,
        headerStyle: { borderBottomWidth: 0 },
      },
    },
    CreatingWallet: {
      screen: CreatingWallet,
      navigationOptions: {
        headerLeft: null,
        headerTitle: headerLogo,
        headerStyle: { borderBottomWidth: 0 },
      },
    },
  },
  {
    initialRouteName: 'Intro',
  },
)

const RootNavigator = createSwitchNavigator(
  {
    App,
    Onboard,
  },
  { initialRouteName: 'Onboard' },
)

export interface NavigationScreen {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export default createAppContainer(RootNavigator)
