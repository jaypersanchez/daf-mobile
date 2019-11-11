import React, { createRef, useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { BottomSheet, ListItem, Avatar } from '@kancha/kancha-ui'
import { Theme } from '../theme'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useApolloClient } from '@apollo/react-hooks'
import {
  GET_MANAGED_IDENTITIES,
  SET_VIEWER,
  GET_VIEWER,
} from '../lib/rn-packages/rn-graphql/queries'

interface Identity {
  did: string
  shortId: string
  isSelected: boolean
  profileImage?: string
}

interface SwitcherProps {
  id: string
}

const Switcher: React.FC<SwitcherProps> = ({ id }) => {
  const client = useApolloClient()
  const { data, refetch } = useQuery(GET_MANAGED_IDENTITIES)
  const [setViewer] = useMutation(SET_VIEWER)

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
            data.managedIdentities &&
            data.managedIdentities.map((identity: Identity, index: number) => {
              return (
                <ListItem
                  key={identity.did}
                  hideForwardArrow
                  onPress={() => {
                    setViewer({
                      variables: {
                        did: identity.did,
                      },
                      refetchQueries: [
                        { query: GET_MANAGED_IDENTITIES },
                        { query: GET_VIEWER },
                      ],
                    })
                  }}
                  subTitle={identity.shortId}
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
