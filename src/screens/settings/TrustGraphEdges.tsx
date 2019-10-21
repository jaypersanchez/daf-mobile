/**
 * Serto Mobile App
 *
 */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, TextInput, Image } from 'react-native'
import { Query, QueryResult } from 'react-apollo'
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks'

import {
  Container,
  Button,
  Constants,
  Screen,
  ListItem,
  Text,
  Section,
} from '@kancha/kancha-ui'
import { Colors } from '../../theme'
import moment from 'moment'
import gql from 'graphql-tag'
import { trustGraphClient } from '../../lib/GraphQL'
import { getDidsQuery as GET_DIDS } from '../../lib/Signer'

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
  const { data, loading, error } = useQuery(GET_DIDS)

  return (
    <Screen safeArea={true}>
      <Container flex={1}>
        <Container padding>
          <Button
            fullWidth
            type={Constants.BrandOptions.Primary}
            block={Constants.ButtonBlocks.Filled}
            buttonText={t('Sync')}
            onPress={async () => await trustGraphClient.syncLatestMessages()}
          />
        </Container>
        <Query
          query={findEdges}
          client={trustGraphClient.getClient()}
          variables={{
            toDID: [data && data.selectedDid],
          }}
          onError={console.log}
        >
          {({ data, loading, refetch, error }: Result) =>
            error ? (
              <Text>{error.message}</Text>
            ) : (
              <FlatList
                style={{ backgroundColor: Colors.LIGHTEST_GREY, flex: 1 }}
                data={data && data.findEdges}
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
                ListEmptyComponent={<Text>No edges</Text>}
              />
            )
          }
        </Query>
      </Container>
    </Screen>
  )
}
