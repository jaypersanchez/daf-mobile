import * as React from 'react'
import {
  Container,
  Text,
  Screen,
  ActivityItem,
  DAFMessage,
  Constants,
  Device,
} from '@kancha/kancha-ui'
import { Colors } from '../../theme'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { LineChart } from 'react-native-chart-kit'
import { selectiveDisclosureRequest } from '../../data/credentials'
import { useQuery } from 'react-apollo'
import { VIEWER_MESSAGES } from '../../lib/graphql/queries'

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

const chartData = {
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
  const { data, loading } = useQuery(VIEWER_MESSAGES)

  const viewProfile = (id: any) => {
    navigation.navigate('Profile', { id })
  }

  const confirmRequest = (id: any) => {
    navigation.navigate('Request', {
      requestMessage: selectiveDisclosureRequest,
    })
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
              // @ts-ignore
              withHorizontalLabels={false}
              width={Device.width + 60}
              data={chartData}
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

        {data &&
          data.viewer &&
          data.viewer.messagesAll &&
          [selectiveDisclosureRequest]
            .concat(data.viewer.messagesAll)
            .map((message: any, index: number) => {
              const actions =
                message.type === 'sdr' ? { actions: ['Approve'] } : {}
              return (
                <ActivityItem
                  id={message.hash}
                  key={message.hash + index}
                  activity={'sent a message'}
                  profileAction={viewProfile}
                  date={message.nbf}
                  issuer={{
                    name: message.iss.shortId,
                    did: message.iss.did,
                    shortId: message.iss.shortId,
                  }}
                  subject={{
                    name: message.sub.shortId,
                    did: message.sub.did,
                    shortId: message.sub.shortId,
                  }}
                  confirm={confirmRequest}
                  {...actions}
                />
              )
            })}
      </Container>
    </Screen>
  )
}

export default Activity
