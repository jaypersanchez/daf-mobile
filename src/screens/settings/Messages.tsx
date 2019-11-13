/**
 * Serto Mobile App
 *
 */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, TextInput, Image } from 'react-native'
import { Query, QueryResult } from 'react-apollo'
import {
  Container,
  Button,
  Constants,
  Screen,
  ListItem,
  Text,
  Section,
  Avatar,
} from '@kancha/kancha-ui'
import { Colors } from '../../theme'
import moment from 'moment'
import gql from 'graphql-tag'

interface Message {
  iss: {
    did: string
    shortId: string
    profileImage: string
  }
  type: string
  rowId: string
  iat: number
}
interface Result extends QueryResult {
  data: { viewer: { messagesReceived: Message[] } }
}

const viewerMessages = gql`
  query ViewerMessages {
    viewer {
      messagesReceived {
        iss {
          did
          shortId
          profileImage
        }
        type
        rowId
        hash
        iat
        nbf
      }
    }
  }
`

export default () => {
  const { t } = useTranslation()
  return (
    <Screen safeArea={true}>
      <Container flex={1}>
        <Query
          query={viewerMessages}
          variables={
            {
              // sub: didsQuery.data.selectedDid,
            }
          }
          onError={console.log}
          fetchPolicy={'cache-and-network'}
        >
          {({ data, loading, refetch, error }: Result) =>
            error ? (
              <Text>{error.message}</Text>
            ) : (
              <FlatList
                style={{ backgroundColor: Colors.LIGHTEST_GREY, flex: 1 }}
                data={data && data.viewer && data.viewer.messagesReceived}
                renderItem={({ item, index }) => (
                  <ListItem
                    iconLeft={
                      item.iss.profileImage ? (
                        <Image
                          source={{ uri: item.iss.profileImage }}
                          style={{ width: 32, height: 32 }}
                        />
                      ) : (
                        <Avatar
                          address={item.iss.did}
                          type={'circle'}
                          gravatarType={'retro'}
                        />
                      )
                    }
                    last={index === data.viewer.messagesReceived.length - 1}
                  >
                    <Text>{item.iss.shortId}</Text>
                    <Text type={Constants.TextTypes.Summary}>
                      {moment.unix(item.iat).calendar()}
                    </Text>
                  </ListItem>
                )}
                keyExtractor={item => item.rowId}
                onRefresh={refetch}
                refreshing={loading}
              />
            )
          }
        </Query>
      </Container>
    </Screen>
  )
}
