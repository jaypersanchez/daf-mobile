global.Buffer = global.Buffer || require('buffer/').Buffer

// Temporary to stop crashes
import 'react-native-gesture-handler'

import { AppRegistry, UIManager, Platform, YellowBox } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import codePush from 'react-native-code-push'
import Config from 'react-native-config'
import * as Sentry from '@sentry/react-native'
import analytics from '@segment/analytics-react-native'
import { enableScreens } from 'react-native-screens'
import { Device } from '@kancha/kancha-ui'
import Log from './src/lib/Log'

YellowBox.ignoreWarnings([
  'componentWillUpdate',
  'componentWillReceiveProps',
  'RCTRootView cancelTouches',
])

if (Device.isIOS) {
  enableScreens()
}

if (Config.SENTRY_DSN) {
  Sentry.init({
    dsn: Config.SENTRY_DSN,
    environment: Config.SENTRY_ENVIRONMENT,
    debug: true,
  })
}

const defaultHandler =
  ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler()

if (defaultHandler) {
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    Log.error(error.stack ? error.stack : error.message, 'System')
    if (Config.SENTRY_DSN) {
      Sentry.captureException(error)
    }
    defaultHandler && defaultHandler(error, isFatal)
  })
}

if (Config.SEGMENT_IOS && Config.SEGMENT_ANDROID) {
  analytics.setup(
    Platform.OS === 'ios' ? Config.SEGMENT_IOS : Config.SEGMENT_ANDROID,
    {
      // Record screen views automatically!
      recordScreenViews: true,
      // Record certain application events automatically!
      trackAppLifecycleEvents: true,
    },
  )
}

codePush.getUpdateMetadata().then(update => {
  if (update) {
    // Sentry.setVersion(update.appVersion + '-codepush:' + update.label)
  }
})

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
}
AppRegistry.registerComponent(appName, () => codePush(codePushOptions)(App))
