import * as React from 'react'
import { ScrollView } from 'react-native'
import {
  Text,
  Container,
  Avatar,
  withTheme,
  Section,
  MenuItem,
  Constants,
} from '@kancha/kancha-ui'

interface DrawerProps {
  onItemPress: (scene: any) => void
  activeItemkey: string | undefined
  theme: any
}

/**
 * Custom drawer implemenation using Kancha components
 */
const Drawer: React.FC<DrawerProps> = props => {
  return (
    <Container flex={1} background={'primary'}>
      <Container
        dividerBottom
        background={'primary'}
        padding={true}
        flexDirection={'row'}
        alignItems={'center'}
        marginTop={50}
      >
        <Avatar title={'Sarah Adamson'} border={true} size={40} />
        <Container paddingLeft={10}>
          <Text bold={true} type={Constants.TextTypes.Body}>
            Sarah Adamson
          </Text>
          <Container>
            <Text type={Constants.TextTypes.SubTitle}>
              0xfdh44hdud88dshs333...
            </Text>
          </Container>
        </Container>
      </Container>
      <ScrollView>
        <Container paddingTop paddingBottom>
          <Section noTopMargin={true} noTopBorder>
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
          </Section>
          <Container paddingTop>
            <Section noTopMargin={true} noTopBorder>
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
            </Section>
          </Container>
        </Container>
      </ScrollView>
    </Container>
  )
}

export default withTheme(Drawer)
