/**
 * Serto Mobile App
 *
 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Image } from 'react-native'
import { Query, QueryResult } from 'react-apollo'
import { Types } from 'daf-data-store'
import { Container, Screen, ListItem, Text, Avatar } from '@kancha/kancha-ui'
import { Colors } from '../../theme'
import { withNavigation } from 'react-navigation'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import gql from 'graphql-tag'

export const findCredentials = gql`
  query FindCredentials($iss: ID, $sub: ID) {
    credentials(iss: $iss, sub: $sub) {
      rowId
      hash
      parentHash
      iss {
        did
        shortId
        profileImage
      }
      sub {
        did
      }
      nbf
      fields {
        type
        value
        isObj
      }
    }
  }
`

interface Result extends QueryResult {
  data: { credentials: Types.VerifiableClaim[] }
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
          query={findCredentials}
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
                data={data && data.credentials}
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
                    last={index === data.credentials.length - 1}
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
