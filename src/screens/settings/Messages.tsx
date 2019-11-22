/**
 * Serto Mobile App
 *
 */

import React from 'react'
import {
  Container,
  Screen,
  Text,
  MessageItem,
  DAFMessage,
  Constants,
} from '@kancha/kancha-ui'
import { FlatList } from 'react-native'
import { useQuery } from 'react-apollo'
import { Colors } from '../../theme'
import { core, dataStore } from '../../lib/setup'
import { useNavigation } from 'react-navigation-hooks'
import gql from 'graphql-tag'
import { Screens } from '../../navigators/screens'

const VIEWER_MESSAGES = gql`
  query ViewerMessages {
    viewer {
      messagesReceived {
        iss {
          did
          shortId
          profileImage
        }
        sub {
          did
          shortId
          profileImage
        }
        aud {
          did
        }
        jwt
        type
        hash
        iat
        nbf
        vc {
          fields {
            type
            value
            isObj
          }
        }
      }
    }
  }
`

export default () => {
  const navigation = useNavigation()
  const { data, loading, refetch, error } = useQuery(VIEWER_MESSAGES)

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
    await core.syncServices(await dataStore.latestMessageTimestamps())
    refetch()
  }

  return (
    <Screen safeArea={true}>
      <Container flex={1}>
        {error ? (
          <Text>Error</Text>
        ) : (
          <FlatList
            style={{ backgroundColor: Colors.LIGHTEST_GREY, flex: 1 }}
            data={data && data.viewer && data.viewer.messagesReceived}
            renderItem={({ item }: { item: DAFMessage }) => (
              <MessageItem
                message={item}
                viewMessage={viewMessage}
                viewProfile={viewProfile}
              />
            )}
            keyExtractor={(item, index) => item.hash + index}
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
