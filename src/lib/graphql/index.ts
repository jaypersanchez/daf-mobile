import { Core } from 'daf-core'
import AsyncStorage from '@react-native-community/async-storage'

export interface Context {
  core: Core
}

const isSelected = async (identity: any, args: any, ctx: Context) => {
  const did = await AsyncStorage.getItem('selectedDid')
  return identity.did === did
}

const setViewer = async (_: any, args: { did: string }, ctx: Context) => {
  return await AsyncStorage.setItem('selectedDid', args.did)
}

const viewer = async (_: any, args: any, ctx: Context) => {
  const did = await AsyncStorage.getItem('selectedDid')
  if (did !== null) {
    return {
      did,
      __typename: 'Identity',
    }
  } else {
    // Check if there are any identities in the core.
    // Set the first one as viewer by default
    const identities = await ctx.core.identityManager.getIdentities()

    if (identities.length > 0) {
      await AsyncStorage.setItem('selectedDid', identities[0].did)
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
