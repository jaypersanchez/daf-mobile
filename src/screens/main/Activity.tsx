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
    /**
     * Hacky hacky hacky
     */
    if (data.viewer.messagesAll) {
      const requestMessage = data.viewer.messagesAll.find((message: any) => {
        return id === message.hash
      })
      // console.log(requestMessage)
      navigation.navigate('Request', {
        requestMessage,
        viewerDid: data.viewer.did,
      })
    }
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
          data.viewer.messagesAll.map((message: any, index: number) => {
            const actions =
              message.type === 'sdr' ? { actions: ['Approve'] } : {}
            const act: { [index: string]: string } = {
              sdr: 'has requested information from',
              'w3c.vp': 'sent an SDR response to',
              'w3c.vc': 'made claims about',
            }
            /**
             * Hacky hacky hacky. ActivityItem needs refactor
             */
            return (
              <ActivityItem
                id={message.hash}
                key={message.hash + index}
                activity={act[message.type]}
                profileAction={viewProfile}
                date={message.nbf * 1000}
                issuer={{
                  name: message.sub.shortId,
                  did: message.sub.did,
                  shortId: message.sub.shortId,
                  profileImage: message.sub.profileImage,
                }}
                subject={{
                  name: message.iss.shortId,
                  did: message.iss.did,
                  shortId: message.iss.shortId,
                  profileImage: message.iss.profileImage,
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
