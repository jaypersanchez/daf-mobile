import React from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { persistCache } from 'apollo-cache-persist'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'
import { ApolloClient, Resolvers } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { from } from 'apollo-link'
import { SchemaLink } from 'apollo-link-schema'
import { Api, typeDefs, resolvers } from './serto-graph'
import { RnSqlite } from './db-rn-sqlite3'
import { makeExecutableSchema } from 'graphql-tools'
import Log, { configure as configureLog } from './Log'
import { Container, Screen, Text } from '@kancha/kancha-ui'
import TrustGraphClient from './trust-graph-client'
import { getSignerForHDPath } from 'react-native-uport-signer'
import { Queries } from './serto-graph'
import Config from 'react-native-config'
import { Issuer } from 'did-jwt-vc/src/types'
import { Signer } from 'did-jwt'
import gql from 'graphql-tag'

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
}

const contextLink = new SchemaLink({
  schema,
  context: { api, viewer },
})

const link = from([contextLink])

export const cache = new InMemoryCache({})

persistCache({
  cache,
  // @ts-ignore
  storage: AsyncStorage,
})

export const client = new ApolloClient({
  connectToDevTools: true,
  cache,
  link,
})

cache.writeData({
  data: {
    selectedDid: null,
    logs: [],
  },
})

// Log config

configureLog(client)

// TrustGraphClient config

export const getSelectedDid = gql`
  query getSelectedDid {
    selectedDid @client
  }
`

const getIssuer = async (): Promise<Issuer> => {
  const { data } = await client.query({
    query: getSelectedDid,
  })
  if (!data.selectedDid) {
    throw Error('No selected DID')
  }

  return {
    did: data.selectedDid,
    signer: getSignerForHDPath(data.selectedDid.slice(9)) as Signer,
  }
}

const saveMessage = async (jwt: string) => {
  const { data } = await client.mutate({
    mutation: Queries.newMessage,
    variables: { jwt },
    refetchQueries: [
      { query: Queries.findMessages },
      { query: Queries.getAllIdentities },
    ],
  })

  return data.newMessage
}

const getLatestMessageTimestamp = async () => {
  const { data } = await client.query({
    query: Queries.findMessages,
  })

  return data.messages[0] ? data.messages[0].iat : null
}

export const trustGraphClient = new TrustGraphClient({
  uri: Config.TGE_URI,
  wsUri: Config.TGE_WS_URI,
  getIssuer,
  getLatestMessageTimestamp,
  saveMessage,
  log: Log,
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

  async componentDidMount() {
    await driver.initialize()
    await api.initialize()

    this.setState({ isRunningMigrations: false })
    await trustGraphClient.setupClient()
    await trustGraphClient.syncLatestMessages()
    await trustGraphClient.subscribeToNewEdges()
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
        <ApolloProvider client={client}>
          <ApolloHooksProvider client={client}>
            {this.props.children}
          </ApolloHooksProvider>
        </ApolloProvider>
      )
    }
  }
}

export default CustomProvider
