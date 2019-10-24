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

// tslint:disable-next-line:no-var-requires
const avatar1 = require('../../assets/images/space-x-logo.jpg')

const sertoVerifiableCredential = {
  iss: 'Serto Identity Platform',
  sub: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74',
  type: 'Serto ID',
  iat: 1562769371,
  exp: 1579478400,
  claim: {
    'Serto ID': {
      name: 'Sarah Adamson',
      dateOfBirth: '22-01-75',
      country: 'USA',
      children: [
        {
          name: 'Bob',
          age: 4,
        },
        {
          name: 'Alice',
          age: 9,
        },
      ],
    },
  },
  vc: [],
}

const bankVerifiableCredential = {
  iss: 'Deutsche Bank',
  sub: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74',
  type: 'Credit Worthy',
  iat: 1562769371,
  exp: 1579478400,
  claim: {
    'Credit Worthy': {
      name: 'Alice Chainy',
      dateOfBirth: '22-01-75',
      country: 'China',
      approvedLimit: 30000000,
    },
  },
  vc: [],
}

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
