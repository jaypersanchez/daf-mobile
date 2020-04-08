import { Agent } from 'daf-core'
import AsyncStorage from '@react-native-community/async-storage'

export interface Context {
  agent: Agent
}

const isSelected = async (identity: any, args: any, ctx: Context) => {
  const did = await AsyncStorage.getItem('selectedDid')
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
  console.log('checking did', did)

  if (did !== null) {
    return {
      did,
      __typename: 'Identity',
    }
  } else {
    // Check if there are any identities in the core.
    // Set the first one as viewer by default
    // @Todo Remove this setter and leave the context state manage it
    const identities = await ctx.agent.identityManager.getIdentities()
    if (identities.length > 0) {
      await AsyncStorage.setItem('selectedIdentity', identities[0].did)
      return {
        did: identities[0].did,
        __typename: 'Identity',
      }
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
}

export const typeDefs = `
  extend type Identity {
    isSelected: Boolean
  }
  extend type Query {
    viewer: Identity
  }
  extend type Mutation {
    setViewer(did: String): Boolean
  }
`
