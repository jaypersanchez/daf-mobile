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
import { useQuery } from 'react-apollo'
import { Colors } from '../../theme'
import { useNavigation } from 'react-navigation-hooks'
import { Screens } from '../../navigators/screens'
import { ALL_MESSAGES } from '../../lib/graphql/queries'

export default () => {
  const navigation = useNavigation()

  const { loading, data, error, refetch } = useQuery(ALL_MESSAGES)

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

  console.log(data)

  return (
    <Screen safeArea={true}>
      <Container flex={1}>
        {error ? (
          <Text>Error</Text>
        ) : (
          <FlatList
            style={{ backgroundColor: Colors.LIGHTEST_GREY, flex: 1 }}
            data={data && data.messages && data.messages && data.messages}
            renderItem={({ item }: { item: any }) => {
              /**
               * Temporary until messageItem is refactored
               */
              const msg = {
                id: item.id,
                type: item.type,
                nbf: item.saveDate,
                jwt: item.raw,
                iss: item.from,
                sub: item.to,
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
            keyExtractor={item => item.id}
            onRefresh={() => refetch()}
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
