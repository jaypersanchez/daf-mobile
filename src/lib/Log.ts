import { Resolvers } from 'apollo-client'
import gql from 'graphql-tag'

let client: any = null

export enum LogMessageType {
  Info,
  Warning,
  Error,
}

export interface LogMessage {
  id: string
  type: LogMessageType
  category?: string
  message: string
  timestamp: number
  __typename?: string
}

export const getLogsQuery = gql`
  query getLogs {
    logs @client {
      id
      timestamp
      type
      category
      message
    }
  }
`

export const resolvers: Resolvers = {
  Query: {},
  Mutation: {
    log: (_, { type, message, category }, context) => {
      const previous = context.cache.readQuery({ query: getLogsQuery }) || {
        logs: [],
      }
      const timestamp = new Date().getTime() / 1000
      const logItem = {
        id: `${timestamp}`,
        timestamp,
        type,
        message,
        category,
        __typename: 'LogMessage',
      }
      const data = {
        logs: [logItem].concat(previous.logs),
      }

      context.cache.writeQuery({ query: getLogsQuery, data })
      return logItem
    },
  },
}

const newLogItemMutation = gql`
  mutation newLogItem($message: String!, $type: Int!, $category: String) {
    log(message: $message, type: $type, category: $category) @client
  }
`

const writeLogItemToCache = (
  message: string,
  type: LogMessageType,
  category?: string,
) => {
  client.mutate({
    mutation: newLogItemMutation,
    variables: {
      message,
      type,
      category,
    },
    refetchQueries: ['getLogs'],
  })
}

export const configure = (gqlClient: any) => {
  client = gqlClient
  client.addResolvers(resolvers)
}
/* tslint:disable:no-console */
export default {
  info: (message: string, category?: string) => {
    console.log(category && `[${category}]`, message)
    writeLogItemToCache(message, LogMessageType.Info, category)
  },

  warning: (message: string, category?: string) => {
    console.log(category && `[${category}]`, '⚠️ Warning:', message)
    writeLogItemToCache(message, LogMessageType.Warning, category)
  },

  error: (message: string, category?: string) => {
    console.log(category && `[${category}]`, '🛑 Error:', message)
    writeLogItemToCache(message, LogMessageType.Error, category)
  },
}
