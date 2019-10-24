import React from 'react'
import Navigation from './navigators'
import Provider from './lib/GraphQL'
import './lib/I18n'

import { ThemeProvider, Toast } from '@kancha/kancha-ui'
import IDSwitcher from './navigators/Switcher'
import { Theme } from './theme'

const App = () => {
  return (
    <Provider>
      <ThemeProvider theme={Theme}>
        <Toast />
        <Navigation />
        <IDSwitcher id={'SWITCH_IDENTITY'} />
      </ThemeProvider>
    </Provider>
  )
}

export default App
