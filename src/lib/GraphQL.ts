import { ApolloClient, Resolvers } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { from } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'

// const httpLink = new HttpLink({uri: '/graphql'})

const link = from([
  // httpLink,
])

const typeDefs = gql`
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
`

export const cache = new InMemoryCache()
export const client = new ApolloClient({
  connectToDevTools: true,
  typeDefs,
  cache,
  link,
})

cache.writeData({
  data: {
    logs: [],
  },
})
