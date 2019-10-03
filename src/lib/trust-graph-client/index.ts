import { createJWT } from 'did-jwt'
import { Issuer } from 'did-jwt-vc/src/types'

// apollo
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { split } from 'apollo-link'
import gql from 'graphql-tag'

interface Logger {
  info: (msg: string, tag: string) => void
  warning: (msg: string, tag: string) => void
  error: (msg: string, tag: string) => void
}

interface Config {
  uri: string
  wsUri: string
  getIssuer: () => Promise<Issuer>
  webSocketImpl?: any
  saveMessage: (jwt: string) => Promise<any>
  getLatestMessageTimestamp: () => Promise<number>
  getLatestPublicProfileTimestamp: (did: string) => Promise<number>
  log: Logger
}

class TrustGraphClient {
  private uri: string
  private wsUri: string
  private webSocketImpl: any
  private getIssuer: () => Promise<Issuer>
  private saveMessage: (jwt: string) => Promise<any>
  private getLatestMessageTimestamp: () => Promise<number>
  private getLatestPublicProfileTimestamp: (did: string) => Promise<number>
  private log: Logger

  private client?: any

  constructor(config: Config) {
    this.uri = config.uri
    this.wsUri = config.wsUri
    this.getIssuer = config.getIssuer
    this.webSocketImpl = config.webSocketImpl
    this.saveMessage = config.saveMessage
    this.getLatestMessageTimestamp = config.getLatestMessageTimestamp
    this.getLatestPublicProfileTimestamp =
      config.getLatestPublicProfileTimestamp
    this.log = config.log
  }

  getClient() {
    return this.client
  }

  async setupClient() {
    const getAuthToken = async () => {
      const issuer = await this.getIssuer()

      const vc = {
        exp: Math.floor(Date.now() / 1000) + 100,
      }
      const jwt = await createJWT(vc, {
        issuer: issuer.did,
        signer: issuer.signer,
        alg: 'ES256K-R',
      })

      return jwt
    }

    const authLink = setContext(async (_, { headers }) => {
      const token = await getAuthToken()
      return {
        headers: { ...headers, authorization: `Bearer ${token}` },
      }
    })

    const httpLink = new HttpLink({ uri: this.uri })
    let link = null

    if (this.wsUri) {
      const wsLink = new WebSocketLink({
        uri: this.wsUri,
        options: {
          reconnect: true,
          connectionParams: async () => {
            const token = await getAuthToken()
            return { authorization: `Bearer ${token}` }
          },
        },
        webSocketImpl: this.webSocketImpl,
      })

      link = split(
        // split based on operation type
        ({ query }) => {
          const definition = getMainDefinition(query)
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          )
        },
        wsLink,
        httpLink,
      )
    } else {
      link = httpLink
    }

    this.client = new ApolloClient({
      cache: new InMemoryCache(),
      link: authLink.concat(link),
    })
  }

  async syncLatestMessages() {
    const issuer = await this.getIssuer()

    this.log.info('Syncing data with ' + this.uri, 'TGC')

    const lastMessageTime = await this.getLatestMessageTimestamp()

    this.log.info('Latest known message time: ' + lastMessageTime, 'TGC')

    try {
      const { data } = await this.client.query({
        query: findEdges,
        fetchPolicy: 'network-only',
        variables: {
          toDID: [issuer.did],
          since: lastMessageTime,
        },
      })

      for (const edge of data.findEdges) {
        this.log.info('Saving ' + edge.hash, 'TGC')
        try {
          const message = await this.saveMessage(edge.jwt)
          await this.syncPublicProfile(message.iss.did)
        } catch (e) {
          this.log.error(e.message, 'TGC')
        }
      }
    } catch (e) {
      this.log.error(e.message, 'TGC')
    }

    this.log.info('Done syncing data', 'TGC')
  }

  async syncPublicProfile(did: string) {
    this.log.info('Getting public profile for ' + did, 'TGC')

    const lastMessageTime = await this.getLatestPublicProfileTimestamp(did)

    this.log.info(
      'Latest known public profile message time: ' + lastMessageTime,
      'TGC',
    )

    try {
      const { data } = await this.client.query({
        query: findEdges,
        fetchPolicy: 'network-only',
        variables: {
          toDID: [did],
          fromDID: [did],
          since: lastMessageTime,
          tag: 'public-profile.v1',
        },
      })

      for (const edge of data.findEdges) {
        this.log.info('Saving ' + edge.hash, 'TGC')
        try {
          await this.saveMessage(edge.jwt)
        } catch (e) {
          this.log.error(e.message, 'TGC')
        }
      }
    } catch (e) {
      this.log.error(e.message, 'TGC')
    }

    this.log.info('Done getting public profile', 'TGC')
  }

  async subscribeToNewEdges() {
    const issuer = await this.getIssuer()

    this.log.info('Subscribing to new data', 'TGC')
    const saveMessage = this.saveMessage.bind(this)
    const syncPublicProfile = this.syncPublicProfile.bind(this)
    const log = this.log

    this.client
      .subscribe({
        query: edgeAdded,
        variables: { toDID: issuer.did },
      })
      .subscribe({
        async next(result: any) {
          log.info('New edge received', 'TGC')
          try {
            const message = await saveMessage(result.data.edgeAdded.jwt)
            await syncPublicProfile(message.iss.did)
          } catch (e) {
            log.error(e.message, 'TGC')
          }
        },
        error(err: Error) {
          log.error(err.message, 'TGC')
        },
      })
  }
}

// Queries

export const findEdges = gql`
  query findEdges($toDID: [String], $since: Int) {
    findEdges(toDID: $toDID, since: $since) {
      time
      hash
      jwt
    }
  }
`

export const edgeAdded = gql`
  subscription edgeAdded($toDID: [String]) {
    edgeAdded(toDID: $toDID) {
      jwt
    }
  }
`

export default TrustGraphClient
