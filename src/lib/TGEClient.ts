import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { from } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import gql from 'graphql-tag'
import { Queries } from './serto-graph'
import Log from './Log'
import { getSignerForHDPath } from 'react-native-uport-signer'
import { createJWT } from 'did-jwt'
import Config from 'react-native-config'
import { client as localGqlClient } from './GraphQL'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { split } from 'apollo-link'
import { saveMessage } from './Messages'

const uri = Config.TGE_URI
const wsUri = Config.TGE_WS_URI

const localTypeDefs = `

extend type Query {
  findEdges(fromDID:[String], toDID:[String], type:[String], since:Int, tag:[String]): [Edge!]!
}

type Edge {
    # blake2b hash of the JWT
    hash: ID!
    # original JWT of the edge
    jwt: String!
    # from field of the edge. "iss" on the JWT
    from: Identity!
    # to field of the edge. "sub" on the JWT
    to: Identity!
    # type of the edge. "type" on the JWT
    type: String
    # date of the issuance of the edge. "nbf" on the JWT
    time: Int!
    # tag of the edge. "tag" on the JWT
    tag: String
    # visibility of the edge. "vis" on the JWT
    visibility: VisibilityEnum
    # retention period (in seconds) of the edge. "ret" on the JWT
    retention: Int
    # Data of the edge, can be unencrypted or encrypted. "data" on the JWT
    data: String
}

enum VisibilityEnum {
  TO
  BOTH
  ANY
}
`

const getAuthToken = async () => {
  const { data } = await localGqlClient.query({
    query: getSelectedDid,
  })
  if (!data.selectedDid) {
    throw Error('No selected DID')
  }

  const signer: any = getSignerForHDPath(data.selectedDid.slice(9))

  const vc = {
    exp: Math.floor(Date.now() / 1000) + 100,
  }
  const jwt = await createJWT(vc, {
    issuer: data.selectedDid,
    signer,
    alg: 'ES256K-R',
  })

  return jwt
}

const authLink = setContext(async (_, { headers }) => {
  const token = await getAuthToken()
  return {
    headers: { ...headers, authorization: `Bearer ${token}` },
  }
})

const httpLink = new HttpLink({ uri })
const wsLink = new WebSocketLink({
  uri: wsUri,
  options: {
    reconnect: true,
    connectionParams: async () => {
      const token = await getAuthToken()
      return { authorization: `Bearer ${token}` }
    },
  },
})

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink,
)

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(link),
  typeDefs: localTypeDefs,
})

export const findEdges = gql`
  query findEdges($toDID: [String], $since: Int) {
    findEdges(toDID: $toDID, since: $since) {
      time
      hash
      jwt
    }
  }
`

export const edgeAdded = gql`
  subscription edgeAdded($toDID: [String]) {
    edgeAdded(toDID: $toDID) {
      jwt
    }
  }
`

export const getSelectedDid = gql`
  query getSelectedDid {
    selectedDid @client
  }
`
export const syncEdges = async () => {
  const { data } = await localGqlClient.query({
    query: getSelectedDid,
  })

  const did = data.selectedDid

  Log.info('Syncing data with ' + uri, 'TGE')

  // Find last message
  const res = await localGqlClient.query({
    query: Queries.findMessages,
  })

  const lastMessageTime = res.data.messages[0] ? res.data.messages[0].iat : null

  Log.info('Latest known message time: ' + lastMessageTime, 'TGE')

  try {
    const result = await client.query({
      query: findEdges,
      fetchPolicy: 'network-only',
      variables: {
        toDID: [did],
        since: lastMessageTime,
      },
    })

    result.data.findEdges.forEach(async (edge: any) => {
      Log.info('Saving ' + edge.hash, 'TGE')
      try {
        saveMessage(edge.jwt)
      } catch (e) {
        Log.error(e.message, 'TGE')
      }
    })
  } catch (e) {
    Log.error(e.message, 'TGE')
  }

  Log.info('Done syncing data', 'TGE')
}

export const subscribeToNewEdges = async () => {
  const { data } = await localGqlClient.query({
    query: getSelectedDid,
  })

  const did = data.selectedDid

  Log.info('Subscribing to new data', 'TGE')

  client
    .subscribe({
      query: edgeAdded,
      variables: { toDID: did },
    })
    .subscribe({
      async next(result) {
        Log.info('New edge received', 'TGE')
        saveMessage(result.data.edgeAdded.jwt)
      },
      error(err) {
        Log.error(err.message, 'TGE')
      },
    })
}
