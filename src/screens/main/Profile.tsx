import React, { useEffect, useState } from 'react'
import {
  Container,
  Text,
  Screen,
  Avatar,
  Constants,
  Button,
  BottomSnap,
} from '@kancha/kancha-ui'
import {
  NavigationStackScreenProps,
  NavigationStackOptions,
} from 'react-navigation-stack'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { getSelectedDidQuery } from '../../lib/Signer'

const SWITCH_IDENTITY = 'SWITCH_IDENTITY'
// tslint:disable-next-line:no-var-requires
const avatar1 = require('../../assets/images/space-x-logo.jpg')

interface Props extends NavigationStackScreenProps {}

const Profile: React.FC<Props> & {
  navigationOptions: NavigationStackOptions
} = ({ navigation }) => {
  const id = navigation.getParam('id', null)
  const {
    data: { selectedDid },
  }: any = useQuery(getSelectedDidQuery)

  useEffect(() => {
    navigation.setParams({ selectedDid })
  }, [selectedDid])

  return (
    <Screen scrollEnabled background={'primary'}>
      <Container padding flex={1}>
        {id ? (
          <Avatar type={'rounded'} size={60} source={avatar1} />
        ) : (
          <Avatar
            type={'rounded'}
            size={60}
            address={selectedDid}
            gravatarType={'retro'}
          />
        )}
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
            <>
              <Container flexDirection={'row'} flex={1} paddingTop>
                <Button
                  small
                  type={Constants.BrandOptions.Primary}
                  block={Constants.ButtonBlocks.Outlined}
                  buttonText="Switch Identity"
                  onPress={() => BottomSnap.to(1, SWITCH_IDENTITY)}
                />
              </Container>
              <Container marginTop>
                <Text type={Constants.TextTypes.Body}>
                  The identity switcher is a global component and can be called
                  from anywhere.
                </Text>
              </Container>
            </>
          )}
        </Container>
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
        icon={<Avatar address={params.selectedDid} gravatarType={'retro'} />}
        iconButton
      />
    ),
  }
}

export default Profile
