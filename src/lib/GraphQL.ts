import { ApolloClient, Resolvers } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { from } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'

// const httpLink = new HttpLink({uri: '/graphql'})

const link = from([
  // httpLink,
])

const resolvers: Resolvers = {
  Query: {},
  Mutation: {
    log: (_, { type, message, category }, context) => {
      const query = gql`
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

      const previous = context.cache.readQuery({ query })
      const timestamp = new Date().getTime() / 1000
      const logItem = {
        id: `LogMessage:${timestamp}`,
        timestamp,
        type,
        message,
        category,
        __typename: 'LogMessage',
      }
      const data = {
        logs: [logItem, ...previous.logs],
      }

      context.cache.writeQuery({ query, data })
      return logItem
    },
  },
}

export const cache = new InMemoryCache()
export const client = new ApolloClient({
  connectToDevTools: true,
  typeDefs: gql`
    type LogMessage {
      id: ID!
      timestamp: Int
      type: Int
      message: String
      category: String
    }
    extend type Query {
      logs: [LogMessage!]
    }
  `,
  cache,
  link,
  resolvers,
})

cache.writeData({
  data: {
    logs: [],
  },
})
