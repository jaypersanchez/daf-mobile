import React from 'react'
import { ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { persistCache } from 'apollo-cache-persist'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'
import { ApolloClient, Resolvers } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { from } from 'apollo-link'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema } from 'graphql-tools'
import { Container, Screen, Text } from '@kancha/kancha-ui'
import merge from 'lodash.merge'

import { core, dataStore, db } from './setup'
import * as Gql from './packages/daf-graphql'
import * as LocalGql from './rn-packages/rn-graphql'

export const schema = makeExecutableSchema({
  typeDefs: [
    Gql.Base.typeDefs,
    Gql.Core.typeDefs,
    Gql.DataStore.typeDefs,
    // Gql.DIDComm.typeDefs,
    Gql.IdentityManager.typeDefs,
    Gql.W3c.typeDefs,
    LocalGql.typeDefs,
  ],
  resolvers: merge(
    Gql.Core.resolvers,
    Gql.DataStore.resolvers,
    // Gql.DIDComm.resolvers,
    Gql.IdentityManager.resolvers,
    Gql.W3c.resolvers,
    LocalGql.resolvers,
  ),
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

interface Props {}
interface State {
  isRunningMigrations: boolean
}

class CustomProvider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isRunningMigrations: true,
    }
  }

  async componentDidMount() {
    await db.initialize()
    await dataStore.initialize()
    await core.startServices()

    this.setState({ isRunningMigrations: false })
    await core.syncServices(0)
  }

  render() {
    if (this.state.isRunningMigrations) {
      return (
        <Screen>
          <Container flex={1} alignItems={'center'} justifyContent={'center'}>
            <ActivityIndicator size={'large'} />
          </Container>
        </Screen>
      )
    } else {
      return (
        <ApolloProvider client={client}>
          <ApolloHooksProvider client={client}>
            {this.props.children}
          </ApolloHooksProvider>
        </ApolloProvider>
      )
    }
  }
}

export default CustomProvider
