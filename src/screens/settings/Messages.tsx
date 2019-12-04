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

export const GET_VIEWER = gql`
  query getViewer {
    viewer {
      did
      shortId
      profileImage
    }
  }
`

const VIEWER_MESSAGES = gql`
  query ViewerMessages($selectedDid: String!) {
    viewer {
      did
      messagesAll {
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
        sdr(sub: $selectedDid) {
          iss {
            did {
              did
              shortId
            }
            url
          }
          claimType
          reason
          essential
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
  }
`

export default () => {
  const navigation = useNavigation()
  const viewerResult = useQuery(GET_VIEWER)
  const { data, loading, refetch, error } = useQuery(VIEWER_MESSAGES, {
    variables: { selectedDid: viewerResult.data.viewer.did },
  })

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
            data={data.viewer.messagesAll}
            renderItem={({ item }: { item: DAFMessage }) => {
              return (
                <MessageItem
                  message={item}
                  viewMessage={viewMessage}
                  viewProfile={viewProfile}
                />
              )
            }}
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
