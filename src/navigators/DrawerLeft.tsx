import * as React from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Query } from 'react-apollo'
import { GET_VIEWER } from '../lib/rn-packages/rn-graphql/queries'
import {
  Text,
  Container,
  Avatar,
  withTheme,
  Section,
  MenuItem,
  Constants,
  Icon,
} from '@kancha/kancha-ui'
import { NavigationScreen } from '../navigators'

interface DrawerProps extends NavigationScreen {
  onItemPress: (scene: any) => void
  activeItemkey: string | undefined
  theme: any
}

interface Resp {
  data: {
    viewer: {
      did: string
      shortId: string
    }
  }
  loading: boolean
}

/**
 * @Todo
 * The query just grabs whats in cache as seleted query but this will
 * need to be updated with a getUser query that passes in @selectedDid as its param
 */
const Drawer: React.FC<DrawerProps> = props => {
  return (
    <Container flex={1} background={'primary'}>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('IdentitySelectModal')}
      >
        <Query query={GET_VIEWER}>
          {({ data }: Resp) => {
            return (
              <Container
                dividerBottom
                background={'primary'}
                padding={true}
                flexDirection={'row'}
                alignItems={'center'}
                marginTop={50}
              >
                <Avatar title={'Sarah Adamson'} border={true} size={40} />
                <Container paddingLeft={10} paddingRight={5}>
                  <Text bold={true} type={Constants.TextTypes.Body}>
                    Sarah Adamson
                  </Text>
                  <Container>
                    <Text type={Constants.TextTypes.SubTitle}>
                      {data && data.viewer && data.viewer.shortId}
                    </Text>
                  </Container>
                </Container>
                <Icon
                  icon={{ name: 'ios-arrow-down', iconFamily: 'Ionicons' }}
                />
              </Container>
            )
          }}
        </Query>
      </TouchableOpacity>
      <ScrollView>
        <Container paddingTop paddingBottom>
          <Section noTopMargin={true} noTopBorder>
            <Container paddingRight={10}>
              <MenuItem
                active={props.activeItemkey === 'Home'}
                onPress={() =>
                  props.onItemPress({
                    route: { routeName: 'Home', key: 'Home' },
                    focused: false,
                  })
                }
                icon={{ name: 'hearto', iconFamily: 'AntDesign' }}
              >
                Dashboard
              </MenuItem>
              <MenuItem
                onPress={() => ''}
                icon={{ name: 'staro', iconFamily: 'AntDesign' }}
              >
                Favourites
              </MenuItem>
              <MenuItem
                onPress={() => ''}
                icon={{ name: 'smileo', iconFamily: 'AntDesign' }}
              >
                Feedback
              </MenuItem>
              <MenuItem
                onPress={() => ''}
                icon={{ name: 'hearto', iconFamily: 'AntDesign' }}
              >
                Menu Item
              </MenuItem>
              <MenuItem
                onPress={() => ''}
                icon={{ name: 'setting', iconFamily: 'AntDesign' }}
              >
                Settings
              </MenuItem>
            </Container>
          </Section>
          <Container paddingTop>
            <Section noTopMargin={true} noTopBorder>
              <Container paddingRight={10}>
                <MenuItem
                  active={props.activeItemkey === 'Developer'}
                  onPress={() =>
                    props.onItemPress({
                      route: { routeName: 'Developer', key: 'Developer' },
                      focused: false,
                    })
                  }
                  icon={{ name: 'codesquareo', iconFamily: 'AntDesign' }}
                >
                  Developer Tools
                </MenuItem>
              </Container>
            </Section>
          </Container>
        </Container>
      </ScrollView>
    </Container>
  )
}

export default withTheme(Drawer)
