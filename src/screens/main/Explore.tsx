import React, { useState, useEffect } from 'react'
import {
  Container,
  Text,
  Screen,
  Constants,
  Credential,
  ListItem,
  Avatar,
  Device,
} from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import SearchBar from '../../navigators/SearchBar'

// tslint:disable-next-line:no-var-requires
const avatar1 = require('../../assets/images/space-x-logo.jpg')

interface Props extends NavigationStackScreenProps {}

const Explore: React.FC<Props> & {
  navigationOptions: any
} = ({ navigation }) => {
  const [searchActive, toggleSearch] = useState(false)

  useEffect(() => {
    navigation.setParams({ searchActive, toggleSearch })
  }, [searchActive])

  return (
    <Screen scrollEnabled background={searchActive ? 'secondary' : 'primary'}>
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
            Favourites
          </Text>
          <Container marginTop></Container>
          <Text type={Constants.TextTypes.H3} bold>
            Highlights
          </Text>
          <Container marginTop></Container>
        </Container>
      )}
    </Screen>
  )
}

Explore.navigationOptions = ({ navigation }: any) => {
  const params = navigation.state.params || {}

  return {
    headerTitle: () => {
      return (
        Device.isIOS && (
          <SearchBar
            onFocus={() => params.toggleSearch(true)}
            cancel={() => params.toggleSearch(false)}
            searchActive={params.searchActive}
          />
        )
      )
    },
  }
}

export default Explore
