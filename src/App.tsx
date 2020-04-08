import React, { useEffect, useContext, useState } from 'react'
import Navigation from './navigators'
import NavigationService from './navigators/navigationService'
import Providers from './providers'
import WalletConnect from './components/WalletConnect'
import { initializeDB } from './lib/setup'
import { Toast, OverlaySign } from '@kancha/kancha-ui'
import IDSwitcher from './navigators/components/Switcher'
import './lib/I18n'

const App = () => {
  const [dbConnected, setDbConnected] = useState(false)
  const syncDaf = async () => {
    const { isConnected } = await initializeDB()
    setDbConnected(isConnected)
  }
  useEffect(() => {
    syncDaf()
  }, [])

  return dbConnected ? (
    <Providers>
      <WalletConnect navigate={NavigationService.navigate} />
      <Toast />
      <OverlaySign />
      <Navigation
        ref={navigatorRef =>
          NavigationService.setTopLevelNavigator(navigatorRef)
        }
      />
      <IDSwitcher id={'SWITCH_IDENTITY'} />
    </Providers>
  ) : null
}

export default App
