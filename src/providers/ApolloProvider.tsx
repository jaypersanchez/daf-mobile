import React, { useState, useEffect } from 'react'
import { ApolloProvider as ReactApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { from } from 'apollo-link'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema } from 'graphql-tools'
import { agent, resolvers, typeDefs } from '../lib/setup'
import * as Daf from 'daf-core'
import Debug from 'debug'

const debug = Debug('daf-provider:apollo')

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})
const contextLink = new SchemaLink({
  schema,
  context: { agent },
})
const link = from([contextLink])
export const cache = new InMemoryCache({})
export const client = new ApolloClient({
  connectToDevTools: true,
  cache,
  link,
})

interface Props {}

export const ApolloProvider: React.FC<Props> = ({ children }) => {
  useEffect(() => {
    agent.on(Daf.EventTypes.savedMessage, async (message: Daf.Message) => {
      debug('New message %O', message)
      client.reFetchObservableQueries()
    })
  }, [])

  return (
    <ReactApolloProvider client={client}>
      <ApolloHooksProvider client={client}>{children}</ApolloHooksProvider>
    </ReactApolloProvider>
  )
}
