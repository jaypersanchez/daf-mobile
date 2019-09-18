import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'
import Navigation from './navigators'
import { client } from './lib/GraphQL'
import './lib/I18n'

import { ThemeProvider, Toast } from '@kancha/kancha-ui'
import { Theme } from './theme'

const App = () => {
  return (
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <ThemeProvider theme={Theme}>
          <Toast />
          <Navigation />
        </ThemeProvider>
      </ApolloHooksProvider>
    </ApolloProvider>
  )
}

export default App
