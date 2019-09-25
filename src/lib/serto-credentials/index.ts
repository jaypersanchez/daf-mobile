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

export enum ActionType {
  SelectiveDisclosureGQL = 'serto.action.sdr.gql.v1.0',
  SelectiveDisclosureClaims = 'serto.action.sdr.claims.v1.0',
}

export enum EdgeType {
  Encrypted = 'tg.edge.encrypted.v1.0',
  Plain = 'tg.edge.v1.0',
}

export enum VisibilityType {
  To = 'TO',
  Both = 'BOTH',
  Any = 'ANY',
}

// export const messageFromURL = async (url: string) => {
//   try {
//     const parsed = URL(url, true)
//     const path = parsed.pathname && parsed.pathname.match(/^\/?req\/(.*)$/)
//     if (!path || !path[1].match(JWT_REGEX)) {
//       throw Error('Unsupported URL')
//     }

//     const jwt = path[1]
//     const transportData = {
//       redirectUrl: parsed.query.redirect_url,
//       callbackType: parsed.query.callback_type,
//       requestId: parsed.query.id,
//     }
//     return messageFromJWT(jwt, transportData)
//   } catch (e) {
//     Log.error(e.message, 'URL Handler')
//   }
// }

// export const messageFromJWT = async (jwt: string, transportData: any) => {
//   Log.info('Verifying JWT', 'URL Handler')
//   const verified = await verifyJWT(jwt)
//   Log.info('JWT is valid', 'URL Handler')

//   const message: SertoMessage = {
//     jwt,
//   }

//   return message
// }
