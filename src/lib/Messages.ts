import { core } from './setup'

export const saveMessage = async (jwt: string) => {
  core.onRawMessage({ raw: jwt })
  return 'test'
}
