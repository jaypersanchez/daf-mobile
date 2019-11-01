import { RawMessage, PreValidatedMessage } from '../core/types'
import { MessageValidator } from '../core/validation-manager'
import { Resolver } from 'did-resolver'
import { verifyJWT } from 'did-jwt'
import Debug from 'debug'
const debug = Debug('did-jwt-validator')

export interface DidJwtPayloadValidator {
  validate: (
    verifiedJwt: any,
    didResolver: Resolver,
  ) => Promise<PreValidatedMessage>
}

interface Options {
  payloadValidators: DidJwtPayloadValidator[]
}

class DidJwtValidationManager implements MessageValidator {
  private payloadValidators: DidJwtPayloadValidator[]

  constructor(options: Options) {
    this.payloadValidators = options.payloadValidators
  }

  async validate(
    rawMessage: RawMessage,
    didResolver: Resolver,
  ): Promise<PreValidatedMessage> {
    debug('Verifying JWT...')
    let verified
    try {
      verified = await verifyJWT(rawMessage.raw, { resolver: didResolver })
      debug('Valid JWT.')

      for (const payloadValidator of this.payloadValidators) {
        try {
          const validMessage = await payloadValidator.validate(
            verified,
            didResolver,
          )
          return {
            ...validMessage,
            meta: rawMessage.meta,
          }
        } catch (e) {}
      }
    } catch (e) {
      debug(e.message)
    }

    return Promise.reject('Invalid message')
  }
}

export default DidJwtValidationManager
