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
import { useQuery } from 'react-apollo'
import { core, dataStore } from '../../lib/setup'
import { VIEWER_MESSAGES } from '../../lib/graphql/queries'
import { FlatList } from 'react-native-gesture-handler'
import { ActivityIndicator } from 'react-native'

interface Props extends NavigationStackScreenProps {}

const Activity: React.FC<Props> = ({ navigation }) => {
  const { data, loading, refetch, error } = useQuery(VIEWER_MESSAGES)

  const viewProfile = (id: any) => {
    navigation.navigate('Profile', { id })
  }

  const syncAndRefetch = async () => {
    await core.syncServices(await dataStore.latestMessageTimestamps())
    refetch()
  }

  const confirmRequest = (msg: any) => {
    navigation.navigate('Request', {
      requestMessage: msg,
      viewerDid: data && data.viewer && data.viewer.did,
    })
  }

  return (
    <Screen background={'secondary'}>
      <Container>
        {loading && (
          <Container
            flexDirection={'row'}
            alignItems={'center'}
            padding={10}
            br={8}
            viewStyle={{
              position: 'absolute',
              top: 50,
              zIndex: 100,
              left: Device.width / 2 - 100,
              width: 200,
              backgroundColor: 'rgba(0,0,0,0.8)',
            }}
          >
            <Container marginRight={8}>
              <ActivityIndicator />
            </Container>
            <Text textColor={Colors.WHITE}>Loading activity...</Text>
          </Container>
        )}
        {loading ? (
          [0, 1, 2, 3].map((fakeItem: any) => (
            <Container
              background={'primary'}
              padding
              marginBottom={5}
              key={fakeItem}
            >
              <Container
                background={'secondary'}
                viewStyle={{ borderRadius: 20, width: 40, height: 40 }}
              ></Container>
              <Container
                background={'secondary'}
                h={90}
                br={10}
                marginTop={20}
              ></Container>
            </Container>
          ))
        ) : (
          <FlatList
            data={data.viewer.messagesAll}
            onRefresh={syncAndRefetch}
            renderItem={({ item }: { item: DAFMessage }) => (
              <ActivityItem
                id={item.hash}
                type={item.type}
                message={item}
                profileAction={viewProfile}
                // @ts-ignore
                date={item.nbf * 1000}
                viewer={{
                  did: data && data.viewer && data.viewer.did,
                  shortId: data && data.viewer && data.viewer.shortId,
                  profileImage: data && data.viewer && data.viewer.profileImage,
                }}
                issuer={item.iss}
                subject={item.sub}
                confirm={confirmRequest}
                attachments={item.vc}
                attachmentsAction={() => {}}
                actions={['Share']}
              />
            )}
            keyExtractor={(item, index) => item.hash + index}
          />
        )}
      </Container>
    </Screen>
  )
}

export default Activity
