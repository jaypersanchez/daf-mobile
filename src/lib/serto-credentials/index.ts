import { verifyJWT } from 'did-jwt'
import URL from 'url-parse'
import Log from '../Log'
import registerHttpsResolver from 'https-did-resolver'
import registerUportResolver from 'uport-did-resolver'
import registerEthrResolver from 'ethr-did-resolver'

registerHttpsResolver()
registerUportResolver()
registerEthrResolver()

export const JWT_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/

export interface SertoMessage {
  version: string
  transportData?: {
    redirectUrl?: string
    requestId?: string
    callbackType?: string
  }
  jwt: string
  payload?: any
}

export const messageFromURL = async (url: string) => {
  try {
    const parsed = URL(url, true)
    const path = parsed.pathname && parsed.pathname.match(/^\/?req\/(.*)$/)
    if (!path || !path[1].match(JWT_REGEX)) {
      throw Error('Unsupported URL')
    }

    const jwt = path[1]
    const transportData = {
      redirectUrl: parsed.query.redirect_url,
      callbackType: parsed.query.callback_type,
      requestId: parsed.query.id,
    }
    return messageFromJWT(jwt, transportData)
  } catch (e) {
    Log.error(e.message, 'URL Handler')
  }
}

export const messageFromJWT = async (jwt: string, transportData: any) => {
  Log.info('Verifying JWT', 'URL Handler')
  const verified = await verifyJWT(jwt)
  Log.info('JWT is valid', 'URL Handler')

  const message: SertoMessage = {
    version: '2.0',
    jwt,
    payload: verified.payload,
    transportData,
  }

  return message
}

export const sendResponse = async (
  message: SertoMessage,
  responseParams: any,
  signer: any,
) => {}
