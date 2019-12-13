import React, { useEffect, useState } from 'react'
import {
  Container,
  Text,
  Screen,
  Avatar,
  Constants,
  Button,
  BottomSnap,
  RequestItem,
  Typings,
  ListItem,
  Credential,
} from '@kancha/kancha-ui'
import TabAvatar from '../../navigators/TabAvatar'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { useQuery } from '@apollo/react-hooks'
import { GET_VIEWER_CREDENTIALS, GET_VIEWER } from '../../lib/graphql/queries'
import { ActivityIndicator } from 'react-native'

const SWITCH_IDENTITY = 'SWITCH_IDENTITY'

interface Props extends NavigationStackScreenProps {}

const Profile: React.FC<Props> & {
  navigationOptions: any
} = ({ navigation }) => {
  const { data, loading } = useQuery(GET_VIEWER_CREDENTIALS)
  const viewer = data && data.viewer
  const source =
    viewer && data.viewer.profileImage
      ? { source: { uri: viewer.profileImage } }
      : {}

  console.log(data)
  return (
    <Screen scrollEnabled background={'primary'}>
      {loading && (
        <Container padding flex={1}>
          <Container
            w={100}
            h={100}
            br={5}
            background={'secondary'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <ActivityIndicator size={'large'} />
          </Container>
          <Container marginTop>
            <Container h={23} br={5} background={'secondary'}></Container>
            <Container marginTop>
              <Container
                h={60}
                backgroundColor={'#D3F4DF'}
                padding
                br={5}
              ></Container>
            </Container>
          </Container>
        </Container>
      )}

      {!loading && (
        <Container padding flex={1}>
          <Avatar
            {...source}
            type={'rounded'}
            size={100}
            address={viewer && viewer.did}
            gravatarType={'retro'}
            backgroundColor={'white'}
          />
          <Container marginTop>
            <Text type={Constants.TextTypes.H2} bold>
              {viewer && viewer.shortId}
            </Text>
            <Container marginTop>
              <Container backgroundColor={'#D3F4DF'} padding br={5}>
                <Text textStyle={{ fontFamily: 'menlo' }}>
                  {viewer && viewer.did}
                </Text>
              </Container>
            </Container>
          </Container>
        </Container>
      )}

      <Container padding>
        {!loading && viewer && viewer.credentialsReceived.length === 0 && (
          <Container>
            <Text type={Constants.TextTypes.Body}>
              No credentials to show yet!
            </Text>
          </Container>
        )}
        {!loading && viewer && viewer.credentialsReceived.length > 0 && (
          <Container>
            <Container marginBottom>
              <Text type={Constants.TextTypes.H3} bold>
                Credentials
              </Text>
              <Container marginTop>
                <Text type={Constants.TextTypes.Body}>
                  <Text bold>Received</Text> credentials are presented here as a
                  plain list for now. The plan is to move these to the data
                  explorer tab where we can explore all of our data and
                  connections.
                </Text>
              </Container>
            </Container>
            {viewer &&
              viewer.credentialsReceived &&
              viewer.credentialsReceived.map((credential: any) => {
                return (
                  <Credential
                    background={'secondary'}
                    key={credential.hash + credential.rowId}
                    exp={credential.exp}
                    issuer={credential.iss}
                    subject={credential.sub}
                    fields={credential.fields}
                  />
                )
              })}
          </Container>
        )}
      </Container>
    </Screen>
  )
}

Profile.navigationOptions = ({ navigation }: any) => {
  /**
   * Conditionally show elements depending on profile type
   */
  const params = navigation.state.params || {}
  return {
    headerRight: params.id == null && (
      <Button
        onPress={() => BottomSnap.to(1, SWITCH_IDENTITY)}
        icon={<TabAvatar />}
        iconButton
      />
    ),
  }
}

export default Profile
