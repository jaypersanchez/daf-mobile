import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient, Resolvers } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { from } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import gql from 'graphql-tag'
import { SchemaLink } from 'apollo-link-schema'
import { Api, typeDefs, resolvers } from './serto-graph'
import { RnSqlite } from './db-rn-sqlite3'
import { makeExecutableSchema } from 'graphql-tools'
import Log from './Log'
import { View, Text } from 'react-native'
import { RNUportHDSigner, getSignerForHDPath } from 'react-native-uport-signer'
import { createJWT } from 'did-jwt'
import Config from 'react-native-config'

const uri = Config.TGE_URI

const localTypeDefs = `

extend type Query {
  findEdges(fromDID:[String], toDID:[String], type:[String], since:Date, tag:[String]): [Edge!]!
}
scalar Date

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
    type: String!
    # date of the issuance of the edge. "iat" on the JWT
    time: Date!
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

export const schema = makeExecutableSchema({
  typeDefs: typeDefs + localTypeDefs,
  resolvers,
})

const authLink = setContext(async (_, { headers }) => {
  const list = await RNUportHDSigner.listSeedAddresses()
  const address = list[0]
  const signer: any = getSignerForHDPath(address)
  console.log({ address })

  const vc = {
    exp: Math.floor(Date.now() / 1000) + 100,
  }
  const jwt = await createJWT(vc, {
    issuer: 'did:ethr:' + address,
    signer,
    alg: 'ES256K-R',
  })

  console.log('JWT', jwt)

  return {
    headers: { ...headers, Authorization: `Bearer ${jwt}` },
  }
})

const httpLink = new HttpLink({ uri })

const link = from([authLink, httpLink])

export const cache = new InMemoryCache()
export const client = new ApolloClient({
  connectToDevTools: true,
  typeDefs: localTypeDefs,
  cache,
  link,
})

export const findEdges = gql`
  query findEdges($toDID: [String]) {
    findEdges(toDID: $toDID) {
      hash
      time
      type
      from {
        did
      }
      to {
        did
      }
      visibility
      tag
      retention
      data
    }
  }
`

export const syncEdges = async (localClient: any) => {
  const list = await RNUportHDSigner.listSeedAddresses()
  const address = list[0]
  const did = 'did:ethr:' + address
  Log.info('Syncing data with ' + uri, 'TGE')
  const result = await client.query({
    query: findEdges,
    variables: {
      toDID: [did],
    },
  })
  Log.info('Done syncing data', 'TGE')

  console.log(result)
}
