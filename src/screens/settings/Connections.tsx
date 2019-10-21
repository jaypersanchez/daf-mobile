/**
 * Serto Mobile App
 *
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Image } from 'react-native'
import { Query, QueryResult } from 'react-apollo'
import { Queries, Types } from '../../lib/serto-graph'
import { Container, Screen, ListItem, Text } from '@kancha/kancha-ui'
import { Colors } from '../../theme'
import { NavigationStackScreenProps } from 'react-navigation-stack'

interface Result extends QueryResult {
  data: { identities: Types.Identity[] }
}

interface Props extends NavigationStackScreenProps {}

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
