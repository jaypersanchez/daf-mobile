import React from 'react'
import { ApolloProvider } from 'react-apollo'
import codePush, { DownloadProgress } from 'react-native-code-push'
import './lib/I18n'
import Navigation from './screens/Navigation'
import { client } from './lib/GraphQL'
import Log from './lib/Log'
import { handleCodePushStatusChange } from './lib/CodepushHelpers'

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
        <Navigation />
      </ApolloProvider>
    )
  }
}

export default App
