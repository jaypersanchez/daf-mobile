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
import { withNavigation } from 'react-navigation'
import { NavigationStackScreenProps } from 'react-navigation-stack'

interface Result extends QueryResult {
  data: { claims: Types.VerifiableClaim[] }
}

interface Props extends NavigationStackScreenProps {}

export const Credentials: React.FC<Props> = props => {
  const { navigation } = props
  const did = navigation.getParam('did', 'Did does not exist anymore')
  const { t } = useTranslation()
  return (
    <Screen safeArea={true}>
      <Container flex={1}>
        <Query
          query={Queries.findClaims}
          variables={{ sub: did }}
          onError={console.log}
          fetchPolicy={'network-only'}
        >
          {({ data, loading, refetch, error }: Result) =>
            error ? (
              <Text>{error.message}</Text>
            ) : (
              <FlatList
                style={{ backgroundColor: Colors.LIGHTEST_GREY, flex: 1 }}
                data={data && data.claims}
                renderItem={({ item, index }) => (
                  <ListItem
                    iconLeft={
                      <Image
                        source={{ uri: item.iss.profileImage }}
                        style={{ width: 32, height: 32 }}
                      />
                    }
                    last={index === data.claims.length - 1}
                  >
                    {item.fields.map(field => field.type + ' = ' + field.value)}
                  </ListItem>
                )}
                keyExtractor={item => item.rowId}
                onRefresh={refetch}
                refreshing={loading}
                ListEmptyComponent={<Text>No credentials</Text>}
              />
            )
          }
        </Query>
      </Container>
    </Screen>
  )
}

export default withNavigation(Credentials)
