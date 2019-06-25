import React from 'react'
import { ApolloProvider } from 'react-apollo'
import codePush, { DownloadProgress } from 'react-native-code-push'
import { handleCodePushStatusChange } from './lib/CodepushHelpers'
import Navigation from './navigators'
import { client } from './lib/GraphQL'
import Log from './lib/Log'
import './lib/I18n'

import { ThemeProvider } from '@kancha/kancha-ui'
import { Theme } from './theme'

const defaultHandler =
  ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler()
if (defaultHandler) {
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    Log.error(error.stack ? error.stack : error.message, 'System')
    defaultHandler && defaultHandler(error, isFatal)
  })
}

class App extends React.Component {
  codePushStatusDidChange(status: codePush.SyncStatus) {
    handleCodePushStatusChange(status)
  }

  codePushDownloadDidProgress(progress: DownloadProgress) {
    // console.log(progress.receivedBytes + ' of ' + progress.totalBytes + ' received.');
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <ThemeProvider theme={Theme}>
          <Navigation />
        </ThemeProvider>
      </ApolloProvider>
    )
  }
}

export default App
