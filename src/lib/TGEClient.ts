import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient, Resolvers } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { from } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import gql from 'graphql-tag'
import { Queries } from './serto-graph'
import Log from './Log'
import { RNUportHDSigner, getSignerForHDPath } from 'react-native-uport-signer'
import { createJWT } from 'did-jwt'
import Config from 'react-native-config'

const uri = Config.TGE_URI

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
    type: String!
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
  query findEdges($toDID: [String], $since: Int) {
    findEdges(toDID: $toDID, since: $since) {
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
      jwt
    }
  }
`

export const syncEdges = async (localClient: ApolloClient<any>) => {
  const list = await RNUportHDSigner.listSeedAddresses()
  const address = list[0]
  const did = 'did:ethr:' + address
  Log.info('Syncing data with ' + uri, 'TGE')

  // Find last message
  const res = await localClient.query({
    query: Queries.findMessages,
  })

  const lastMessageTime = res.data.messages[0]
    ? res.data.messages[0].time
    : null
  console.log({ lastMessageTime })
  try {
    const result = await client.query({
      query: findEdges,
      variables: {
        toDID: [did],
        since: lastMessageTime,
      },
    })

    result.data.findEdges.forEach(async (edge: any) => {
      Log.info('Saving ' + edge.time, 'TGE')
      try {
        const message = {
          hash: edge.hash,
          iss: edge.from.did,
          sub: edge.to.did,
          time: edge.time,
          type: edge.type,
          data: edge.data,
          tag: edge.tag,
          retention: edge.retention,
          visibility: edge.visibility,
          jwt: edge.jwt,
        }
        const hash = await localClient.mutate({
          mutation: Queries.newMessage,
          variables: { message },
        })
        // console.log(hash)
      } catch (e) {
        console.log(e)
      }
    })
  } catch (e) {
    console.log(e)
  }

  Log.info('Done syncing data', 'TGE')
}
