export interface Identity {
  did: string
  shortId: string
  firstName: string
  lastName: string
  profileImage: string
  url: string
  description: string
  interactionCount: number
}

export interface VerifiableClaim {
  rowId: string
  hash: string
  parentHash: string
  iss: Identity
  sub: Identity
  json: string
  jwt: string
  nbf: number
  exp: number
  fields: [VerifiableClaimField]
}

export interface VerifiableClaimField {
  rowId: string
  hash: string
  parentHash: string
  iss: Identity
  sub: Identity
  type: string
  value: string
  isObj: boolean
}
