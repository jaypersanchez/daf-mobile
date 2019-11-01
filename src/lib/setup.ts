import { Resolver } from 'did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
// import { resolver as naclDidResolver } from 'nacl-did'
// import webDidResolver from 'web-did-resolver'

import Core, { EventTypes } from './packages/core/core'
import * as Types from './packages/core/types'
import DidJwtValidationManager from './packages/plugin-did-jwt-validator'
import RnEthrDidController from './rn-packages/rn-identity-controller'

import * as Rnd from './packages/plugin-random-msg'
import * as W3c from './packages/plugin-w3c'
import * as Sdr from './packages/plugin-sdr'
import * as TG from './packages/plugin-trust-graph'

import DebugActionHandler from './packages/plugin-debug-action-handler'
import DidCommActionHandler, {
  ActionTypes as MessagingActionTypes,
  ActionSendJWT,
} from './packages/plugin-did-comm'

import RnSqlite from './rn-packages/db-driver-rn-sqlite3'
import { Store } from './packages/store'

import Debug from 'debug'
Debug.enable('*')
const debug = Debug('main')

// DID Document Resolver
// const web = webDidResolver.getResolver()
const didResolver = new Resolver({
  ...ethrDidResolver({
    rpcUrl: 'https://mainnet.infura.io/v3/5ffc47f65c4042ce847ef66a3fa70d4c',
  }),
  // ...web,
  // https: web.web,
  // nacl: naclDidResolver
})

const identityControllers = [new RnEthrDidController()]

const messageValidators = [
  new Rnd.RandomMessageValidator(),
  new DidJwtValidationManager({
    payloadValidators: [
      new W3c.W3cJwtPayloadValidator(),
      new Sdr.SDRJwtPayloadValidator(),
    ],
  }),
]

const serviceControllersWithConfig = [
  // { controller: Rnd.RandomMessageService, config: {}},
  {
    controller: TG.TrustGraphMessageService,
    config: {
      uri: 'https://mouro.eu.ngrok.io/graphql',
      wsUri: 'wss://mouro.eu.ngrok.io/graphql',
    },
  },
]

const actionHandler = new DebugActionHandler()
actionHandler
  .setNext(new DidCommActionHandler())
  .setNext(
    new TG.TrustGraphActionHandler({
      uri: 'https://mouro.eu.ngrok.io/graphql',
    }),
  )
  .setNext(new W3c.W3cActionHandler())
  .setNext(new Sdr.SDRActionHandler())

export const core = new Core({
  identityControllers,
  serviceControllersWithConfig,
  didResolver,
  messageValidators,
  actionHandler,
})

export const db = new RnSqlite('database.sqlite3')
export const store = new Store(db)

core.on(
  EventTypes.validatedMessage,
  async (eventType: string, message: Types.ValidatedMessage) => {
    debug('New message %O', message)
    await store.saveMessage(message)
  },
)
