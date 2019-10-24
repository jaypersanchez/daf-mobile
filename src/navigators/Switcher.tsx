import React, { createRef, useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { BottomSheet, ListItem, Avatar } from '@kancha/kancha-ui'
import { Theme } from '../theme'
import {
  getSelectedDidQuery,
  getDidsQuery as GET_DIDS,
  Did,
} from '../lib/Signer'
import { useQuery } from '@apollo/react-hooks'
import { useApolloClient } from '@apollo/react-hooks'

interface SwitcherProps {
  id: string
}

const Switcher: React.FC<SwitcherProps> = ({ id }) => {
  const client = useApolloClient()
  const { data, refetch } = useQuery(GET_DIDS)

  return (
    <BottomSheet
      snapPoints={[-10, 450]}
      initialSnap={0}
      id={id}
      enabledInnerScrolling
    >
      {() => (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 80 }}
          style={{
            backgroundColor: Theme.colors.primary.background,
            height: 450,
          }}
        >
          {data &&
            data.dids &&
            data.dids.map((identity: Did, index: number) => {
              return (
                <ListItem
                  key={identity.did}
                  hideForwardArrow
                  onPress={() => {
                    client.writeQuery({
                      query: getSelectedDidQuery,
                      data: { selectedDid: identity.did },
                    })
                    refetch()
                  }}
                  subTitle={identity.did.substring(0, 25) + '...'}
                  selected={identity.isSelected}
                  iconLeft={
                    <Avatar
                      border={!identity.isSelected}
                      address={identity.did}
                      type={'circle'}
                      gravatarType={'retro'}
                    />
                  }
                >
                  Identity {index + 1}
                </ListItem>
              )
            })}
        </ScrollView>
      )}
    </BottomSheet>
  )
}

export default Switcher
