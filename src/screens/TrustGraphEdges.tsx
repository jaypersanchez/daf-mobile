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
import gql from 'graphql-tag'
import { client } from '../lib/TGEClient'

export const findEdges = gql`
  query findEdges($toDID: [String]) {
    findEdges(toDID: $toDID) {
      hash
      time
      type
      from {
        did
      }
      to {
        did
      }
      visibility
      tag
      retention
      data
    }
  }
`

interface Result extends QueryResult {
  data: { findEdges: any[] }
}

export default () => {
  const { t } = useTranslation()
  return (
    <Screen safeArea={true}>
      <Container flex={1}>
        <Query
          query={findEdges}
          client={client}
          variables={{
            toDID: ['did:ethr:0x4649725d96180ba84415c47f13ed51ac194a8415'],
          }}
          onError={console.log}
        >
          {({ data, loading, refetch, error }: Result) =>
            error ? (
              <Text>{error.message}</Text>
            ) : (
              <FlatList
                style={{ backgroundColor: Colors.LIGHTEST_GREY, flex: 1 }}
                data={data.findEdges}
                renderItem={({ item, index }) => (
                  <ListItem last={index === data.findEdges.length - 1}>
                    <Text>Type: {item.type}</Text>
                    <Text>, From: {item.from.did}, </Text>
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
