export interface Viewer {
  did: string
  isAdmin: boolean
  ownsDids: string[]
}

export interface Logger {
  info(message: string, category?: string): void
  warning(message: string, category?: string): void
  error(message: string, category?: string): void
}

export interface DbDriver {
  rows(sql: string, params: any[] | {} | null): Promise<any>
  run(sql: string, params: any[]): Promise<any>
}

export interface Migration {
  run(db: DbDriver, index: number): Promise<any>
}

export interface DIDManager {
  getDids(): Promise<string[]>
  newDid(): Promise<string>
  signJWT(obj: any, did: string): Promise<string>
}

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
