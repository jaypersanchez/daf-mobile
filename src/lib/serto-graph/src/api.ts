import * as blake from 'blakejs'
import { DbDriver, Viewer, Logger } from './types'
import runMigrations from './migrations'
import { verifyEdgeJWT } from '../../serto-credentials/verification'
import * as sql from 'sql-bricks-sqlite'

class Api {
  private db: DbDriver

  constructor(dbDriver: DbDriver) {
    this.db = dbDriver
  }

  initialize() {
    return runMigrations(this.db)
  }

  findClaims({ iss, sub }: { iss?: string; sub?: string }) {
    let where = {}

    if (iss) where = sql.and(where, { iss })
    if (sub) where = sql.and(where, { sub })

    const query = sql
      .select('rowid', '*')
      .from('verifiable_claims')
      .where(where)
      .orderBy('nbf desc')
      .toParams()

    return this.db.rows(query.text, query.values).then(rows => {
      return rows.map((row: any) => ({
        rowId: `${row.rowid}`,
        hash: row.hash,
        parentHash: row.parent_hash,
        iss: { did: row.iss },
        sub: { did: row.sub },
        jwt: row.jwt,
        nbf: row.nbf,
      }))
    })
  }

  claimsForMessageHash(hash: string) {
    const query = sql
      .select('rowid', '*')
      .from('verifiable_claims')
      .where({ parent_hash: hash })
      .toParams()

    return this.db.rows(query.text, query.values).then(rows =>
      rows.map((row: any) => ({
        rowId: `${row.rowid}`,
        hash: row.hash,
        parentHash: row.parent_hash,
        iss: { did: row.iss },
        sub: { did: row.sub },
        jwt: row.jwt,
        nbf: row.nbf,
        exp: row.exp,
      })),
    )
  }

  claimsFieldsForClaimHash(hash: string) {
    const query = sql
      .select('rowid', '*')
      .from('verifiable_claims_fields')
      .where({ parent_hash: hash })
      .toParams()

    return this.db.rows(query.text, query.values).then(rows =>
      rows.map((row: any) => ({
        rowId: `${row.rowid}`,
        hash: row.hash,
        parentHash: row.parent_hash,
        iss: { did: row.iss },
        sub: { did: row.sub },
        type: row.claim_type,
        value: row.claim_value,
        isObj: row.is_obj === 1,
      })),
    )
  }

  findMessages({
    iss,
    sub,
    tag,
    limit,
  }: {
    iss?: string
    sub?: string
    tag?: string
    limit?: number
  }) {
    let where = {}

    if (iss) where = sql.and(where, { iss })
    if (sub) where = sql.and(where, { sub })
    if (tag) where = sql.and(where, { tag })

    let query = sql
      .select('rowid', '*')
      .from('messages')
      .where(where)
      .orderBy('nbf desc')

    if (limit) {
      query = query.limit(limit)
    }

    query = query.toParams()

    return this.db.rows(query.text, query.values).then(rows =>
      rows.map((row: any) => ({
        rowId: `${row.rowid}`,
        hash: row.hash,
        iss: { did: row.iss },
        sub: { did: row.sub },
        type: row.type,
        data: row.data,
        jwt: row.jwt,
        nbf: row.nbf,
        iat: row.iat,
      })),
    )
  }

  findMessage(hash: string, viewer: Viewer) {
    const query = sql
      .select('rowid', '*')
      .from('messages')
      .where({ hash })
      .toParams()

    return this.db
      .rows(query.text, query.values)
      .then(rows =>
        rows.map((row: any) => ({
          rowId: `${row.rowid}`,
          hash: row.hash,
          iss: { did: row.iss },
          sub: { did: row.sub },
          type: row.type,
          jwt: row.jwt,
          data: row.data,
          nbf: row.nbf,
        })),
      )
      .then(rows => rows[0])
  }

  async allIdentities() {
    const vcSubjects = await this.db.rows(
      'select distinct sub as did from verifiable_claims',
      null,
    )
    const vcIssuers = await this.db.rows(
      'select distinct iss as did from verifiable_claims',
      null,
    )
    const messageSubjects = await this.db.rows(
      'select distinct sub as did from messages where sub is not null',
      null,
    )
    const messageIssuers = await this.db.rows(
      'select distinct iss as did from messages',
      null,
    )
    const uniqueDids = [
      ...new Set([
        ...messageSubjects.map((item: any) => item.did),
        ...messageIssuers.map((item: any) => item.did),
        ...vcIssuers.map((item: any) => item.did),
        ...vcSubjects.map((item: any) => item.did),
      ]),
    ].map(did => ({ did }))

    return uniqueDids
  }

  async findIdentityByDid(did: string) {
    return { did }
  }

  async popularClaimForDid(did: string, claimType: string) {
    const rows = await this.db.rows(
      `select * from (
      select sub, claim_value from "verifiable_claims_fields"  where claim_type=? group by sub, claim_type, claim_value
      order by count(claim_value) asc ) where sub=? group by sub;`,
      [claimType, did],
    )
    return rows[0] && rows[0].claim_value
  }

  async interactionCount(did: string, viewer: Viewer) {
    const rows = await this.db.rows(
      `select count(*) as count from messages
    where (iss=$did and sub=$viewer) or (iss=$viewer and sub=$did)`,
      { $did: did, $viewer: viewer.did },
    )
    return rows[0] && rows[0].count
  }

  async shortId(did: string) {
    const name = await this.popularClaimForDid(did, 'name')
    if (name) {
      return name
    }
    const firstName = await this.popularClaimForDid(did, 'firstName')
    const lastName = await this.popularClaimForDid(did, 'lastName')
    let shortId = firstName
    shortId = lastName ? `${firstName && firstName + ' '}${lastName}` : shortId
    shortId = !shortId ? `${did.slice(0, 15)}...${did.slice(-4)}` : shortId
    return shortId
  }

  async saveMessage(jwt: string) {
    const msg = await verifyEdgeJWT(jwt)
    const p = msg.verified.payload

    const query = sql.insert('messages', {
      hash: msg.hash,
      iss: p.iss,
      sub: p.sub,
      iat: p.iat,
      nbf: p.nbf,
      type: msg.type,
      tag: p.tag,
      data: p.data,
      jwt,
    })

    await this.db.run(query.text, query.values)

    for (const key in msg.vc) {
      if (msg.vc.hasOwnProperty(key)) {
        await this.saveVerifiableClaim(msg.vc[key], msg.hash)
      }
    }

    return { hash: msg.hash, iss: { did: p.iss } }
  }

  async saveVerifiableClaim(vc: any, messageHash: string) {
    const verifiableClaim = vc.payload as any

    const vcHash = blake.blake2bHex(vc.jwt)

    const query = sql.insert('verifiable_claims', {
      hash: vcHash,
      parent_hash: messageHash,
      iss: verifiableClaim.iss,
      sub: verifiableClaim.sub,
      nbf: verifiableClaim.nbf,
      iat: verifiableClaim.iat,
      jwt: vc.jwt,
    })

    await this.db.run(query.text, query.values)

    const claim = verifiableClaim.vc.credentialSubject

    for (const type in claim) {
      if (claim.hasOwnProperty(type)) {
        const value = claim[type]
        const isObj =
          typeof value === 'function' || (typeof value === 'object' && !!value)

        const fieldsQuery = sql.insert('verifiable_claims_fields', {
          parent_hash: vcHash,
          iss: verifiableClaim.iss,
          sub: verifiableClaim.sub,
          nbf: verifiableClaim.nbf,
          iat: verifiableClaim.iat,
          claim_type: type,
          claim_value: isObj ? JSON.stringify(value) : value,
          isObj: isObj ? 1 : 0,
        })

        await this.db.run(fieldsQuery.text, fieldsQuery.values)
      }
    }

    return vcHash
  }

  deleteMessage(hash: string, viewer: Viewer) {
    return this.db.run('DELETE FROM messages where hash=?', [hash])
  }
}

export default Api
