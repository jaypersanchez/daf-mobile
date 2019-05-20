/**
 * Serto Mobile App
 *
 */

import React, { useState } from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import { Query } from 'react-apollo'
import { LogMessage, LogMessageType, getLogsQuery } from '../lib/Log'
import moment from 'moment'

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
          renderItem={({ item }) => <ListItem logItem={item} />}
          keyExtractor={(item, index) => item.id}
          onRefresh={refetch}
          refreshing={loading}
        />
      )}
    </Query>
  )
}

const ListItem = ({ logItem }: { logItem: LogMessage }) => {
  return (
    <View
      style={[
        styles.item,
        logItem.type === LogMessageType.Info && styles.info,
        logItem.type === LogMessageType.Warning && styles.warning,
        logItem.type === LogMessageType.Error && styles.error,
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.category}>{logItem.category}</Text>
        <Text style={styles.date}>
          {moment.unix(logItem.timestamp).calendar()}
        </Text>
      </View>
      <Text style={styles.message}>{logItem.message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    marginLeft: 3,
    marginTop: 1,
    marginBottom: 1,
    borderLeftWidth: 3,
    padding: 10,
  },
  info: {
    borderColor: 'gray',
  },
  warning: {
    borderColor: 'orange',
  },
  error: {
    borderColor: 'red',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    fontSize: 12,
    color: 'gray',
    fontWeight: 'bold',
  },
  message: {
    fontSize: 15,
  },
  date: {
    fontSize: 12,
    marginBottom: 5,
    color: 'gray',
  },
})
