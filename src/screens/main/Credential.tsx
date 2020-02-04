import React, { useEffect, useState } from 'react'
import {
  Container,
  Credential,
  Device,
  Text,
  RadioBtn,
  Constants,
  Typings,
} from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { SharedElement } from 'react-navigation-shared-element'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { FlatList } from 'react-native'
import { Colors } from '../../theme'
import { ScrollView } from 'react-native-gesture-handler'

interface CredentialStyle {
  background: Typings.BrandPropOptions
  shadow: number
}

interface Props extends NavigationStackScreenProps {}

const CredentialDetail: React.FC<Props> & { sharedElements: any } & {
  navigationOptions: any
} = ({ navigation }) => {
  const credentials = navigation.getParam('credentials')
  const initialCredential = navigation.getParam('credentialIndex', 0)
  const [sharingMode, toggleSharingMode] = useState<boolean>(false)
  const [selected, updateSelected] = useState<number[]>([])

  const isSelected = (index: number) => {
    return selected.includes(index)
  }

  const selectedStyle = (index: number): CredentialStyle => {
    return {
      background: isSelected(index) ? 'primary' : 'primary',
      shadow: 0,
    }
  }

  const selectCredential = (index: number) => {
    if (selected.includes(index)) {
      updateSelected(selected.filter((item: number) => item !== index))
    } else {
      updateSelected(selected.concat([index]))
    }
  }

  const initailOffset = { x: (Device.width - 15) * initialCredential, y: 0 }

  useEffect(() => {
    navigation.setParams({ sharingMode, toggleSharingMode })
  }, [sharingMode])

  const renderCredential = ({
    item,
    index,
  }: {
    item: Typings.VerifiableCredential & {}
    index: number
  }) => (
    <Container w={Device.width - 10} padding paddingRight={10}>
      <ScrollView testID={'SCROLLVIEW'} scrollEventThrottle={16}>
        <SharedElement id={item.hash}>
          <Credential
            testID={'CREDENTIAL'}
            onPress={() => sharingMode && selectCredential(index)}
            detailMode
            jwt={item.jwt}
            issuer={item.iss}
            subject={item.sub}
            fields={item.fields}
            exp={item.exp}
            {...selectedStyle(index)}
          />
          {sharingMode && (
            <RadioBtn
              testID={'RADIO_BTN'}
              selected={isSelected(index)}
              onPress={() => selectCredential(index)}
            >
              {isSelected(index) && 'Sharing'}
            </RadioBtn>
          )}
        </SharedElement>
      </ScrollView>
    </Container>
  )

  return (
    <Container flex={1} backgroundColor={Colors.BLACK}>
      {sharingMode && (
        <Container padding>
          <Text type={Constants.TextTypes.Body} textColor={Colors.LIGHT_GREY}>
            Select credential(s) for sharing. Flow to be completed.
          </Text>
        </Container>
      )}
      <FlatList
        testID={'FLATLIST'}
        horizontal
        pagingEnabled
        contentOffset={initailOffset}
        showsHorizontalScrollIndicator={false}
        snapToAlignment={'center'}
        keyExtractor={(item: Typings.VerifiableCredential) => item.hash}
        data={credentials}
        renderItem={renderCredential}
      ></FlatList>
    </Container>
  )
}

CredentialDetail.navigationOptions = ({ navigation }: any) => {
  const { sharingMode, toggleSharingMode } = navigation.state.params || {}
  const sharingModeEnabled = navigation.getParam('sharingModeEnabled', true)

  return {
    title: 'Credential',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerLeft: (
      <HeaderButtons>
        <Item
          testID={'DONE_BTN'}
          title={'Done'}
          onPress={navigation.dismiss}
          color={Colors.WHITE}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons>
        {sharingMode && sharingModeEnabled ? (
          <Item
            testID={'CANCEL_BTN'}
            title={'Cancel'}
            onPress={() => toggleSharingMode(false)}
            color={Colors.WHITE}
          />
        ) : sharingModeEnabled ? (
          <Item
            testID={'SHARE_BTN'}
            title={'Share'}
            onPress={() => toggleSharingMode(true)}
            color={Colors.WHITE}
          />
        ) : null}
      </HeaderButtons>
    ),
  }
}

CredentialDetail.sharedElements = (navigation: any) => {
  return navigation
    .getParam('credentials')
    .map((vc: Typings.VerifiableCredential) => ({
      id: vc.hash,
      animation: 'fade',
      resize: 'clip',
    }))
}

export default CredentialDetail
