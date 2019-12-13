import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import {
  BottomSheet,
  ListItem,
  Avatar,
  BottomSnap,
  Container,
  Button,
  Icon,
} from '@kancha/kancha-ui'
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks'
import { Theme, Colors } from '../theme'
import {
  GET_MANAGED_IDENTITIES,
  SET_VIEWER,
  IMPORT_IDENTITY,
  CREATE_IDENTITY,
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
  const client = useApolloClient()
  const { data } = useQuery(GET_MANAGED_IDENTITIES)
  const [setViewer] = useMutation(SET_VIEWER)
  const [createIdentity] = useMutation(CREATE_IDENTITY, {
    refetchQueries: [{ query: GET_MANAGED_IDENTITIES }],
    variables: {
      type: 'rnEthr',
    },
  })

  const managedIdentities =
    data && data.managedIdentities && data.managedIdentities

  const switchIdentity = async (identity: Identity) => {
    BottomSnap.to(0, id)

    await setViewer({
      variables: {
        did: identity.did,
      },
    })
    client.reFetchObservableQueries()
  }

  return (
    <BottomSheet
      snapPoints={[-10, 350]}
      initialSnap={0}
      id={id}
      enabledInnerScrolling
    >
      {() => (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 80 }}
          style={{
            backgroundColor: Theme.colors.primary.background,
            height: 350,
          }}
        >
          {managedIdentities &&
            managedIdentities
              .sort(
                (id1: Identity, id2: Identity) =>
                  (id2.isSelected ? 1 : 0) - (id1.isSelected ? 1 : 0),
              )
              .map((identity: Identity) => {
                const source = identity.profileImage
                  ? { source: { uri: identity.profileImage } }
                  : {}
                return (
                  <ListItem
                    key={identity.did}
                    hideForwardArrow
                    onPress={() => switchIdentity(identity)}
                    selected={identity.isSelected}
                    last
                    iconLeft={
                      <Avatar
                        {...source}
                        size={45}
                        address={identity.did}
                        type={'circle'}
                        gravatarType={'retro'}
                      />
                    }
                  >
                    {identity.shortId}
                  </ListItem>
                )
              })}
          <Container padding alignItems={'center'} dividerTop>
            <Button
              iconButton
              buttonText={'Create identity'}
              icon={
                <Icon
                  color={Colors.CONFIRM}
                  icon={{ name: 'ios-add-circle', iconFamily: 'Ionicons' }}
                />
              }
              onPress={() => createIdentity()}
            />
          </Container>
        </ScrollView>
      )}
    </BottomSheet>
  )
}

export default Switcher
