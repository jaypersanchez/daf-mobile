import { core } from './setup'

export const saveMessage = async (jwt: string) => {
  return core.onRawMessage({ raw: jwt })
}
