import React from 'react'
import { ActivityIndicator } from 'react-native'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { from } from 'apollo-link'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema } from 'graphql-tools'
import { Container, Screen, Text } from '@kancha/kancha-ui'

import { core, dataStore, db, resolvers, typeDefs } from './setup'

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
    await core.syncServices(await dataStore.latestMessageTimestamps())
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
