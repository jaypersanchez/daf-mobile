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
import { ActivityIndicator } from 'react-native'
import { Colors } from '../../theme'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { useQuery } from 'react-apollo'
import { core, dataStore } from '../../lib/setup'
import { VIEWER_MESSAGES, GET_VIEWER } from '../../lib/graphql/queries'
import { FlatList } from 'react-native'

interface Props extends NavigationStackScreenProps {}

const Activity: React.FC<Props> = ({ navigation }) => {
  const viewerResult = useQuery(GET_VIEWER)
  const { data, loading, refetch, error } = useQuery(VIEWER_MESSAGES, {
    variables: { selectedDid: viewerResult.data.viewer.did },
  })

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

  const loader = (
    <Container
      flexDirection={'row'}
      alignItems={'center'}
      padding={10}
      br={20}
      viewStyle={{
        position: 'absolute',
        bottom: 50,
        zIndex: 100,
        left: Device.width / 2 - 100,
        width: 200,
        backgroundColor: 'rgba(0,0,0,0.8)',
      }}
    >
      <Container marginRight={10}>
        <ActivityIndicator />
      </Container>
      <Text textColor={Colors.WHITE}>Loading activity...</Text>
    </Container>
  )

  return (
    <Screen background={'secondary'} safeArea={true}>
      <Container flex={1}>
        {loading && loader}
        {error ? (
          <Text>Error</Text>
        ) : (
          <FlatList
            style={{ backgroundColor: Colors.LIGHTEST_GREY, flex: 1 }}
            data={data && data.viewer && data.viewer.messagesAll}
            onRefresh={syncAndRefetch}
            refreshing={loading}
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
            ListEmptyComponent={
              <Container>
                {[1, 2, 3, 4].map((fakeItem: number) => (
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
                ))}
              </Container>
            }
          />
        )}
      </Container>
    </Screen>
  )
}

export default Activity
