const blake = require('blakejs')

import { verifyJWT } from 'did-jwt'
import { verifyCredential, verifyPresentation } from 'did-jwt-vc'
import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'

const resolver = new Resolver(
  getResolver({
    rpcUrl: 'https://mainnet.infura.io/v3/5ffc47f65c4042ce847ef66a3fa70d4c',
  }),
)

export async function verifyEdgeJWT(
  jwt: string,
): Promise<{
  hash: string
  type: string
  vc: any[]
  verified: any
}> {
  const hash = blake.blake2bHex(jwt)

  // check if jwt is a VC
  try {
    const verified = await verifyCredential(jwt, resolver)
    return {
      hash,
      type: 'w3c.vc',
      vc: [verified],
      verified,
    }
  } catch (e) {
    // not a VC
  }

  // check if jwt is a VP
  try {
    const verified = await verifyPresentation(jwt, resolver)
    const vc = await Promise.all(
      verified.payload.vp.verifiableCredential.map((vcJwt: string) =>
        verifyCredential(vcJwt, resolver),
      ),
    )
    return {
      hash,
      type: 'w3c.vp',
      vc,
      verified,
    }
  } catch (e) {
    // not a VP
  }

  const verified = await verifyJWT(jwt, { resolver })

  return {
    hash,
    type: verified.payload.type || 'unknown',
    verified,
    vc: [],
  }
}
