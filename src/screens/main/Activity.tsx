import * as React from 'react'
import {
  Container,
  Text,
  Screen,
  ActivityItem,
  Constants,
  Device,
} from '@kancha/kancha-ui'
import { Colors } from '../../theme'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { LineChart } from 'react-native-chart-kit'
import {
  sertoVerifiableCredential,
  bankVerifiableCredential,
} from '../../data/credentials'

import hexToRgba from 'hex-to-rgba'

const chartConfig = {
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: '#FFFFFF',
  backgroundGradientToOpacity: 1,
  color: (opacity = 1) => hexToRgba(Colors.WHITE, opacity),
  labelColor: (opacity = 0.5) => hexToRgba(Colors.MEDIUM_GREY, opacity),
  propsForLabels: {
    fontWeight: 'bold',
  },
  strokeWidth: 3, // optional, default 3
  barPercentage: 0.5,
  strokeColor: Colors.BRAND,
}

const data = {
  labels: ['J', 'F', 'M', 'A', 'M', 'J'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => hexToRgba(Colors.BRAND, opacity),
      strokeWidth: 2, // optional
    },
  ],
}

// tslint:disable-next-line:no-var-requires
const avatar1 = require('../../assets/images/space-x-logo.jpg')

interface Props extends NavigationStackScreenProps {}

const Activity: React.FC<Props> = ({ navigation }) => {
  const viewProfile = (id: any) => {
    navigation.navigate('Profile', { id })
  }

  const showAttachments = (attachment: any) => {
    let params
    if (attachment.length > 1) {
      params = {
        vp: [sertoVerifiableCredential, sertoVerifiableCredential],
      }
    } else if (attachment.length === 1) {
      params = {
        vc: sertoVerifiableCredential,
      }
    }
    navigation.navigate('Credential', { ...params })
  }

  return (
    <Screen scrollEnabled>
      <Container padding background={'primary'}>
        <Text type={Constants.TextTypes.H3} bold>
          Recent Activity
        </Text>
      </Container>
      <Container>
        <Container>
          {
            // @ts-ignore
            <LineChart
              style={{
                marginLeft: -30,
              }}
              withInnerLines={false}
              withOuterLines={false}
              withHorizontalLabels={false}
              width={Device.width + 60}
              data={data}
              height={220}
              chartConfig={chartConfig}
              bezier
            />
          }
        </Container>
      </Container>
      <Container>
        <Container padding>
          <Text type={Constants.TextTypes.H3} bold>
            Today
          </Text>
        </Container>
        <ActivityItem
          id={'000001'}
          date={new Date().getTime()}
          incoming
          issuer={{ name: 'Space X', did: '1234', avatar: avatar1 }}
          subject={{ name: 'you', did: '1234', avatar: { uri: '' } }}
          activity={'sent you 5 credentials'}
          reason={'can go to the Moon'}
          profileAction={(id: string) => viewProfile(id)}
          attachmentsAction={(attachment: any) => showAttachments(attachment)}
          attachments={[
            {
              key: '01',
              title: sertoVerifiableCredential.type,
              issuer: {
                name: sertoVerifiableCredential.iss,
                did: '0fxx',
                avatar: { uri: '' },
              },
              logo: avatar1,
            },
            {
              key: '02',
              title: bankVerifiableCredential.type,
              issuer: {
                name: bankVerifiableCredential.iss,
                did: '0fxx',
                avatar: { uri: '' },
              },
              logo: avatar1,
            },
          ]}
        />
        <ActivityItem
          id={'000002'}
          date={new Date().getTime() - 1000000}
          incoming={false}
          issuer={{ name: 'Space X', did: '1234', avatar: avatar1 }}
          subject={{ name: 'you', did: '1234', avatar: { uri: '' } }}
          activity={'shared information with'}
          reason={'can go to Mars'}
          profileAction={(id: string) => viewProfile(id)}
        />
        <ActivityItem
          id={'000003'}
          date={new Date().getTime() - 5000000}
          incoming
          issuer={{ name: 'Space X', did: '1234', avatar: avatar1 }}
          subject={{ name: 'you', did: '1234', avatar: { uri: '' } }}
          activity={'requested information from you'}
          reason={'can go to Mars'}
          profileAction={(id: string) => viewProfile(id)}
        />
        <ActivityItem
          id={'000004'}
          date={new Date().getTime() - 15000000}
          incoming
          issuer={{
            name: 'The Red Cross',
            did: '1234',
            avatar: { uri: 'http://' },
          }}
          subject={{ name: 'you', did: '1234', avatar: { uri: '' } }}
          activity={'sent you a credential'}
          profileAction={(id: string) => viewProfile(id)}
          attachmentsAction={(attachment: any) => showAttachments(attachment)}
          attachments={[
            {
              key: '01',
              title: sertoVerifiableCredential.type,
              issuer: {
                name: sertoVerifiableCredential.iss,
                did: '0fxx',
                avatar: { uri: '' },
              },
              logo: avatar1,
            },
          ]}
        />
      </Container>
    </Screen>
  )
}

export default Activity
