import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient, Resolvers } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { from } from 'apollo-link'
import { SchemaLink } from 'apollo-link-schema'
import { Api, typeDefs, resolvers } from './serto-graph'
import { RnSqlite } from './db-rn-sqlite3'
import { makeExecutableSchema } from 'graphql-tools'
import Log from './Log'
import { Container, Screen, Text } from '@kancha/kancha-ui'
import { syncEdges } from './TGEClient'

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

const link = from([contextLink])

export const cache = new InMemoryCache()
export const client = new ApolloClient({
  connectToDevTools: true,
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
        syncEdges(client)
      })
      .catch(e => console.log(e))
  }

  render() {
    if (this.state.isRunningMigrations) {
      return (
        <Screen safeArea={true}>
          <Container flex={1} alignItems={'center'} justifyContent={'center'}>
            <Text>Updating data...</Text>
          </Container>
        </Screen>
      )
    } else {
      return (
        <ApolloProvider client={client}>{this.props.children}</ApolloProvider>
      )
    }
  }
}

export default CustomProvider
