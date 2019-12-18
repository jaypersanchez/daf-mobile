import React from 'react'
import Navigation from './navigators'
import NavigationEvents from './navigators/components/NavigationEvents'
import Provider from './lib/ApolloProvider'
import './lib/I18n'

import { ThemeProvider, Toast, OverlaySign } from '@kancha/kancha-ui'
import IDSwitcher from './navigators/components/Switcher'
import NavigationService from './navigators/navigationService'
import { Theme } from './theme'

const App = () => {
  return (
    <Provider>
      <ThemeProvider theme={Theme}>
        <Toast />
        <OverlaySign />
        <Navigation
          ref={navigatorRef =>
            NavigationService.setTopLevelNavigator(navigatorRef)
          }
        />
        <IDSwitcher id={'SWITCH_IDENTITY'} />
      </ThemeProvider>
    </Provider>
  )
}

export default App
