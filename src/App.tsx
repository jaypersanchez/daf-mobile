import React from 'react'
import { ApolloProvider } from 'react-apollo'
import Navigation from './screens/Navigation'
import { client } from './lib/GraphQL'
import Log from './lib/Log'
import Analytics from 'appcenter-analytics'

Analytics.setEnabled(true)

const defaultHandler =
  ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler()
if (defaultHandler) {
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    Log.error(error.stack ? error.stack : error.message, 'System')
    defaultHandler && defaultHandler(error, isFatal)
  })
}

const App = () => (
  <ApolloProvider client={client}>
    <Navigation />
  </ApolloProvider>
)

export default App
