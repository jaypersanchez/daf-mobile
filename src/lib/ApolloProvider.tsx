import React, { useState, useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { from } from 'apollo-link'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema } from 'graphql-tools'
import { Container, Screen } from '@kancha/kancha-ui'
import * as Daf from 'daf-core'
import { core, dataStore, db, resolvers, typeDefs } from './setup'
import Debug from 'debug'
Debug.enable('*')
const debug = Debug('Provider')

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const contextLink = new SchemaLink({
  schema,
  context: { core, dataStore },
})

const link = from([contextLink])

export const cache = new InMemoryCache({})

export const client = new ApolloClient({
  connectToDevTools: true,
  cache,
  link,
})

core.on(
  Daf.EventTypes.validatedMessage,
  async (eventType: string, message: Daf.Types.ValidatedMessage) => {
    debug('New message %O', message)
    await dataStore.saveMessage(message)

    client.reFetchObservableQueries()
  },
)

interface Props {}

const CustomProvider: React.FC<Props> = ({ children }) => {
  const [isRunningMigrations, setIsRuning] = useState(true)

  const syncDaf = async () => {
    await db.initialize()
    await dataStore.initialize()
    await core.startServices()

    setIsRuning(false)

    await core.syncServices(await dataStore.latestMessageTimestamps())
  }

  useEffect(() => {
    syncDaf()
  }, [])

  return isRunningMigrations ? (
    <Screen>
      <Container flex={1} alignItems={'center'} justifyContent={'center'}>
        <ActivityIndicator size={'large'} />
      </Container>
    </Screen>
  ) : (
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>{children}</ApolloHooksProvider>
    </ApolloProvider>
  )
}

export default CustomProvider
