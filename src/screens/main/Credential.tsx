import React, { useEffect, useState } from 'react'
import {
  Container,
  Screen,
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
  const [sharingMode, toggleSharingMode] = useState(false)
  const [selected, updateSelected] = useState<number[]>([])

  const isSelected = (index: number) => {
    return selected.includes(index)
  }

  const selectedStyle = (index: number): CredentialStyle => {
    return {
      background: isSelected(index) ? 'primary' : 'secondary',
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

  useEffect(() => {
    navigation.setParams({ sharingMode, toggleSharingMode })
  }, [sharingMode])

  return (
    // <Screen scrollEnabled background={'primary'}>
    <Container flex={1} backgroundColor={Colors.BLACK}>
      {sharingMode && (
        <Container padding>
          <Text type={Constants.TextTypes.Body} textColor={Colors.LIGHT_GREY}>
            Select credential(s) for sharing. Flow to be completed.
          </Text>
        </Container>
      )}
      <FlatList
        contentOffset={{
          x: (Device.width - 15) * initialCredential,
          y: 0,
        }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment={'center'}
        keyExtractor={(item: any) => item.hash}
        data={credentials}
        renderItem={({ item, index }: any) => {
          return (
            <Container w={Device.width - 10} padding paddingRight={10}>
              <ScrollView scrollEventThrottle={16}>
                <SharedElement id={item.hash + item.rowId}>
                  <Credential
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
        }}
      ></FlatList>
      {/* <Container flexDirection={'row'} justifyContent={'center'}>
        {credentials.map((dot: any) => {
          return (
            <Container
              key={dot.hash}
              br={5}
              w={10}
              h={10}
              backgroundColor={Colors.MEDIUM_GREY}
              margin={4}
            />
          )
        })}
      </Container> */}
    </Container>
    // </Screen>
  )
}

CredentialDetail.navigationOptions = ({ navigation }: any) => {
  const { sharingMode, toggleSharingMode } = navigation.state.params || {}

  return {
    title: 'Credential',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerLeft: (
      <HeaderButtons>
        <Item
          title={'Done'}
          onPress={navigation.dismiss}
          color={Colors.WHITE}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons>
        {sharingMode ? (
          <Item
            title={'Cancel'}
            onPress={() => toggleSharingMode(false)}
            color={Colors.WHITE}
          />
        ) : (
          <Item
            title={'Share'}
            onPress={() => toggleSharingMode(true)}
            color={Colors.WHITE}
          />
        )}
      </HeaderButtons>
    ),
  }
}

CredentialDetail.sharedElements = (navigation: any) => {
  const credentials = navigation.getParam('credentials')
  return credentials.map((item: any) => {
    return { id: item.hash + item.rowId, animation: 'fade', resize: 'clip' }
  })
}

export default CredentialDetail
