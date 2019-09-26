import React from 'react'
import Navigation from './navigators'
import Provider from './lib/GraphQL'
import './lib/I18n'

import { ThemeProvider, Toast } from '@kancha/kancha-ui'
import { Theme } from './theme'

const App = () => {
  return (
    <Provider>
      <ThemeProvider theme={Theme}>
        <Toast />
        <Navigation />
      </ThemeProvider>
    </Provider>
  )
}

export default App
