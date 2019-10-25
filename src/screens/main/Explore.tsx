import React, { useState, useEffect, createRef } from 'react'
import {
  Container,
  Text,
  Screen,
  Constants,
  Credential,
  ListItem,
  Avatar,
} from '@kancha/kancha-ui'
import { TextInput } from 'react-native'
import {
  NavigationStackScreenProps,
  NavigationStackOptions,
} from 'react-navigation-stack'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { Colors } from '../../theme'
import {
  sertoVerifiableCredential,
  bankVerifiableCredential,
} from '../../data/credentials'

// tslint:disable-next-line:no-var-requires
const avatar1 = require('../../assets/images/space-x-logo.jpg')

interface Props extends NavigationStackScreenProps {}

const Explore: React.FC<Props> & {
  navigationOptions: NavigationStackOptions
} = ({ navigation }) => {
  const [searchActive, toggleSearch] = useState(false)

  const credentials = [
    {
      title: sertoVerifiableCredential.type,
      issuer: sertoVerifiableCredential.iss,
      logo: avatar1,
      onPress: () =>
        navigation.navigate('Credential', {
          vc: sertoVerifiableCredential,
        }),
    },
    {
      title: bankVerifiableCredential.type,
      issuer: bankVerifiableCredential.iss,
      logo: avatar1,
      onPress: () =>
        navigation.navigate('Credential', {
          vc: bankVerifiableCredential,
        }),
    },
  ]

  useEffect(() => {
    navigation.setParams({ searchActive, toggleSearch })
  }, [searchActive])

  return (
    <Screen scrollEnabled>
      {searchActive ? (
        <Container>
          <Container>
            <ListItem iconLeft={<Avatar source={avatar1} />} subTitle={'NASA'}>
              Star Gazer
            </ListItem>
            <ListItem
              iconLeft={<Avatar source={avatar1} />}
              subTitle={'Space X'}
            >
              Dreamer
            </ListItem>
            <ListItem
              iconLeft={<Avatar source={avatar1} />}
              subTitle={'Jack Sparrow'}
            >
              Animal Eater
            </ListItem>
            <ListItem
              iconLeft={<Avatar source={avatar1} />}
              subTitle={'Bank of England'}
            >
              Dummy Text Expert
            </ListItem>
            <ListItem iconLeft={<Avatar source={avatar1} />} subTitle={'NASA'}>
              Content Kings
            </ListItem>
            <ListItem
              last
              iconLeft={<Avatar source={avatar1} />}
              subTitle={'NASA'}
            >
              Data Miner
            </ListItem>
          </Container>
        </Container>
      ) : (
        <Container padding>
          <Text type={Constants.TextTypes.H3} bold>
            Pinned
          </Text>
          <Container marginTop>
            {credentials.map((credential, index) => {
              return <Credential key={index} {...credential} />
            })}
          </Container>
          <Text type={Constants.TextTypes.H3} bold>
            Recent
          </Text>
          <Container marginTop>
            {credentials.map((credential, index) => {
              return <Credential key={index} {...credential} />
            })}
          </Container>
        </Container>
      )}
    </Screen>
  )
}

Explore.navigationOptions = ({ navigation }: any) => {
  const params = navigation.state.params || {}
  const inputRef = createRef<any>()

  const cancelSearch = () => {
    params.toggleSearch(false)
    inputRef.current.blur()
  }

  return {
    headerTitle: () => (
      <>
        <Container flex={1} marginLeft marginRight>
          <TextInput
            autoCapitalize={'none'}
            autoCorrect={false}
            autoCompleteType={'off'}
            ref={inputRef}
            onFocus={() => params.toggleSearch(true)}
            clearButtonMode={'while-editing'}
            placeholder={'Search data'}
            style={{
              backgroundColor: Colors.LIGHTEST_GREY,
              paddingVertical: 8,
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
          />
        </Container>
        {params.searchActive && (
          <HeaderButtons>
            <Item title={'Cancel'} onPress={() => cancelSearch()} />
          </HeaderButtons>
        )}
      </>
    ),
  }
}

export default Explore
