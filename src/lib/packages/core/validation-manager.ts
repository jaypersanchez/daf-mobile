import { RawMessage, ValidatedMessage, PreValidatedMessage } from './types'
import { Resolver } from 'did-resolver'
const blake = require('blakejs')
import Debug from 'debug'
const debug = Debug('validation-manager')

export interface MessageValidator {
  validate: (
    rawMessage: RawMessage,
    didResolver: Resolver,
  ) => Promise<PreValidatedMessage>
}

interface Options {
  messageValidators: MessageValidator[]
  didResolver: Resolver
}

class MessageValidationManager {
  private messageValidators: MessageValidator[]
  private didResolver: Resolver

  constructor(options: Options) {
    this.messageValidators = options.messageValidators
    this.didResolver = options.didResolver
  }

  async validate(rawMessage: RawMessage): Promise<ValidatedMessage> {
    for (const messageValidator of this.messageValidators) {
      try {
        const message = await messageValidator.validate(
          rawMessage,
          this.didResolver,
        )
        if (this.isValidatedMessage(message)) {
          return {
            ...message,
            hash: blake.blake2bHex(message.raw),
          }
        }
      } catch (e) {}
    }

    return Promise.reject('Invalid message')
  }

  private isValidatedMessage(message: PreValidatedMessage): boolean {
    if (!message.type || message.type == '') {
      debug('Missing `type` in %o', message)
      return false
    }
    if (!message.issuer || message.issuer == '') {
      debug('Missing `issuer` in %o', message)
      return false
    }
    if (!message.raw || message.raw == '') {
      debug('Missing `raw` in %o', message)
      return false
    }
    return true
  }
}

export default MessageValidationManager
