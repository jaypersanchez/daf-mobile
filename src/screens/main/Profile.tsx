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
} from '@kancha/kancha-ui'
import TabAvatar from '../../navigators/TabAvatar'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { GET_VIEWER_CREDENTIALS } from '../../lib/graphql/queries'

const SWITCH_IDENTITY = 'SWITCH_IDENTITY'
// tslint:disable-next-line:no-var-requires
const avatar1 = require('../../assets/images/space-x-logo.jpg')

interface Props extends NavigationStackScreenProps {}

const Profile: React.FC<Props> & {
  navigationOptions: any
} = ({ navigation }) => {
  const id = navigation.getParam('id', null)
  const { data } = useQuery(GET_VIEWER_CREDENTIALS)
  const [viewer, setViewer] = useState<any>({})

  useEffect(() => {
    if (data && data.viewer && data.viewer.did) {
      setViewer(data.viewer)
      navigation.setParams({ selectedDid: data.viewer.did })
    }
  }, [data])

  const source =
    data && data.viewer && data.viewer.profileImage
      ? { source: { uri: data.viewer.profileImage } }
      : {}

  return (
    <Screen scrollEnabled background={'primary'}>
      <Container padding flex={1}>
        {id ? (
          <Avatar
            type={'rounded'}
            size={60}
            source={avatar1}
            backgroundColor={'white'}
          />
        ) : (
          <Avatar
            {...source}
            type={'rounded'}
            size={60}
            address={viewer.did}
            gravatarType={'retro'}
            backgroundColor={'white'}
          />
        )}
        <Container marginTop={8}>
          <Text type={Constants.TextTypes.H3} bold>
            {id ? 'Space X' : viewer.shortId}
          </Text>
          <Container marginTop={4}>
            <Text type={Constants.TextTypes.SubTitle}>{viewer.did}</Text>
          </Container>
          {!id && (
            <>
              <Container marginTop>
                <Text type={Constants.TextTypes.Body}></Text>
              </Container>
            </>
          )}
        </Container>
      </Container>
      {!id && (
        <Container>
          <Container paddingLeft>
            <Text type={Constants.TextTypes.H3} bold>
              Credentials
            </Text>
          </Container>
          <Container>
            {viewer.credentialsReceived &&
              viewer.credentialsReceived.map((credential: any) => {
                return (
                  credential &&
                  credential.fields.map((field: any, index: number) => (
                    <ListItem key={index} subTitle={field.type}>
                      {field.value}
                    </ListItem>
                  ))
                )
              })}
          </Container>
        </Container>
      )}
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
