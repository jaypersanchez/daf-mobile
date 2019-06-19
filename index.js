/**
 * @format
 */

import { AppRegistry, YellowBox } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import codePush from 'react-native-code-push'

YellowBox.ignoreWarnings(['componentWillUpdate', 'componentWillReceiveProps'])

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
}
AppRegistry.registerComponent(appName, () => codePush(codePushOptions)(App))
