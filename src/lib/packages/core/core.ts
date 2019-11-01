import PubSub from 'pubsub-js'
import { Resolver } from 'did-resolver'
import IdentityManager, { IdentityController } from './identity-manager'
import ServiceManager, { ServiceControllerWithConfig } from './service-manager'
import ValidationManager, { MessageValidator } from './validation-manager'
import { ActionHandler } from './action-handler'
import { ValidatedMessage, RawMessage, Action } from './types'

import Debug from 'debug'
const debug = Debug('core')

export const EventTypes = {
  validatedMessage: 'validatedMessage',
  error: 'error',
}

interface Config {
  didResolver: Resolver
  identityControllers: IdentityController[]
  serviceControllersWithConfig: ServiceControllerWithConfig[]
  messageValidators: MessageValidator[]
  actionHandler?: ActionHandler
}

class Core {
  public identityManager: IdentityManager
  public didResolver: Resolver
  private serviceManager: ServiceManager
  private validationManager: ValidationManager
  private actionHandler?: ActionHandler

  constructor(config: Config) {
    this.identityManager = new IdentityManager({
      identityControllers: config.identityControllers,
    })

    this.didResolver = config.didResolver

    this.serviceManager = new ServiceManager({
      serviceControllersWithConfig: config.serviceControllersWithConfig,
      onRawMessage: this.onRawMessage.bind(this),
      didResolver: this.didResolver,
    })

    this.validationManager = new ValidationManager({
      messageValidators: config.messageValidators,
      didResolver: this.didResolver,
    })

    this.actionHandler = config.actionHandler
  }

  async startServices() {
    const issuers = await this.identityManager.listIssuers()
    await this.serviceManager.configureServices(issuers)
    await this.serviceManager.initServices()
  }

  async syncServices(since: number) {
    await this.serviceManager.syncServices(since)
  }

  public async onRawMessage(rawMessage: RawMessage) {
    debug('Raw message %O', rawMessage)
    try {
      const validatedMessage = await this.validationManager.validate(rawMessage)
      this.onValidatedMessage(validatedMessage)
    } catch (error) {
      this.onMessageValidationError(error, rawMessage)
    }
  }

  private onMessageValidationError(error: string, rawMessage: RawMessage) {
    PubSub.publish(EventTypes.error, { error, rawMessage })
  }

  private onValidatedMessage(message: ValidatedMessage) {
    PubSub.publish(EventTypes.validatedMessage + '.' + message.type, message)
  }

  public on(type: String, callback: (type: string, data: any) => void) {
    return PubSub.subscribe(type, callback)
  }

  public async handleAction(action: Action): Promise<any> {
    if (this.actionHandler) {
      return this.actionHandler.handleAction(action, this)
    } else {
      return Promise.reject('No action handler')
    }
  }
}

export default Core
