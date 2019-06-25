/**
 * @format
 */

import { AppRegistry, YellowBox } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import codePush from 'react-native-code-push'
import { Sentry } from 'react-native-sentry'
import Config from 'react-native-config'

Sentry.config(Config.SENTRY_DSN).install()

YellowBox.ignoreWarnings(['componentWillUpdate', 'componentWillReceiveProps'])

codePush.getUpdateMetadata().then(update => {
  if (update) {
    Sentry.setVersion(update.appVersion + '-codepush:' + update.label)
    // Sentry.setRelease(update.appVersion + '-codepush:' + update.label)
  }
})

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
}
AppRegistry.registerComponent(appName, () => codePush(codePushOptions)(App))
