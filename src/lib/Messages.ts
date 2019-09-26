import { client } from './GraphQL'
import { Queries } from './serto-graph'

export const saveMessage = async (jwt: string) => {
  try {
    await client.mutate({
      mutation: Queries.newMessage,
      variables: { jwt },
      refetchQueries: ['FindMessages($iss: ID, $sub: ID)'],
    })
  } catch (e) {
    console.log(e)
  }
  return ''
}
