import React, { useState, createContext, useEffect } from 'react'

interface AppState {
  selectedDid: string
}

export const AppContext = createContext<AppState | any>({})

export const AppProvider = (props: any) => {
  const [selectedDid, setSelectedDid] = useState()

  return (
    <AppContext.Provider value={[selectedDid, setSelectedDid]}>
      {props.children}
    </AppContext.Provider>
  )
}
