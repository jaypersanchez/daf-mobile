import React, { useState, createContext, useEffect } from 'react'
import Debug from 'debug'
import { core } from '../lib/setup'
import AsyncStorage from '@react-native-community/async-storage'

const debug = Debug('daf-provider:app-state')

interface AppState {
  selectedIdentity: any
}

export const AppContext = createContext<AppState | any>({})

export const AppProvider = (props: any) => {
  const [selectedIdentity, setSelectedIdentity] = useState()

  useEffect(() => {
    const setDefaultIdentity = async () => {
      const storedSelectedIdentity = await AsyncStorage.getItem(
        'selectedIdentity',
      )
      if (!storedSelectedIdentity) {
        const identities = await core.identityManager.getIdentities()
        console.log(identities)

        if (identities.length > 0) {
          await AsyncStorage.setItem(
            'selectedIdentity',
            JSON.stringify(identities[0]),
          )
          setSelectedIdentity(identities[0].did)
        }
      } else {
        const storedIdentity = JSON.parse(storedSelectedIdentity)
        setSelectedIdentity(storedIdentity.did)
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
