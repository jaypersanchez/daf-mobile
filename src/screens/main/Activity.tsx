import React, { useEffect, useState } from 'react'
import {
  Container,
  Text,
  Screen,
  ActivityItem,
  Button,
  Device,
  Constants,
  Credential,
  Avatar,
  Typings,
} from '@kancha/kancha-ui'
import { ActivityIndicator } from 'react-native'
import { Colors } from '../../theme'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { useQuery, useLazyQuery } from 'react-apollo'
import { core, dataStore } from '../../lib/setup'
import {
  VIEWER_MESSAGES,
  GET_VIEWER,
  GET_ALL_IDENTITIES,
} from '../../lib/graphql/queries'
import { FlatList } from 'react-native'
import { SharedElement } from 'react-navigation-shared-element'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'

interface Props extends NavigationStackScreenProps {}

const Activity: React.FC<Props> = ({ navigation }) => {
  const viewerResponse = useQuery(GET_VIEWER)
  const identitiesResponse = useQuery(GET_ALL_IDENTITIES)
  const [getMessages, { loading, data, error }] = useLazyQuery(VIEWER_MESSAGES)

  const fetchMessages = () => {
    if (viewerResponse && viewerResponse.data && viewerResponse.data.viewer) {
      getMessages({
        variables: {
          selectedDid: viewerResponse.data.viewer.did,
        },
      })
    }
  }

  const showFirstLoadModal = () => {
    if (viewerResponse && viewerResponse.data && viewerResponse.data.viewer) {
      navigation.navigate('CreateFirstCredential', {
        did: viewerResponse.data.viewer.did,
        fetchMessages,
      })
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const viewAttachments = (credentials: any[], credentialIndex: number) => {
    navigation.navigate('CredentialDetail', {
      credentials,
      credentialIndex,
      credentialStyle: { background: 'primary', shadow: 1.5 },
    })
  }

  const viewProfile = (did: any) => {
    navigation.navigate('Profile', {
      did,
      isViewer: viewerResponse.data.viewer.did === did,
    })
  }

  const syncAndRefetch = async () => {
    await core.getMessagesSince(await dataStore.latestMessageTimestamps())
    fetchMessages()
  }

  const confirmRequest = (msg: any) => {
    navigation.navigate('Request', {
      requestMessage: msg,
      viewerDid: data.viewer.did,
    })
  }

  const loader = (
    <Container
      flexDirection={'row'}
      alignItems={'center'}
      padding={10}
      br={20}
      viewStyle={{
        position: 'absolute',
        bottom: 50,
        zIndex: 100,
        left: Device.width / 2 - 100,
        width: 200,
        backgroundColor: 'rgba(0,0,0,0.8)',
      }}
    >
      <Container marginRight={10}>
        <ActivityIndicator />
      </Container>
      <Text textColor={Colors.WHITE}>Loading activity...</Text>
    </Container>
  )

  /**
   * Moving to kancha when better defined
   * */
  const ContactsHeader = (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ backgroundColor: Colors.WHITE, marginBottom: 1 }}
    >
      <Container flexDirection={'row'}>
        {identitiesResponse &&
          identitiesResponse.data &&
          identitiesResponse.data.identities &&
          identitiesResponse.data.identities.map(
            (identity: Typings.Identity) => {
              const displayDid = identity.shortId.startsWith('did:ethr:')
                ? identity.shortId.slice(9, -4)
                : identity.shortId
              const identityProfileSource = identity.profileImage
                ? { uri: identity.profileImage }
                : {}
              return (
                <Container
                  key={identity.did}
                  w={90}
                  padding={10}
                  alignItems={'center'}
                  justifyContent={'center'}
                  br={10}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Profile', {
                        did: identity.did,
                      })
                    }
                  >
                    <Container alignItems={'center'}>
                      <Container marginBottom={10}>
                        <Avatar
                          address={identity.did}
                          size={60}
                          gravatarType={'retro'}
                          {...identityProfileSource}
                        />
                      </Container>
                      <Text textStyle={{ fontSize: 14 }}>{displayDid}</Text>
                    </Container>
                  </TouchableOpacity>
                </Container>
              )
            },
          )}
      </Container>
    </ScrollView>
  )

  return (
    <Screen background={'secondary'} safeArea={true}>
      <Container flex={1}>
        {loading && loader}
        {error ? (
          <Text>Error</Text>
        ) : (
          <FlatList
            ListHeaderComponent={ContactsHeader}
            style={{ backgroundColor: Colors.LIGHTEST_GREY, flex: 1 }}
            data={data && data.viewer && data.viewer.messagesAll}
            onRefresh={syncAndRefetch}
            refreshing={loading}
            renderItem={({ item }: { item: any }) => (
              <ActivityItem
                id={item.id}
                type={item.type}
                message={item}
                profileAction={viewProfile}
                date={item.timestamp * 1000}
                viewer={viewerResponse && viewerResponse.data.viewer}
                sender={item.sender}
                receiver={item.receiver}
                confirm={confirmRequest}
                attachments={item.vc}
                renderAttachment={(
                  credential: any,
                  credentialIndex: number,
                ) => (
                  <Container
                    w={Device.width - 40}
                    padding
                    paddingRight={0}
                    key={credential.hash + credential.rowId}
                  >
                    <SharedElement id={credential.hash + credential.rowId}>
                      <Credential
                        onPress={() =>
                          viewAttachments(item.vc, credentialIndex)
                        }
                        exp={credential.exp}
                        fields={credential.fields}
                        subject={credential.sub}
                        issuer={credential.iss}
                        shadow={1.5}
                        background={'primary'}
                      />
                    </SharedElement>
                  </Container>
                )}
                actions={['Share']}
              />
            )}
            keyExtractor={(item, index) => item.id + index}
            ListEmptyComponent={
              <Container>
                {!loading && (
                  <Container padding background={'secondary'}>
                    <Text bold type={Constants.TextTypes.H3}>
                      Hey there,
                    </Text>
                    <Container marginBottom marginTop={5}>
                      <Text type={Constants.TextTypes.Body}>
                        It looks like you are new here? You can start by issuing
                        yourself a<Text bold> name </Text>
                        credential!
                      </Text>
                    </Container>
                    <Button
                      fullWidth
                      buttonText={'Get started'}
                      onPress={showFirstLoadModal}
                      type={Constants.BrandOptions.Primary}
                      block={Constants.ButtonBlocks.Outlined}
                    />
                  </Container>
                )}
                {[1, 2, 3, 4].map((fakeItem: number) => (
                  <Container
                    background={'primary'}
                    padding
                    marginBottom={5}
                    key={fakeItem}
                  >
                    <Container
                      background={'secondary'}
                      viewStyle={{ borderRadius: 20, width: 40, height: 40 }}
                    ></Container>
                    <Container
                      background={'secondary'}
                      h={90}
                      br={10}
                      marginTop={20}
                    ></Container>
                  </Container>
                ))}
              </Container>
            }
          />
        )}
      </Container>
    </Screen>
  )
}

export default Activity
