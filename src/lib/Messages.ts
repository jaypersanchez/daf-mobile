import { Queries } from './serto-graph'
import TrustGraphClient from './trust-graph-client'

let localClient: any
let trustGraphClient: TrustGraphClient

export const configure = (gqlClient: any, tgClient: any) => {
  localClient = gqlClient
  trustGraphClient = tgClient
}

export const saveMessage = async (jwt: string) => {
  const { data } = await localClient.mutate({
    mutation: Queries.newMessage,
    variables: { jwt },
    refetchQueries: [
      { query: Queries.findMessages },
      { query: Queries.getAllIdentities },
    ],
  })

  await trustGraphClient.syncPublicProfile(data.newMessage.iss.did)

  return data.newMessage
}
