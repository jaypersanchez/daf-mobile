import React from 'react'
import {
  createDrawerNavigator,
  createAppContainer,
  createStackNavigator,
} from 'react-navigation'
import Settings from './Settings'
import Welcome from './Welcome'
import Logs from './Logs'

const LogsNavigator = createStackNavigator({
  LogsScreen: {
    screen: Logs,
    navigationOptions: {
      title: 'Logs',
    },
  },
})

const TabNavigator = createDrawerNavigator({
  Home: Welcome,
  Logs: LogsNavigator,
  Settings,
})

export default createAppContainer(TabNavigator)
