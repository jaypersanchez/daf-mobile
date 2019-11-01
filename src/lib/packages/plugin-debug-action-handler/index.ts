import { AbstractActionHandler } from '../core/action-handler'
import { Action } from '../core/types'
import Core from '../core/core'

import Debug from 'debug'
const debug = Debug('action')

class DebugActionHandler extends AbstractActionHandler {
  public async handleAction(action: Action, core: Core) {
    debug('%o', action)
    return super.handleAction(action, core)
  }
}

export default DebugActionHandler
