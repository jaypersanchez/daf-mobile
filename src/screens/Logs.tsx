/**
 * Serto Mobile App
 *
 */
import * as React from 'react'
import { FlatList } from 'react-native'
import { Query } from 'react-apollo'
import { LogMessage, getLogsQuery } from '../lib/Log'
import moment from 'moment'

import { LogItem } from '@kancha/kancha-ui'

interface Props {}

export default (props: Props) => {
  return (
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
          data={data.logs}
          renderItem={({ item }) => (
            <LogItem
              type={item.type}
              category={item.category}
              time={moment.unix(item.timestamp).calendar()}
              message={item.message}
            />
          )}
          keyExtractor={(item, index) => item.id}
          onRefresh={refetch}
          refreshing={loading}
        />
      )}
    </Query>
  )
}
