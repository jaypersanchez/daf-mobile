/**
 * Serto Mobile App
 *
 */

import React, { useEffect } from 'react'
import {
  Container,
  Screen,
  Text,
  MessageItem,
  DAFMessage,
  Constants,
} from '@kancha/kancha-ui'
import { FlatList } from 'react-native'
import { useQuery, useLazyQuery } from 'react-apollo'
import { Colors } from '../../theme'
import { core, dataStore } from '../../lib/setup'
import { useNavigation } from 'react-navigation-hooks'
import { Screens } from '../../navigators/screens'
import { VIEWER_MESSAGES, GET_VIEWER } from '../../lib/graphql/queries'

export default () => {
  const navigation = useNavigation()
  const viewerResponse = useQuery(GET_VIEWER)
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

  useEffect(() => {
    fetchMessages()
  }, [])

  const viewProfile = (did: string) => {
    navigation.navigate(Screens.Credentials.screen, {
      did,
    })
  }

  const viewMessage = (msg: DAFMessage) => {
    navigation.navigate(Screens.MessageDetail.screen, {
      message: msg,
    })
  }

  const syncAndRefetch = async () => {
    await core.getMessagesSince(await dataStore.latestMessageTimestamps())
    fetchMessages()
  }

  return (
    <Screen safeArea={true}>
      <Container flex={1}>
        {error ? (
          <Text>Error</Text>
        ) : (
          <FlatList
            style={{ backgroundColor: Colors.LIGHTEST_GREY, flex: 1 }}
            data={data && data.viewer && data.viewer.messagesAll}
            renderItem={({ item }: { item: any }) => {
              /**
               * Temporary until messageItem is refactored
               */
              const msg = {
                id: item.id,
                type: item.type,
                nbf: item.timestamp,
                jwt: item.raw,
                iss: item.sender,
                sub: item.receiver,
              }

              return (
                <MessageItem
                  // @ts-ignore
                  message={msg}
                  viewMessage={() => viewMessage(item)}
                  viewProfile={viewProfile}
                />
              )
            }}
            keyExtractor={(item, index) => item.id + index}
            onRefresh={syncAndRefetch}
            refreshing={loading}
            ListEmptyComponent={
              <Container padding>
                <Text
                  type={Constants.TextTypes.H3}
                  bold
                  textColor={Colors.DARK_GREY}
                >
                  No messages
                </Text>
              </Container>
            }
          />
        )}
      </Container>
    </Screen>
  )
}
