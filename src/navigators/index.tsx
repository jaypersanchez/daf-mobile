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
import { Icon, Avatar } from '@kancha/kancha-ui'
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
import MessageProcess from '../screens/main/MessageProcess'
import Request from '../screens/main/Request'
import Credential from '../screens/main/Credential'
import CreatingWallet from '../screens/main/CreateIdentity'

// Settings & Internal Demo Screens
import Settings from '../screens/settings/Settings'
import Codepush from '../screens/settings/Codepush'
import Signer from '../screens/settings/Signer'
import Config from '../screens/settings/Config'
import Crash from '../screens/settings/Crash'
import Messages from '../screens/settings/Messages'
import MessageDetail from '../screens/settings/MessageDetail'
import CreateCredential from '../screens/settings/CreateCredential'
import ShareCredential from '../screens/settings/ShareCredential'
import Connections from '../screens/settings/Connections'
import CredentialField from '../screens/settings/CredentialField'
import DidViewer from '../screens/settings/DidViewer'
import Claim from '../screens/settings/Claim'
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
    [Screens.MessageDetail.screen]: {
      screen: MessageDetail,
      navigationOptions: {
        title: i18n.t('Messages Detail'),
      },
    },
    [Screens.CreateClaim.screen]: {
      screen: CreateCredential,
      navigationOptions: {
        title: i18n.t('Create Claim'),
      },
    },
    [Screens.ShareClaim.screen]: {
      screen: ShareCredential,
      navigationOptions: {
        title: i18n.t('Share Claim'),
      },
    },
    [Screens.Connections.screen]: {
      screen: Connections,
      navigationOptions: {
        title: i18n.t('Connections'),
      },
    },
    [Screens.CredentialField.screen]: {
      screen: CredentialField,
      navigationOptions: {
        title: i18n.t(Screens.CredentialField.title),
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

const ScannerNavigator = createStackNavigator(
  {
    [Screens.Scanner.screen]: Scanner,
    [Screens.MessageProcess.screen]: MessageProcess,
  },
  {
    headerMode: 'none',
  },
)

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
    Scanner: ScannerNavigator,
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
