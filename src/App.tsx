import React from 'react'
import { ApolloProvider } from 'react-apollo'
import './lib/I18n'
import Navigation from './screens/Navigation'
import { client } from './lib/GraphQL'
import Log from './lib/Log'
import codePush, { DownloadProgress } from 'react-native-code-push'

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
    switch (status) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        Log.info('Checking for updates.', 'Codepush')
        break
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        Log.info('Downloading package.', 'Codepush')
        break
      case codePush.SyncStatus.INSTALLING_UPDATE:
        Log.info('Installing update.', 'Codepush')
        break
      case codePush.SyncStatus.UP_TO_DATE:
        Log.info('Up-to-date.', 'Codepush')
        break
      case codePush.SyncStatus.UPDATE_INSTALLED:
        Log.info('Update installed.', 'Codepush')
        break
    }
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
