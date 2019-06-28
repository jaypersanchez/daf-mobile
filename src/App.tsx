import React from 'react'
import codePush, { DownloadProgress } from 'react-native-code-push'
import { handleCodePushStatusChange } from './lib/CodepushHelpers'
import Navigation from './navigators'
import Provider from './lib/GraphQL'
import Log from './lib/Log'
import './lib/I18n'

import { ThemeProvider } from '@kancha/kancha-ui'
import { Theme } from './theme'

class App extends React.Component {
  codePushStatusDidChange(status: codePush.SyncStatus) {
    handleCodePushStatusChange(status)
  }

  codePushDownloadDidProgress(progress: DownloadProgress) {
    // console.log(progress.receivedBytes + ' of ' + progress.totalBytes + ' received.');
  }

  render() {
    return (
      <Provider>
        <ThemeProvider theme={Theme}>
          <Navigation />
        </ThemeProvider>
      </Provider>
    )
  }
}

export default App
