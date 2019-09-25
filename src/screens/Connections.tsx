/**
 * Serto Mobile App
 *
 */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Image } from 'react-native'
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
import { NavigationScreenProps } from 'react-navigation'

interface Result extends QueryResult {
  data: { identities: Types.Identity[] }
}

interface Props extends NavigationScreenProps {}

const Connections: React.FC<Props> = props => {
  const { t } = useTranslation()
  return (
    <Screen safeArea={true}>
      <Container flex={1}>
        <Query query={Queries.getAllIdentities} onError={console.log}>
          {({ data, loading, refetch, error }: Result) =>
            error ? (
              <Text>{error.message}</Text>
            ) : (
              <FlatList
                style={{ backgroundColor: Colors.LIGHTEST_GREY, flex: 1 }}
                data={data && data.identities}
                renderItem={({ item, index }) => (
                  <ListItem
                    iconLeft={
                      <Image
                        source={{ uri: item.profileImage }}
                        style={{ width: 32, height: 32 }}
                      />
                    }
                    onPress={() => {
                      props.navigation.push('Credentials', {
                        did: item.did,
                      })
                    }}
                    last={index === data.identities.length - 1}
                  >
                    {item.shortId}
                  </ListItem>
                )}
                keyExtractor={item => item.did}
                onRefresh={refetch}
                refreshing={loading}
                ListEmptyComponent={<Text>No connections</Text>}
              />
            )
          }
        </Query>
      </Container>
    </Screen>
  )
}

export default Connections
