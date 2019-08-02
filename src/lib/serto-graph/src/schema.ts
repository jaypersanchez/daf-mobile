import Api from './api'
import { Viewer } from './types'
import { SertoMessage } from '../../serto-credentials'

export const typeDefs = `
  type Query {
    viewer: Identity!
    identity(did: ID!): Identity
    identities(dids: [ID!]): [Identity]
    messages(iss: ID, sub: ID): [Message]
    message(hash: ID!): Message!
    claims(iss: ID, sub: ID): [VerifiableClaim]
  }

  type Mutation {
    deleteMessage(hash: ID!): Boolean
    newMessage(message: MessageInput!): Message
  }

  
  enum EdgeType {
    ISSUER
    SUBJECT
    ALL
  }

  type Identity {
    did: ID!
    shortId: String
    firstName: String
    lastName: String
    profileImage: String
    url: String
    description: String
    interactionCount: Int!
    messages(edgeType: EdgeType): [Message]
    claims(edgeType: EdgeType): [VerifiableClaim]
  }
  
  input MessageInput {
    hash: String
    iss: String
    sub: String
    time: Int
    type: String
    data: String
    tag: String
    visibility: String
    retention: Int
    jwt: String
  }

  type Message {
    hash: ID!
    iss: Identity!
    sub: Identity
    type: String!
    jwt: String!
    data: String!
    time: Int!
    visibility: String
    tag: String
    vc: [VerifiableClaim]
  }

  type VerifiableClaim {
    hash: ID!
    parentHash: ID!
    iss: Identity!
    sub: Identity!
    json: String!
    raw: String!
    nbf: Int!
    exp: Int
    fields: [VerifiableClaimField]
  }

  type VerifiableClaimField {
    hash: ID!
    parentHash: ID!
    iss: Identity!
    sub: Identity!
    type: String!
    value: String!
    isObj: Boolean!
  }

  `
/// isObj => type

type Context = {
  api: Api
  viewer: Viewer
}

export const resolvers = {
  Message: {
    vc: async (message: any, {}, { api }: Context) =>
      api.claimsForMessageHash(message.hash),
  },
  VerifiableClaim: {
    fields: async (vc: any, {}, { api }: Context) =>
      api.claimsFieldsForClaimHash(vc.hash),
  },
  Identity: {
    shortId: async (identity: any, {}, { api }: Context) =>
      api.shortId(identity.did),
    firstName: async (identity: any, {}, { api }: Context) =>
      api.popularClaimForDid(identity.did, 'firstName'),
    lastName: async (identity: any, {}, { api }: Context) =>
      api.popularClaimForDid(identity.did, 'lastName'),
    profileImage: async (identity: any, {}, { api }: Context) => {
      let url = await api.popularClaimForDid(identity.did, 'profileImage')
      try {
        const ipfs = JSON.parse(url)
        if (ipfs['/']) {
          url = 'https://cloudflare-ipfs.com' + ipfs['/']
        }
      } catch (e) {}
      return url
    },
    url: async (identity: any, {}, { api }: Context) =>
      api.popularClaimForDid(identity.did, 'url'),
    description: async (identity: any, {}, { api }: Context) =>
      api.popularClaimForDid(identity.did, 'description'),
    interactionCount: async (identity: any, {}, { api, viewer }: Context) =>
      api.interactionCount(identity.did, viewer),
    claims: async (
      identity: any,
      { edgeType }: { edgeType: string },
      { api, viewer }: Context,
    ) => {
      switch (edgeType) {
        case 'ISSUER':
          return api.findClaims(identity.did, null, viewer)
        case 'SUBJECT':
          return api.findClaims(null, identity.did, viewer)
      }
      return api.findClaims(identity.did, identity.did, viewer)
    },
    messages: async (
      identity: any,
      { edgeType }: { edgeType: string },
      { api, viewer }: Context,
    ) => {
      switch (edgeType) {
        case 'ISSUER':
          return api.findMessages(identity.did, null, viewer)
        case 'SUBJECT':
          return api.findMessages(null, identity.did, viewer)
      }
      return api.findMessages(identity.did, identity.did, viewer)
    },
  },
  Query: {
    viewer: async (_: any, {}, { api, viewer }: Context) =>
      api.findIdentityByDid(viewer.did),
    identity: async (_: any, { did }, { api }: Context) =>
      api.findIdentityByDid(did),
    identities: async (_: any, { dids }, { api }: Context) => {
      return dids ? dids.map(did => ({ did })) : api.allIdentities()
    },
    messages: async (
      _: any,
      { iss, sub }: { iss: string; sub: string },
      { api, viewer }: Context,
    ) => {
      return api.findMessages(iss, sub, viewer)
    },
    message: async (
      _: any,
      { hash }: { hash: string },
      { api, viewer }: Context,
    ) => api.findMessage(hash, viewer),
    claims: async (
      _: any,
      { iss, sub }: { iss: string; sub: string },
      { api, viewer }: Context,
    ) => api.findClaims(iss, sub, viewer),
  },
  Mutation: {
    newMessage: async (
      _: any,
      { message }: { message: SertoMessage },
      { api }: Context,
    ) => api.saveMessage(message),
    deleteMessage: async (_: any, { hash }, { api, viewer }: Context) =>
      api.deleteMessage(hash, viewer),
  },
}
