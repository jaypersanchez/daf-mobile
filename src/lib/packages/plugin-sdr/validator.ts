import { DidJwtPayloadValidator } from '../plugin-did-jwt-validator'
import { PreValidatedMessage } from '../core/types'
import { Resolver } from 'did-resolver'

import Debug from 'debug'
const debug = Debug('sdr-validator')

export const MessageTypes = {
  sdr: 'sdr',
}

class SDRJwtPayloadValidator implements DidJwtPayloadValidator {
  async validate(
    verifiedJwt: any,
    didResolver: Resolver,
  ): Promise<PreValidatedMessage> {
    const p = verifiedJwt.payload
    if (p.type == MessageTypes.sdr && p.claims) {
      debug('JWT type is', MessageTypes.sdr)

      return {
        type: MessageTypes.sdr,
        raw: verifiedJwt.jwt,
        issuer: verifiedJwt.payload.iss,
        subject: verifiedJwt.payload.sub,
        time: verifiedJwt.payload.iat,
        verified: verifiedJwt,
      }
    } else {
      return Promise.reject()
    }
  }
}

export default SDRJwtPayloadValidator
