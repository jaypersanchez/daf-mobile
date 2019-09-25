import * as didJWT from 'did-jwt'
import * as blake from 'blakejs'
import { DbDriver, Viewer, Logger } from './types'
import runMigrations from './migrations'
import * as messages from './messages'
import { verifyEdgeJWT } from '../../serto-credentials/verification'

class Api {
  private db: DbDriver

  constructor(dbDriver: DbDriver) {
    this.db = dbDriver
  }

  initialize() {
    return runMigrations(this.db)
  }

  findClaims({ iss, sub }: { iss?: string; sub?: string }) {
    let params: string[] = []

    let sql =
      'SELECT "rowid" as rowid, * FROM verifiable_claims order by nbf desc'
    if (iss && !sub) {
      params = [iss]
      sql =
        'SELECT "rowid" as rowid, * FROM verifiable_claims where iss=? order by nbf desc'
    } else if (!iss && sub) {
      params = [sub]
      sql =
        'SELECT "rowid" as rowid, * FROM verifiable_claims where sub=? order by nbf desc'
    } else if (iss && sub) {
      params = [iss, sub]
      sql =
        'SELECT * FROM verifiable_claims where iss=? and sub=? order by nbf desc'
    }

    return this.db.rows(sql, params).then(rows => {
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
    return this.db
      .rows(
        'SELECT "rowid" as rowid, * FROM verifiable_claims where parent_hash=?',
        [hash],
      )
      .then(rows =>
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
    return this.db
      .rows(
        'SELECT "rowid" as rowid, * FROM verifiable_claims_fields where parent_hash=?',
        [hash],
      )
      .then(rows =>
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

  findMessages({ iss, sub }: { iss?: string; sub?: string }) {
    let params = null
    let sql = null

    sql = 'SELECT "rowid" as rowid, * FROM messages order by nbf desc'
    if (iss && !sub) {
      params = { $iss: iss }
      sql =
        'SELECT "rowid" as rowid,* FROM messages where iss=$iss order by nbf desc'
    } else if (!iss && sub) {
      params = { $sub: sub }
      sql =
        'SELECT "rowid" as rowid,* FROM messages where sub=$sub order by nbf desc'
    } else if (iss && sub) {
      params = { $iss: iss, $sub: sub }
      sql =
        'SELECT "rowid" as rowid,* FROM messages where iss=$iss or sub=$sub order by nbf desc'
    }

    return this.db.rows(sql, params).then(rows =>
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
    const params = [hash]
    const sql = 'SELECT "rowid" as rowid, * FROM messages where hash=?'

    return this.db
      .rows(sql, params)
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

    await this.db.run(
      'INSERT INTO messages (hash, iss, sub, iat, nbf, type, data, jwt ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [msg.hash, p.iss, p.sub, p.iat, p.nbf, msg.type, p.data, jwt],
    )

    for (const key in msg.vc) {
      if (msg.vc.hasOwnProperty(key)) {
        await this.saveVerifiableClaim(msg.vc[key], msg.hash)
      }
    }

    return { hash: msg.hash }
  }

  async saveVerifiableClaim(vc: any, messageHash: string) {
    const verifiableClaim = vc.payload as any

    const vcHash = blake.blake2bHex(vc.jwt)

    await this.db.run(
      'INSERT INTO verifiable_claims (hash, parent_hash, iss, sub, nbf, iat, jwt ) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        vcHash,
        messageHash,
        verifiableClaim.iss,
        verifiableClaim.sub,
        verifiableClaim.nbf,
        verifiableClaim.iat,
        vc.jwt,
      ],
    )

    const claim = verifiableClaim.vc.credentialSubject

    for (const type in claim) {
      if (claim.hasOwnProperty(type)) {
        const value = claim[type]
        const isObj =
          typeof value === 'function' || (typeof value === 'object' && !!value)
        await this.db.run(
          'INSERT INTO verifiable_claims_fields (parent_hash, iss, sub, nbf, iat, claim_type, claim_value, is_obj ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            vcHash,
            verifiableClaim.iss,
            verifiableClaim.sub,
            verifiableClaim.nbf,
            verifiableClaim.iat,
            type,
            isObj ? JSON.stringify(value) : value,
            isObj ? 1 : 0,
          ],
        )
      }
    }

    return vcHash
  }

  deleteMessage(hash: string, viewer: Viewer) {
    const params = [hash]
    const sql = 'DELETE FROM messages where hash=?'

    return this.db.run(sql, params)
  }
}

export default Api
