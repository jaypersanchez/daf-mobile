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
  run(db: DbDriver, index: Number): Promise<any>
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
  hash: string
  parentHash: string
  iss: Identity
  sub: Identity
  json: string
  raw: string
  iat: number
  exp: number
  fields: [VerifiableClaimField]
}

export interface VerifiableClaimField {
  hash: string
  parentHash: string
  iss: Identity
  sub: Identity
  type: string
  value: string
  isObj: Boolean
}

export interface Message {
  hash: string
  parent?: Message // hash - string
  raw?: string
  iss: Identity // did - string
  sub: Identity // did - string
  iat: number
  exp?: number
  title?: string
  body?: string
  vc: [VerifiableClaim]
  req?: [Request]
  resp?: [Response]
  callback?: string
}

export enum ResponseType {
  SelectiveDisclosure = 'SelectiveDisclosure',
}

export enum RequestType {
  PresentVC = 'PresentVerifiableClaims',
  SignVC = 'SignVerifiableClaim',
  SelectiveDisclosure = 'SelectiveDisclosure',
  Web3Rpc = 'Web3Rpc',
  Permissions = 'Permissions',
}

export interface Request {
  type: RequestType
}

export interface Response {
  type: ResponseType
}

export interface PermissionsRequest extends Request {
  permissions: string[]
}

export interface PresentVerifiableClaimsRequest extends Request {
  vc: [VerifiableClaim]
}

export interface SignClaimRequest extends Request {
  iss: string
  sub: string
  exp?: number
  claim: object
}

export interface SelectiveDisclosureResponse extends Response {
  vc: [VerifiableClaim]
}
export interface ClaimValueQueryObject {}

export interface SelectiveDisclosureRequest extends Request {
  claimType: string
  claimValue?: ClaimValueQueryObject
  required?: boolean
  iss?: string[] // Regex?
  exp?: {
    start?: number
    end?: number
  }
  iat?: {
    start?: number
    end?: number
  }
}

export interface Web3Rpc extends Request {
  rpcUrl?: string // Endpoint URL
  method: string
  params: object
}
