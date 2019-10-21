import * as React from 'react'
import { Container, Text, Screen, Avatar, Constants } from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'

// tslint:disable-next-line:no-var-requires
const avatar1 = require('../../assets/images/space-x-logo.jpg')

// tslint:disable-next-line:no-var-requires
const avatar2 = require('../../assets/images/kitten-avatar.jpg')

interface Props extends NavigationStackScreenProps {}

const Profile: React.FC<Props> = ({ navigation }) => {
  const id = navigation.getParam('id', null)
  return (
    <Screen scrollEnabled background={'primary'}>
      <Container padding>
        <Avatar source={id ? avatar1 : avatar2} type={'rounded'} size={60} />
        <Container marginTop={8}>
          <Text type={Constants.TextTypes.H3} bold>
            {id ? 'Space X' : 'Sarah Macintosh'}
          </Text>
          <Container marginTop={4}>
            <Text type={Constants.TextTypes.SubTitle}>
              Standard profile screen
            </Text>
          </Container>
        </Container>
      </Container>
    </Screen>
  )
}

export default Profile
