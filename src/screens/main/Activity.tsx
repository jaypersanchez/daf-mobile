import * as React from 'react'
import {
  Container,
  Text,
  Screen,
  ActivityItem,
  Constants,
} from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'

// tslint:disable-next-line:no-var-requires
const avatar1 = require('../../assets/images/space-x-logo.jpg')

interface Props extends NavigationStackScreenProps {}

const Activity: React.FC<Props> = ({ navigation }) => {
  const showAttachments = (attachment: any) => {
    console.log(attachment)
    navigation.navigate('Credential')
  }

  return (
    <Screen scrollEnabled>
      <Container padding>
        <Text type={Constants.TextTypes.H3} bold>
          Today
        </Text>
      </Container>
      <Container>
        <ActivityItem
          id={'000001'}
          date={new Date().getTime()}
          incoming
          issuer={{ name: 'Space X', did: '1234', avatar: avatar1 }}
          subject={{ name: 'you', did: '1234', avatar: { uri: '' } }}
          activity={'sent you 5 credentials'}
          reason={'can go to the Moon'}
          profileAction={() => {}}
          attachmentsAction={(attachment: any) => showAttachments(attachment)}
          attachments={[
            {
              key: '01',
              title: 'Spacer',
              issuer: {
                name: 'Space X',
                did: '1234',
                logo: avatar1,
              },
            },
            {
              key: '02',
              title: 'Moon Walker',
              issuer: {
                name: 'Space X',
                did: '1234',
                logo: avatar1,
              },
            },
          ]}
        />
        <ActivityItem
          id={'000001'}
          date={new Date().getTime() - 1000000}
          incoming={false}
          issuer={{ name: 'Space X', did: '1234', avatar: avatar1 }}
          subject={{ name: 'you', did: '1234', avatar: { uri: '' } }}
          activity={'shared information with'}
          reason={'can go to Mars'}
          profileAction={() => {}}
        />
        <ActivityItem
          id={'000001'}
          date={new Date().getTime() - 5000000}
          incoming
          issuer={{ name: 'Space X', did: '1234', avatar: avatar1 }}
          subject={{ name: 'you', did: '1234', avatar: { uri: '' } }}
          activity={'requested information from you'}
          reason={'can go to Mars'}
          profileAction={() => {}}
        />
        <ActivityItem
          id={'000001'}
          date={new Date().getTime() - 15000000}
          incoming
          issuer={{
            name: 'The Red Cross',
            did: '1234',
            avatar: { uri: 'http://' },
          }}
          subject={{ name: 'you', did: '1234', avatar: { uri: '' } }}
          activity={'sent you a credential'}
          profileAction={() => {}}
          attachmentsAction={(attachment: any) => showAttachments(attachment)}
          attachments={[
            {
              key: '01',
              title: 'Bravery',
              issuer: {
                name: 'The Red Cross',
                did: '1234',
                avatar: { uri: '' },
              },
            },
          ]}
        />
      </Container>
    </Screen>
  )
}

export default Activity
