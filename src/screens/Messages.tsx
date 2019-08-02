/**
 * Serto Mobile App
 *
 */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, TextInput, Image } from 'react-native'
import { Query, Mutation, MutationState, QueryResult } from 'react-apollo'
import { Queries, Types } from '../lib/serto-graph'
import {
  Container,
  Button,
  Constants,
  Screen,
  ListItem,
  Text,
  Section,
} from '@kancha/kancha-ui'
import { Colors } from '../theme'
import moment from 'moment'

interface Result extends QueryResult {
  data: { messages: Types.Message[] }
}

export default () => {
  const { t } = useTranslation()
  return (
    <Screen safeArea={true}>
      <Container flex={1}>
        <Query query={Queries.findMessages} onError={console.log}>
          {({ data, loading, refetch, error }: Result) =>
            error ? (
              <Text>{error.message}</Text>
            ) : (
              <FlatList
                style={{ backgroundColor: Colors.LIGHTEST_GREY, flex: 1 }}
                data={data.messages}
                renderItem={({ item, index }) => (
                  <ListItem
                    iconLeft={
                      <Image
                        source={{ uri: item.iss.profileImage }}
                        style={{ width: 32, height: 32 }}
                      />
                    }
                    last={index === data.messages.length - 1}
                  >
                    <Text>{item.iss.shortId}</Text>
                    <Text type={Constants.TextTypes.Summary}>
                      {moment.unix(item.time).calendar()}
                    </Text>
                  </ListItem>
                )}
                keyExtractor={item => item.hash}
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
