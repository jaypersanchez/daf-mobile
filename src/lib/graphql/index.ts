import { Agent } from 'daf-core'
import AsyncStorage from '@react-native-community/async-storage'

export interface Context {
  agent: Agent
}

const isSelected = async (identity: any, args: any, ctx: Context) => {
  const did = await AsyncStorage.getItem('selectedIdentity')
  return identity.did === did
}

const setViewer = async (_: any, args: { did: string }, ctx: Context) => {
  return await AsyncStorage.setItem('selectedDid', args.did)
}

const request = async (_: any, args: any, ctx: Context) => {
  const did = await AsyncStorage.getItem('selectedIdentity')

  if (did !== null) {
    return {
      did,
      __typename: 'Identity',
    }
  }
}

const viewer = async (_: any, args: any, ctx: Context) => {
  const did = await AsyncStorage.getItem('selectedIdentity')

  if (did !== null) {
    return {
      did,
      __typename: 'Identity',
    }
  } else {
    return {
      did: null,
    }
  }
}

export const resolvers = {
  Identity: {
    isSelected,
  },
  Query: {
    viewer,
  },
  Mutation: {
    setViewer,
  },
  Message: {
    viewer,
  },
}

export const typeDefs = `
  extend type Identity {
    isSelected: Boolean
  }
  extend type Message {
    viewer: Identity
  }
  extend type Query {
    viewer: Identity
  }
  extend type Mutation {
    setViewer(did: String): Boolean
  }
`
