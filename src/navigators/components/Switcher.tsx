import React, { useContext } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import {
  BottomSheet,
  ListItem,
  Avatar,
  BottomSnap,
  Container,
  Button,
  Icon,
  Overlay,
} from '@kancha/kancha-ui'
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks'
import { Theme, Colors } from '../../theme'
import {
  GET_MANAGED_IDENTITIES,
  SET_VIEWER,
  CREATE_IDENTITY,
} from '../../lib/graphql/queries'
import AppConstants from '../../constants'
import { AppContext } from '../../providers/AppContext'

const { SWITCHING_IDENTITY } = AppConstants.modals

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
  const [selectedIdentity, setSelectedIdentity] = useContext(AppContext)
  const { data } = useQuery(GET_MANAGED_IDENTITIES)
  const [createIdentity] = useMutation(CREATE_IDENTITY, {
    refetchQueries: [{ query: GET_MANAGED_IDENTITIES }],
    variables: {
      type: 'rinkeby-ethr-did',
    },
  })

  const managedIdentities =
    data && data.managedIdentities && data.managedIdentities

  const switchIdentity = async (identity: Identity) => {
    BottomSnap.to(0, id)

    setSelectedIdentity(identity.did)

    Overlay.show(
      SWITCHING_IDENTITY.title,
      SWITCHING_IDENTITY.message,
      SWITCHING_IDENTITY.icon,
      SWITCHING_IDENTITY.delay,
    )

    client.reFetchObservableQueries()
  }

  return (
    <BottomSheet
      snapPoints={[-15, 350]}
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
                  <Container key={identity.did}>
                    <ListItem
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
                    {/* {identity.isSelected && (
                      <Container flexDirection={'row'} paddingLeft={75}>
                        <Container
                          borderWidth={1}
                          borderColor={Colors.LIGHT_GREY}
                          padding={6}
                          br={5}
                        >
                          <Text textStyle={{ fontSize: 12 }}>
                            34 Credentials received
                          </Text>
                        </Container>
                      </Container>
                    )} */}
                  </Container>
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
