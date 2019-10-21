/**
 * Serto Mobile App
 *
 */
import * as React from 'react'
import { FlatList } from 'react-native'
import { Query } from 'react-apollo'
import { LogMessage, getLogsQuery } from '../../lib/Log'
import moment from 'moment'

import { Screen, LogItem, Container } from '@kancha/kancha-ui'
import { Colors } from '../../theme'

export default () => {
  return (
    <Screen>
      <Container flex={1}>
        <Query query={getLogsQuery}>
          {({
            data,
            loading,
            refetch,
          }: {
            data: { logs: LogMessage[] }
            loading: boolean
            refetch: () => void
          }) => (
            <FlatList
              style={{ backgroundColor: Colors.LIGHTEST_GREY }}
              data={data && data.logs}
              renderItem={({ item }) => (
                <LogItem
                  type={item.type}
                  category={item.category}
                  time={moment.unix(item.timestamp).calendar()}
                  message={item.message}
                />
              )}
              keyExtractor={item => item.id}
              onRefresh={refetch}
              refreshing={loading}
            />
          )}
        </Query>
      </Container>
    </Screen>
  )
}
