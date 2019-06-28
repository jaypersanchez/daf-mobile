import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient, Resolvers } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { from } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'
import { SchemaLink } from 'apollo-link-schema'
import { Api, typeDefs, resolvers } from './serto-graph'
import { RnSqlite } from './db-rn-sqlite3'
import { makeExecutableSchema } from 'graphql-tools'
import Log from './Log'
import { View, Text } from 'react-native'

const localTypeDefs = `

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

export const schema = makeExecutableSchema({
  typeDefs: typeDefs + localTypeDefs,
  resolvers,
})

// local
const driver = new RnSqlite()
const api = new Api(driver)

const did = ''
const viewer = {
  did,
  ownsDids: api.getOwnedDids(did),
  isAdmin: true,
}

const contextLink = new SchemaLink({
  schema,
  context: { api, viewer },
})

// const httpLink = new HttpLink({uri: '/graphql'})

const link = from([
  contextLink,
  // httpLink,
])

export const cache = new InMemoryCache()
export const client = new ApolloClient({
  connectToDevTools: true,
  // typeDefs,
  cache,
  link,
})

cache.writeData({
  data: {
    logs: [],
  },
})

interface Props {}
interface State {
  isRunningMigrations: boolean
}

class CustomProvider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isRunningMigrations: true,
    }
  }

  componentDidMount() {
    driver
      .initialize()
      .then(() => api.initialize())
      .then(() => {
        this.setState({ isRunningMigrations: false })
      })
      .catch(e => console.log(e))
  }

  render() {
    if (this.state.isRunningMigrations) {
      return (
        <View>
          <Text>Updating data...</Text>
        </View>
      )
    } else {
      return (
        <ApolloProvider client={client}>{this.props.children}</ApolloProvider>
      )
    }
  }
}

export default CustomProvider
