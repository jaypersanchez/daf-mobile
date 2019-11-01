import { MessageValidator } from '../core/validation-manager'
import { RawMessage, PreValidatedMessage } from '../core/types'

class RandomMessageValidator implements MessageValidator {
  async validate(
    rawMessage: RawMessage,
    resolver: any,
  ): Promise<PreValidatedMessage> {
    if (rawMessage.meta && rawMessage.meta.sourceType == 'random') {
      return {
        type: 'random',
        issuer: 'did:web:example.com',
        meta: rawMessage.meta,
        raw: rawMessage.raw,
      }
    } else {
      return Promise.reject()
    }
  }
}

export default RandomMessageValidator
