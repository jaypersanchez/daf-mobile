import * as React from 'react'
import {
  Container,
  Screen,
  Text,
  Constants,
  Avatar,
  Icon,
} from '@kancha/kancha-ui'
import { NavigationScreen } from '../../navigators'
import JSONTree from 'react-native-json-tree'
import { useNavigationParam } from 'react-navigation-hooks'
import { formatDistanceToNow } from 'date-fns'
import { Colors } from '../../theme'

const Component: React.FC<NavigationScreen> = () => {
  const message = useNavigationParam('message')
  const issProfileSource = message.iss.profileImage
    ? { source: { uri: message.iss.profileImage } }
    : {}
  const subProfileSource = message.sub.profileImage
    ? { source: { uri: message.sub.profileImage } }
    : {}

  return (
    <Screen scrollEnabled={true} background={'primary'}>
      <Container padding marginTop>
        <Text type={Constants.TextTypes.H2} bold>
          Message Detail
        </Text>
        <Container marginTop={5} marginBottom>
          <Text type={Constants.TextTypes.ActivitySubTitle}>
            {(message.nbf && formatDistanceToNow(message.nbf * 1000)) +
              ' ago' || 'Some time ago'}
            {' • '}
            Message type: {message.type}
            {' • '}
            Tag: {message.tag}
          </Text>
          <Container paddingTop>
            <Text>
              This is a debug view to show the data within a raw message item
            </Text>
          </Container>
        </Container>
        <Container>
          <Container marginBottom>
            <Text type={Constants.TextTypes.H5} bold>
              Identities
            </Text>
          </Container>
          <Container
            background={'secondary'}
            paddingTop={32}
            br={10}
            paddingBottom={32}
            flexDirection={'row'}
            flex={1}
            justifyContent={'center'}
            alignItems={'center'}
            paddingLeft={32}
            paddingRight={32}
            marginBottom
          >
            <Container alignItems={'center'}>
              <Avatar
                {...issProfileSource}
                type={'circle'}
                gravatarType={'retro'}
                address={message.iss.did}
                size={50}
              />
              <Container paddingTop={8}>
                <Text type={Constants.TextTypes.ActivityTitle}>
                  {message.iss.shortId}
                </Text>
              </Container>
            </Container>
            <Container flexDirection={'row'} marginLeft={25} marginRight={25}>
              <Icon
                icon={{ name: 'ios-arrow-forward', iconFamily: 'Ionicons' }}
                size={30}
              />
            </Container>
            <Container alignItems={'center'}>
              <Avatar
                {...subProfileSource}
                type={'circle'}
                gravatarType={'retro'}
                address={message.sub.did}
                size={50}
              />
              <Container paddingTop={8}>
                <Text type={Constants.TextTypes.ActivityTitle}>
                  {message.sub.shortId}
                </Text>
              </Container>
            </Container>
          </Container>
          <Container
            background={'secondary'}
            br={10}
            padding
            marginBottom
            marginLeft
          >
            <Text selectable>
              <Text type={Constants.TextTypes.SubTitle}>from: </Text>
              {message.iss.did}
            </Text>
          </Container>
          <Container
            background={'secondary'}
            br={10}
            padding
            marginBottom
            marginLeft
          >
            <Text selectable>
              <Text type={Constants.TextTypes.SubTitle}>to:</Text>
              {message.sub.did}
            </Text>
          </Container>
        </Container>
        <Container>
          <Container marginBottom>
            <Text type={Constants.TextTypes.H5} bold>
              Attachments (Claims)
            </Text>
          </Container>
          {message.vc.map((vc: any, index: number) => {
            return (
              <Container
                key={index}
                background={'secondary'}
                br={10}
                padding
                marginBottom
              >
                <JSONTree
                  hideRoot={true}
                  data={vc.fields}
                  invertTheme={false}
                  theme={{
                    scheme: 'brewer',
                    base00: Colors.LIGHTEST_GREY,
                    base01: '#2e2f30',
                    base02: '#515253',
                    base03: '#737475',
                    base04: '#959697',
                    base05: '#b7b8b9',
                    base06: '#dadbdc',
                    base07: '#fcfdfe',
                    base08: '#e31a1c',
                    base09: '#e6550d',
                    base0A: '#dca060',
                    base0B: '#31a354',
                    base0C: '#80b1d3',
                    base0D: '#3182bd',
                    base0E: '#756bb1',
                    base0F: '#b15928',
                  }}
                />
              </Container>
            )
          })}
        </Container>
        <Container>
          <Container marginBottom>
            <Text type={Constants.TextTypes.H5} bold>
              Message hash
            </Text>
          </Container>
          <Container background={'secondary'} br={10} padding marginBottom>
            <Text selectable>{message.hash}</Text>
          </Container>
        </Container>
        <Container>
          <Container marginBottom>
            <Text type={Constants.TextTypes.H5} bold>
              Message JWT
            </Text>
          </Container>
          <Container background={'secondary'} br={10} padding marginBottom>
            <Text selectable>{message.jwt}</Text>
          </Container>
        </Container>
      </Container>
    </Screen>
  )
}

export default Component
