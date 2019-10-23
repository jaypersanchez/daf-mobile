import React, { createRef } from 'react'
import {
  Container,
  Text,
  Screen,
  Avatar,
  Constants,
  Button,
  RequestItem,
  BottomSheet,
  ListItem,
} from '@kancha/kancha-ui'
import { ScrollView } from 'react-native-gesture-handler'
import {
  NavigationStackScreenProps,
  NavigationStackOptions,
} from 'react-navigation-stack'
import { useQuery, useApolloClient } from '@apollo/react-hooks'
import { getDidsQuery as GET_DIDS, Did } from '../../lib/Signer'
import { Theme } from '../../theme'

// tslint:disable-next-line:no-var-requires
const avatar1 = require('../../assets/images/space-x-logo.jpg')

// tslint:disable-next-line:no-var-requires
const avatar2 = require('../../assets/images/kitten-avatar.jpg')

interface Props extends NavigationStackScreenProps {}

const Profile: React.FC<Props> & {
  navigationOptions: NavigationStackOptions
} = ({ navigation }) => {
  const id = navigation.getParam('id', null)
  const bottomDrawer = createRef<any>()
  const { data, loading } = useQuery(GET_DIDS)
  const client = useApolloClient()
  const hasIdentityAndNotLoading = !loading && data && data.dids.length > 0

  return (
    <Screen
      scrollEnabled
      background={'primary'}
      bottomSheet={
        <BottomSheet
          ref={bottomDrawer}
          snapPoints={[-10, 200, 400]}
          initialSnap={0}
        >
          <ScrollView
            style={{
              backgroundColor: Theme.colors.primary.background,
              height: 400,
            }}
          >
            {hasIdentityAndNotLoading &&
              data.dids.map((identity: Did, index: number) => {
                return (
                  <ListItem
                    key={identity.did}
                    hideForwardArrow
                    onPress={() => {
                      client.writeData({
                        data: { selectedDid: identity.did },
                      })
                      client.reFetchObservableQueries()
                    }}
                    subTitle={identity.did.substring(0, 25) + '...'}
                    selected={identity.isSelected}
                    iconLeft={
                      <Avatar
                        border={!identity.isSelected}
                        address={identity.did}
                        type={'circle'}
                        gravatarType={'robohash'}
                      />
                    }
                  >
                    Identity {index + 1}
                  </ListItem>
                )
              })}
          </ScrollView>
        </BottomSheet>
      }
    >
      <Container padding flex={1}>
        <Avatar source={id ? avatar1 : avatar2} type={'rounded'} size={60} />
        <Container marginTop={8}>
          <Text type={Constants.TextTypes.H3} bold>
            {id ? 'Space X' : 'Sarah Macintosh'}
          </Text>
          <Container marginTop={4}>
            <Text type={Constants.TextTypes.SubTitle}>
              Standard profile screen
            </Text>
          </Container>
          {!id && (
            <Container flexDirection={'row'} flex={1} paddingTop>
              <Button
                small
                type={Constants.BrandOptions.Primary}
                block={Constants.ButtonBlocks.Outlined}
                buttonText="Switch Identity"
                onPress={() => bottomDrawer.current.snapTo(1)}
              />
            </Container>
          )}
        </Container>
      </Container>
    </Screen>
  )
}

Profile.navigationOptions = ({ navigation }: any) => {
  const params = navigation.state.params || {}
  return {
    headerRight: !params.id && (
      <Button
        onPress={() => {}}
        icon={<Avatar source={avatar2} />}
        iconButton
      />
    ),
  }
}

export default Profile
