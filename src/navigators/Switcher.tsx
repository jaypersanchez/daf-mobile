import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { BottomSheet, ListItem, Avatar } from '@kancha/kancha-ui'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Theme } from '../theme'
import {
  GET_MANAGED_IDENTITIES,
  SET_VIEWER,
  GET_VIEWER_PROFILE,
} from '../lib/graphql/queries'

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
  const { data } = useQuery(GET_MANAGED_IDENTITIES)
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
              const source = identity.profileImage
                ? { source: { uri: identity.profileImage } }
                : {}
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
                        { query: GET_VIEWER_PROFILE },
                      ],
                    })
                  }}
                  subTitle={identity.shortId}
                  selected={identity.isSelected}
                  iconLeft={
                    <Avatar
                      {...source}
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
