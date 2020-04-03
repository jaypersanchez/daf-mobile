import React from 'react'
import { ApolloProvider } from '../providers/ApolloProvider'
import { AppProvider } from '../providers/AppContext'
import { WalletConnectProvider } from '../providers/WalletConnect'
import { ThemeProvider } from '@kancha/kancha-ui'
import { Theme } from '../theme'

interface ProviderProps {}

const Providers: React.FC<ProviderProps> = props => {
  return (
    <ApolloProvider>
      <AppProvider>
        <WalletConnectProvider>
          <ThemeProvider theme={Theme}>{props.children}</ThemeProvider>
        </WalletConnectProvider>
      </AppProvider>
    </ApolloProvider>
  )
}

export default Providers
