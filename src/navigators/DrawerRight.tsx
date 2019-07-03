import * as React from 'react'
import { ScrollView, TouchableHighlight } from 'react-native'
import {
  Text,
  Container,
  Icon,
  Avatar,
  withTheme,
  ListItem,
  Section,
  Constants,
} from '@kancha/kancha-ui'
import { Colors } from '../theme'

// tslint:disable-next-line:no-var-requires
const profileImage = require('../assets/images/kitten-avatar.jpg')

interface DrawerProps {
  onItemPress: (scene: any) => void
  activeItemkey: string
  theme: any
}

const Drawer: React.FC<DrawerProps> = props => {
  return (
    <Container flex={1} background={'secondary'}>
      <ScrollView>
        <Container
          background={'secondary'}
          padding={true}
          flexDirection={'row'}
          alignItems={'center'}
          marginTop={50}
        >
          <Avatar
            source={profileImage}
            address={'0x2dgu'}
            border={true}
            size={48}
            type={'rounded'}
          />
          <Container paddingLeft={10}>
            <Text bold={true} type={Constants.TextTypes.H3}>
              Serto User
            </Text>
            <Container marginTop={3}>
              <Text type={Constants.TextTypes.SubTitle}>
                0xfdh44hdud88dshs333...
              </Text>
            </Container>
          </Container>
        </Container>
        <Container>
          <Section noTopMargin={true}>
            <ListItem
              hideForwardArrow
              onPress={() =>
                props.onItemPress({
                  route: { routeName: 'Home', key: 'Home' },
                  focused: false,
                })
              }
              iconLeft={
                <Icon
                  color={Colors.CHARCOAL}
                  icon={{ name: 'ios-settings', iconFamily: 'Ionicons' }}
                />
              }
            >
              Dashboard
            </ListItem>
            <ListItem
              last={true}
              hideForwardArrow
              onPress={() =>
                props.onItemPress({
                  route: { routeName: 'Developer', key: 'Developer' },
                  focused: false,
                })
              }
              iconLeft={
                <Icon
                  color={Colors.CHARCOAL}
                  icon={{ name: 'ios-settings', iconFamily: 'Ionicons' }}
                />
              }
            >
              Developer
            </ListItem>
          </Section>
          <Section>
            <ListItem>Menu Item</ListItem>
            <ListItem>Menu Item</ListItem>
            <ListItem>Menu Item</ListItem>
            <ListItem last={true}>Menu Item</ListItem>
          </Section>
          <Section>
            <ListItem>Menu Item</ListItem>
            <ListItem last={true}>Menu Item</ListItem>
          </Section>
        </Container>
      </ScrollView>
    </Container>
  )
}

export default withTheme(Drawer)
