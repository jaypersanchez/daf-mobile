import React, { useEffect, useState } from 'react'
import {
  Container,
  Screen,
  Credential,
  Device,
  Text,
  RadioBtn,
  Constants,
} from '@kancha/kancha-ui'
import {
  NavigationStackScreenProps,
  NavigationStackOptions,
} from 'react-navigation-stack'
import { SharedElement } from 'react-navigation-shared-element'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { FlatList } from 'react-native'

interface Props extends NavigationStackScreenProps {}

const CredentialDetail: React.FC<Props> & { sharedElements: any } & {
  navigationOptions: any
} = ({ navigation }) => {
  const credentials = navigation.getParam('credentials')
  const credentialIncomingStyle = navigation.getParam('credentialStyle')
  const initialCredential = navigation.getParam('credentialIndex', 0)
  const [sharingMode, toggleSharingMode] = useState(false)
  const [selected, updateSelected] = useState<number[]>([])
  const credentialStyle = sharingMode
    ? { background: 'secondary', shadow: 0 }
    : credentialIncomingStyle

  const isSelected = (index: number) => {
    return selected.includes(index)
  }

  const selectedStyle = (index: number) => {
    return isSelected(index) && { background: 'primary', shadow: 1.5 }
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
    <Screen>
      <Container flex={1}>
        {sharingMode && (
          <Container padding>
            <Text type={Constants.TextTypes.Body}>
              Select credential(s) for sharing
            </Text>
          </Container>
        )}
        <FlatList
          contentOffset={{
            x: (Device.width - 40) * initialCredential,
            y: 0,
          }}
          horizontal
          pagingEnabled
          snapToAlignment={'center'}
          keyExtractor={(item: any) => item.hash}
          data={credentials}
          renderItem={({ item, index }: any) => {
            return (
              <Container w={Device.width - 40} padding paddingRight={10}>
                <SharedElement id={item.hash + item.rowId}>
                  <Credential
                    onPress={() => sharingMode && selectCredential(index)}
                    detailMode
                    jwt={item.jwt}
                    background={'secondary'}
                    issuer={item.iss}
                    subject={item.sub}
                    fields={item.fields}
                    exp={item.exp}
                    {...credentialStyle}
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
              </Container>
            )
          }}
        ></FlatList>
      </Container>
    </Screen>
  )
}

CredentialDetail.navigationOptions = ({ navigation }: any) => {
  const { sharingMode, toggleSharingMode } = navigation.state.params || {}

  return {
    title: 'Credential',
    headerLeft: (
      <HeaderButtons>
        <Item title={'Done'} onPress={navigation.dismiss} />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons>
        {sharingMode ? (
          <Item title={'Cancel'} onPress={() => toggleSharingMode(false)} />
        ) : (
          <Item title={'Share'} onPress={() => toggleSharingMode(true)} />
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
