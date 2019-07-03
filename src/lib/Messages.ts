import { SertoMessage } from './serto-credentials'
import { client } from './GraphQL'
import { Queries } from './serto-graph'

export const saveMessage = async (message: SertoMessage) => {
  console.log('HERE', message)
  try {
    await client.mutate({
      mutation: Queries.newMessage,
      variables: {
        json: JSON.stringify(message),
      },
      refetchQueries: ['FindMessages($iss: ID, $sub: ID)'],
    })
  } catch (e) {
    console.log(e)
  }
  return ''
}
