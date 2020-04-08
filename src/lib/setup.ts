// import { Resolver } from 'did-resolver'
// import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
// import { getResolver as webDidResolver } from 'web-did-resolver'
import { DafResolver } from 'daf-resolver'

import * as Daf from 'daf-core'
import * as DidJwt from 'daf-did-jwt'
import { IdentityProvider } from 'daf-ethr-did'
import { KeyManagementSystem } from 'daf-react-native-libsodium'

import * as W3c from 'daf-w3c'
import * as SD from 'daf-selective-disclosure'

import * as URL from 'daf-url'
import * as DIDComm from 'daf-did-comm'
import { createConnection } from 'typeorm'

import merge from 'lodash.merge'
import Debug from 'debug'

Debug.enable('*')

import * as LocalGql from './graphql'

export const typeDefs = [
  Daf.Gql.baseTypeDefs,
  Daf.Gql.Core.typeDefs,
  Daf.Gql.IdentityManager.typeDefs,
  DIDComm.DIDCommGql.typeDefs,
  W3c.W3cGql.typeDefs,
  SD.SdrGql.typeDefs,
  LocalGql.typeDefs,
]

export const resolvers = merge(
  Daf.Gql.Core.resolvers,
  DIDComm.DIDCommGql.resolvers,
  Daf.Gql.IdentityManager.resolvers,
  W3c.W3cGql.resolvers,
  SD.SdrGql.resolvers,
  LocalGql.resolvers,
)

// DID Document Resolver
// const web = webDidResolver()
// const didResolver = new Resolver({
//   ...ethrDidResolver({
//     networks: [
//       {
//         name: 'mainnet',
//         rpcUrl: 'https://mainnet.infura.io/v3/5ffc47f65c4042ce847ef66a3fa70d4c',
//       },
//       {
//         name: 'rinkeby',
//         rpcUrl: 'https://rinkeby.infura.io/v3/5ffc47f65c4042ce847ef66a3fa70d4c',
//       },
//     ],
//   }),
//   ...web,
//   https: web.web,
// })

const keyStore = new Daf.KeyStore()
const identityStore = new Daf.IdentityStore('rinkeby')
const kms = new KeyManagementSystem(keyStore)
const infuraProjectId = '5ffc47f65c4042ce847ef66a3fa70d4c'
const didResolver = new DafResolver({ infuraProjectId })
const rinkebyIdentityProvider = new IdentityProvider({
  kms,
  identityStore,
  network: 'rinkeby',
  rpcUrl: 'https://rinkeby.infura.io/v3/' + infuraProjectId,
})

const messageHandler = new URL.UrlMessageHandler()
messageHandler
  .setNext(new DIDComm.DIDCommMessageHandler())
  .setNext(new DidJwt.JwtMessageHandler())
  .setNext(new W3c.W3cMessageHandler())
  .setNext(new SD.SdrMessageHandler())

const actionHandler = new W3c.W3cActionHandler()
actionHandler
  .setNext(new SD.SdrActionHandler())
  .setNext(new DIDComm.DIDCommActionHandler())

export const agent = new Daf.Agent({
  didResolver,
  identityProviders: [rinkebyIdentityProvider],
  actionHandler,
  messageHandler,
})

export const Message = Daf.Message

export const initializeDB = async () => {
  return await createConnection({
    type: 'react-native',
    database: 'daf.sqlite',
    location: 'default',
    synchronize: true,
    logging: ['error'],
    entities: [...Daf.Entities],
  })
}
