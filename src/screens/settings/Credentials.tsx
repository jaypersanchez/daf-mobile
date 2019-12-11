/**
 * Serto Mobile App
 *
 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList } from 'react-native'
import { useQuery } from 'react-apollo'
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
import { isTerminating } from 'apollo-link/lib/linkUtils'

export const GET_CREDENTIALS = gql`
  query FindCredentials($iss: ID, $sub: ID) {
    credentials(iss: $iss, sub: $sub) {
      rowId
      hash
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
      inMessages {
        id
      }
    }
  }
`

interface Props extends NavigationStackScreenProps {}

export const Credentials: React.FC<Props> = props => {
  const { navigation } = props
  const did = navigation.getParam('did')

  const { data, loading, error, refetch } = useQuery(GET_CREDENTIALS, {
    variables: {
      sub: did,
    },
  })

  console.log(data)

  return (
    <Screen safeArea={true}>
      <Container flex={1}>
        {error ? (
          <Text>Error</Text>
        ) : (
          <FlatList
            style={{ backgroundColor: Colors.LIGHTEST_GREY, flex: 1 }}
            data={data && data.credentials}
            renderItem={({ item, index }: { item: any; index: number }) => {
              const imgSrc = item.iss.profileImage
                ? { source: { uri: item.iss.profileImage } }
                : {}
              const fields = item.fields.map((field: any) => field)
              return fields.map((field: any) => {
                return (
                  <ListItem
                    subTitle={field.type}
                    accessoryRight={
                      item.iss.did === item.sub.did
                        ? 'Self signed'
                        : item.iss.shortId
                    }
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
                    {field.value.startsWith('https://images.app') ||
                    field.value.endsWith('.jpg') ||
                    field.value.endsWith('.png')
                      ? '<image url>'
                      : field.value}
                  </ListItem>
                )
              })
            }}
            keyExtractor={(item, index) => item.rowId + index}
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
        )}
      </Container>
    </Screen>
  )
}

export default withNavigation(Credentials)
