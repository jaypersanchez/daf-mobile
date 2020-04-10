/**
 * Serto Mobile App
 *
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Image } from 'react-native'
import { Query, QueryResult } from 'react-apollo'
import {
  Container,
  Screen,
  ListItem,
  Text,
  Avatar,
  Constants,
} from '@kancha/kancha-ui'
import { Colors } from '../../theme'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { GET_ALL_IDENTITIES } from '../../lib/graphql/queries'

interface Result extends QueryResult {
  data: { identities: any[] }
}

interface Props extends NavigationStackScreenProps {}

const Connections: React.FC<Props> = props => {
  return (
    <Screen safeArea={true}>
      <Container flex={1}>
        <Query query={GET_ALL_IDENTITIES} onError={console.log}>
          {({ data, loading, refetch, error }: Result) =>
            error ? (
              <Text>{error.message}</Text>
            ) : (
              <FlatList
                style={{ backgroundColor: Colors.LIGHTEST_GREY, flex: 1 }}
                data={data && data.identities}
                renderItem={({ item, index }) => {
                  const imgSrc = item.profileImage
                    ? { source: { uri: item.profileImage } }
                    : {}
                  return (
                    <ListItem
                      iconLeft={
                        <Avatar
                          {...imgSrc}
                          address={item.did}
                          type={'circle'}
                          gravatarType={'retro'}
                        />
                      }
                      // onPress={() => {
                      //   props.navigation.push('Credentials', {
                      //     did: item.did,
                      //   })
                      // }}
                      last={index === data.identities.length - 1}
                    >
                      {item.shortId}
                    </ListItem>
                  )
                }}
                keyExtractor={item => item.did}
                onRefresh={refetch}
                refreshing={loading}
                ListEmptyComponent={
                  <Container padding>
                    <Text
                      type={Constants.TextTypes.H3}
                      bold
                      textColor={Colors.DARK_GREY}
                    >
                      No Connections
                    </Text>
                  </Container>
                }
              />
            )
          }
        </Query>
      </Container>
    </Screen>
  )
}

export default Connections
