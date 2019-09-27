import { client } from './GraphQL'
import { Queries } from './serto-graph'

export const saveMessage = async (jwt: string) => {
  return client.mutate({
    mutation: Queries.newMessage,
    variables: { jwt },
    refetchQueries: [
      { query: Queries.findMessages },
      { query: Queries.getAllIdentities },
    ],
  })
}
