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
    newMessage(jwt: String!): Message
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
  
  type Message {
    hash: ID!
    rowId: String!
    iss: Identity!
    sub: Identity
    aud: Identity
    type: String!
    jwt: String!
    data: String!
    iat: Int
    nbf: Int
    vis: String
    tag: String
    vc: [VerifiableClaim]
  }

  type VerifiableClaim {
    hash: ID!
    parentHash: ID!
    rowId: String!
    iss: Identity!
    sub: Identity!
    json: String!
    jwt: String!
    nbf: Int
    iat: Int
    exp: Int
    fields: [VerifiableClaimField]
  }

  type VerifiableClaimField {
    rowId: String!
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
      } catch (e) {
        // do nothing
      }
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
          return api.findClaims({ iss: identity.did })
        case 'SUBJECT':
          return api.findClaims({ sub: identity.did })
      }
      return api.findClaims({ iss: identity.did, sub: identity.did })
    },
    messages: async (
      identity: any,
      { edgeType }: { edgeType: string },
      { api, viewer }: Context,
    ) => {
      switch (edgeType) {
        case 'ISSUER':
          return api.findMessages({ iss: identity.did })
        case 'SUBJECT':
          return api.findMessages({ sub: identity.did })
      }
      return api.findMessages({ iss: identity.did, sub: identity.did })
    },
  },
  Query: {
    viewer: async (_: any, {}, { api, viewer }: Context) =>
      api.findIdentityByDid(viewer.did),
    identity: async (_: any, { did }: { did: string }, { api }: Context) =>
      api.findIdentityByDid(did),
    identities: async (
      _: any,
      { dids }: { dids: string[] },
      { api }: Context,
    ) => {
      return dids ? dids.map(did => ({ did })) : api.allIdentities()
    },
    messages: async (
      _: any,
      { iss, sub }: { iss: string; sub: string },
      { api }: Context,
    ) => {
      return api.findMessages({ iss, sub })
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
    ) => {
      const res = await api.findClaims({ iss, sub })
      return res
    },
  },
  Mutation: {
    newMessage: async (_: any, { jwt }: { jwt: string }, { api }: Context) =>
      api.saveMessage(jwt),
    deleteMessage: async (
      _: any,
      { hash }: { hash: string },
      { api, viewer }: Context,
    ) => api.deleteMessage(hash, viewer),
  },
}
