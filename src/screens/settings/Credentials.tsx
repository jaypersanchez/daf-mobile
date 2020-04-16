/**
 * Serto Mobile App
 *
 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList } from 'react-native'
import { useQuery } from '@apollo/react-hooks'
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
import { GET_CREDENTIALS_FOR_IDENTITY } from '../../lib/graphql/queries'

interface Props extends NavigationStackScreenProps {}

export const Credentials: React.FC<Props> = props => {
  const { navigation } = props
  const did = navigation.getParam('did')
  const { data, loading, error, refetch } = useQuery(
    GET_CREDENTIALS_FOR_IDENTITY,
    {
      variables: {
        did,
      },
    },
  )

  console.log(data)

  return (
    <Container />
    // <Screen safeArea={true}>
    //   <Container flex={1}>
    //     {error ? (
    //       <Text>Error</Text>
    //     ) : (
    //       <FlatList
    //         style={{ backgroundColor: Colors.LIGHTEST_GREY, flex: 1 }}
    //         data={data && data.identity && data.identity.receivedCredentials}
    //         renderItem={({ item, index }: { item: any; index: number }) => {
    //           const imgSrc = item.issuer.profileImage
    //             ? { source: { uri: item.issuer.profileImage } }
    //             : {}
    //           const claims = item.claims.map((field: any) => field)
    //           return claims.map((claim: any, index: number) => {
    //             return (
    //               <ListItem
    //                 key={item.hash}
    //                 subTitle={claims.type}
    //                 accessoryRight={
    //                   item.issuer.did === item.subject.did
    //                     ? 'Self signed'
    //                     : item.issuer.shortId
    //                 }
    //                 iconLeft={
    //                   <Avatar
    //                     {...imgSrc}
    //                     address={item.issuer.did}
    //                     type={'circle'}
    //                     gravatarType={'retro'}
    //                   />
    //                 }
    //                 last={index === data.credentials.length - 1}
    //               >
    //                 {claims.value.startsWith('https://images.app') ||
    //                 claims.value.endsWith('.jpg') ||
    //                 claims.value.endsWith('.png')
    //                   ? '<image url>'
    //                   : claims.value}
    //               </ListItem>
    //             )
    //           })
    //         }}
    //         keyExtractor={item => item.hash}
    //         onRefresh={refetch}
    //         refreshing={loading}
    //         ListEmptyComponent={
    //           !loading ? (
    //             <Container padding>
    //               <Text
    //                 type={Constants.TextTypes.H3}
    //                 bold
    //                 textColor={Colors.DARK_GREY}
    //               >
    //                 No Credentials
    //               </Text>
    //             </Container>
    //           ) : (
    //             <Container />
    //           )
    //         }
    //       />
    //     )}
    //   </Container>
    // </Screen>
  )
}

export default withNavigation(Credentials)
