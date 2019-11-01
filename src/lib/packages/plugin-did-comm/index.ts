import { AbstractActionHandler } from '../core/action-handler'
import { Action } from '../core/types'
import Core from '../core/core'
import Debug from 'debug'
const debug = Debug('did-comm-action-handler')

export const ActionTypes = {
  sendJwt: 'action.sendJwt',
}

export interface ActionSendJWT extends Action {
  data: {
    from: string
    to: string
    jwt: string
  }
}

class DidCommActionHandler extends AbstractActionHandler {
  public async handleAction(action: Action, core: Core) {
    if (action.type === ActionTypes.sendJwt) {
      const { data } = action as ActionSendJWT

      debug('Resolving didDoc')
      const didDoc = await core.didResolver.resolve(data.to)

      const service =
        didDoc &&
        didDoc.service &&
        didDoc.service.find(item => item.type == 'MessagingService')

      if (service) {
        try {
          debug('Sending to %s', service.serviceEndpoint)
          const res = await fetch(service.serviceEndpoint, {
            method: 'POST',
            body: data.jwt,
          })
          debug('Status', res.status, res.statusText)

          if (res.status == 200) {
            await core.onRawMessage({ raw: data.jwt })
          }

          return res.status == 200
        } catch (e) {
          return Promise.reject(e)
        }
      } else {
        debug('No MessagingService service in didDoc')
        return super.handleAction(action, core)
      }
    }
    return super.handleAction(action, core)
  }
}

export default DidCommActionHandler
