import React, { useState, createContext, useEffect } from 'react'
import Debug from 'debug'
import { agent } from '../lib/setup'
import AsyncStorage from '@react-native-community/async-storage'

const debug = Debug('daf-provider:app-state')

interface AppState {
  selectedIdentity: any
}

export const AppContext = createContext<AppState | any>({})

export const AppProvider = (props: any) => {
  const [selectedIdentity, setSelectedDid] = useState<string | null>(null)
  const setSelectedIdentity = async (did: string) => {
    await AsyncStorage.setItem('selectedIdentity', did)
    setSelectedDid(did)
  }

  useEffect(() => {
    const setDefaultIdentity = async () => {
      const storedSelectedIdentity = await AsyncStorage.getItem(
        'selectedIdentity',
      )

      debug('Stored Identity', storedSelectedIdentity)

      if (!storedSelectedIdentity) {
        const identities = await agent.identityManager.getIdentities()

        if (identities.length > 0) {
          await AsyncStorage.setItem('selectedIdentity', identities[0].did)
          setSelectedIdentity(identities[0].did)
        }
      } else {
        setSelectedDid(storedSelectedIdentity)
      }
    }

    setDefaultIdentity()
  }, [])

  return (
    <AppContext.Provider value={[selectedIdentity, setSelectedIdentity]}>
      {props.children}
    </AppContext.Provider>
  )
}
