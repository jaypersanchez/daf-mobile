/**
 * Serto Mobile App
 *
 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Image } from 'react-native'
import { Query, QueryResult } from 'react-apollo'
import { Types } from 'daf-data-store'
import {
  Container,
  Screen,
  ListItem,
  Text,
  Avatar,
  Constants,
} from '@kancha/kancha-ui'
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
                renderItem={({ item, index }) => {
                  const imgSrc = item.iss.profileImage
                    ? { source: { uri: item.iss.profileImage } }
                    : {}
                  const fields = item.fields.map(field => field)
                  return (
                    <ListItem
                      onPress={() =>
                        navigation.navigate('CredentialField', {
                          hash: item.parentHash,
                        })
                      }
                      subTitle={fields[0].type}
                      iconLeft={
                        <Avatar
                          {...imgSrc}
                          address={item.iss.did}
                          type={'circle'}
                          gravatarType={'retro'}
                        />
                      }
                      last={index === data.credentials.length - 1}
                    >
                      {fields[0].value}
                    </ListItem>
                  )
                }}
                keyExtractor={item => item.rowId}
                onRefresh={refetch}
                refreshing={loading}
                ListEmptyComponent={
                  !loading ? (
                    <Container padding>
                      <Text
                        type={Constants.TextTypes.H3}
                        bold
                        textColor={Colors.DARK_GREY}
                      >
                        No Credentials
                      </Text>
                    </Container>
                  ) : (
                    <Container />
                  )
                }
              />
            )
          }
        </Query>
      </Container>
    </Screen>
  )
}

export default withNavigation(Credentials)
