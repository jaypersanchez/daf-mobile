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
import { NavigationStackScreenProps } from 'react-navigation-stack'
import gql from 'graphql-tag'

export const getAllIdentities = gql`
  query GetAllIdentities {
    identities {
      did
      shortId
      firstName
      lastName
      profileImage
    }
  }
`

interface Result extends QueryResult {
  data: { identities: Types.Identity[] }
}

interface Props extends NavigationStackScreenProps {}

const Connections: React.FC<Props> = props => {
  const { t } = useTranslation()
  return (
    <Screen safeArea={true}>
      <Container flex={1}>
        <Query query={getAllIdentities} onError={console.log}>
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
                      item.profileImage ? (
                        <Image
                          source={{ uri: item.profileImage }}
                          style={{ width: 32, height: 32 }}
                        />
                      ) : (
                        <Avatar
                          address={item.did}
                          type={'circle'}
                          gravatarType={'retro'}
                        />
                      )
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
