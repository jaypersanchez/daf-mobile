import * as didJWT from 'did-jwt'
import * as blake from 'blakejs'
import { DbDriver, Viewer, Logger } from './types'
import runMigrations from './migrations'
import * as messages from './messages'
import { SertoMessage, vcsInMessage } from '../../serto-credentials'

class Api {
  private db: DbDriver

  constructor(dbDriver: DbDriver) {
    this.db = dbDriver
  }

  initialize() {
    return runMigrations(this.db)
  }

  // Access Control Logic
  isAdmin(did: string) {
    // Todo query for admin claims
    return false
  }
  getOwnedDids(did: string) {
    // Todo query for ownership claims
    return [did]
  }

  findClaims(iss: string, sub: string, viewer: Viewer) {
    let params = null
    let sql = null

    if (viewer.isAdmin) {
      sql =
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
    } else {
      const ownership = this.getOwnershipSqlParams(viewer)
      params = ownership.params
      const accessControlSql = `inner join messages as m on vc.parent_hash = m.hash where (m.sub in (${ownership.sql}) or m.iss in (${ownership.sql}))`

      sql = `SELECT "rowid" as rowid, vc.* FROM verifiable_claims as vc ${accessControlSql} order by vc.nbf desc`
      if (iss && !sub) {
        params[`$iss`] = iss
        sql = `SELECT "rowid" as rowid, vc.* FROM verifiable_claims as vc ${accessControlSql} and vc.iss=$iss order by nbf desc`
      } else if (!iss && sub) {
        params[`$sub`] = sub
        sql = `SELECT "rowid" as rowid, vc.* FROM verifiable_claims as vc ${accessControlSql} and vc.sub=$sub order by nbf desc`
      }
    }
    console.log(sql, params)
    return this.db.rows(sql, params).then(rows => {
      return rows.map(row => ({
        rowId: `${row.rowid}`,
        hash: row.hash,
        parentHash: row.parent_hash,
        iss: { did: row.iss },
        sub: { did: row.sub },
        raw: row.raw,
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
        rows.map(row => ({
          rowId: `${row.rowid}`,
          hash: row.hash,
          parentHash: row.parent_hash,
          iss: { did: row.iss },
          sub: { did: row.sub },
          raw: row.raw,
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
        rows.map(row => ({
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

  getOwnershipSqlParams(viewer: Viewer) {
    const params = {}
    const sql = viewer.ownsDids.map((did, key) => `$did${key}`).join(', ')
    viewer.ownsDids.forEach((did, key) => {
      params[`$did${key}`] = did
    })
    return {
      params,
      sql,
    }
  }

  findMessages(iss: string, sub: string, viewer: Viewer) {
    let params = null
    let sql = null
    if (viewer.isAdmin) {
      sql = 'SELECT "rowid" as rowid, * FROM messages order by time desc'
      if (iss && !sub) {
        params = { $iss: iss }
        sql =
          'SELECT "rowid" as rowid,* FROM messages where iss=$iss order by time desc'
      } else if (!iss && sub) {
        params = { $sub: sub }
        sql =
          'SELECT "rowid" as rowid,* FROM messages where sub=$sub order by time desc'
      } else if (iss && sub) {
        params = { $iss: iss, $sub: sub }
        sql =
          'SELECT "rowid" as rowid,* FROM messages where iss=$iss or sub=$sub order by time desc'
      }
    } else {
      const ownership = this.getOwnershipSqlParams(viewer)
      params = ownership.params
      const accessControlSql = `(iss in (${ownership.sql}) or sub in (${ownership.sql}))`
      sql = `SELECT "rowid" as rowid,* FROM messages where ${accessControlSql} order by time desc`
      if (iss && !sub) {
        params[`$iss`] = iss
        sql = `SELECT "rowid" as rowid,* FROM messages where iss=$iss and ${accessControlSql} order by time desc`
      } else if (!iss && sub) {
        params[`$sub`] = sub
        sql = `SELECT "rowid" as rowid,* FROM messages where sub=$sub and ${accessControlSql} order by time desc`
      } else if (iss && sub) {
        params[`$iss`] = iss
        params[`$sub`] = sub
        sql = `SELECT "rowid" as rowid,* FROM messages where (iss=$iss or sub=$sub) and ${accessControlSql} order by time desc`
      }
    }
    return this.db.rows(sql, params).then(rows =>
      rows.map(row => ({
        rowId: `${row.rowid}`,
        hash: row.hash,
        iss: { did: row.iss },
        sub: { did: row.sub },
        type: row.type,
        data: row.data,
        jwt: row.jwt,
        time: row.time,
      })),
    )
  }

  findMessage(hash: string, viewer: Viewer) {
    let params = null
    let sql = null
    if (viewer.isAdmin) {
      params = [hash]
      sql = 'SELECT "rowid" as rowid, * FROM messages where hash=?'
    } else {
      const ownership = this.getOwnershipSqlParams(viewer)
      params = { ...ownership.params, $hash: hash }
      const accessControlSql = `(iss in (${ownership.sql}) or sub in (${ownership.sql}))`
      sql = `SELECT "rowid" as rowid, * FROM messages where hash=$hash and ${accessControlSql}`
    }

    return this.db
      .rows(sql, params)
      .then(rows =>
        rows.map(row => ({
          rowId: `${row.rowid}`,
          hash: row.hash,
          iss: { did: row.iss },
          sub: { did: row.sub },
          type: row.type,
          jwt: row.jwt,
          data: row.data,
          time: row.time,
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
        ...messageSubjects.map(item => item.did),
        ...messageIssuers.map(item => item.did),
        ...vcIssuers.map(item => item.did),
        ...vcSubjects.map(item => item.did),
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
    return rows[0] && rows[0]['claim_value']
  }

  async interactionCount(did: string, viewer: Viewer) {
    const rows = await this.db.rows(
      `select count(*) as count from messages
    where (iss=$did and sub=$viewer) or (iss=$viewer and sub=$did)`,
      { $did: did, $viewer: viewer.did },
    )
    return rows[0] && rows[0]['count']
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

  async saveMessage(msg: SertoMessage) {
    await this.db.run(
      'INSERT INTO messages (hash, iss, sub, time, type, data, jwt ) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [msg.hash, msg.iss, msg.sub, msg.time, msg.type, msg.data, msg.jwt],
    )

    const vcs = await vcsInMessage(msg)

    for (const key in vcs) {
      if (vcs.hasOwnProperty(key)) {
        const verifiableClaimJWT = vcs[key]
        await this.saveVerifiableClaim(verifiableClaimJWT, msg.hash)
      }
    }

    return { jwt: msg.jwt, hash: msg.hash }
  }

  async saveVerifiableClaim(jwt: string, messageHash: string) {
    const decoded = await didJWT.decodeJWT(jwt) // todo change to verifyJWT
    const verifiableClaim = decoded.payload
    if (!messages.isValidVerifiableClaim(verifiableClaim)) {
      throw Error('Invalid verifiable claim')
    }
    const vcHash = blake.blake2bHex(jwt)

    await this.db.run(
      'INSERT INTO verifiable_claims (hash, parent_hash, iss, sub, nbf, raw ) VALUES (?, ?, ?, ?, ?, ?)',
      [
        vcHash,
        messageHash,
        verifiableClaim.iss,
        verifiableClaim.sub,
        verifiableClaim.nbf,
        jwt,
      ],
    )

    const claim = verifiableClaim.vc.credentialSubject

    for (const type in claim) {
      if (claim.hasOwnProperty(type)) {
        const value = claim[type]
        const isObj =
          typeof value === 'function' || (typeof value === 'object' && !!value)
        await this.db.run(
          'INSERT INTO verifiable_claims_fields (parent_hash, iss, sub, nbf, claim_type, claim_value, is_obj ) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            vcHash,
            verifiableClaim.iss,
            verifiableClaim.sub,
            verifiableClaim.nbf,
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
    let params = null
    let sql = null
    if (viewer.isAdmin) {
      params = [hash]
      sql = 'DELETE FROM messages where hasn=?'
    } else {
      const ownership = this.getOwnershipSqlParams(viewer)
      params = { ...ownership.params, $hash: hash }
      const accessControlSql = `(iss in (${ownership.sql}) or sub in (${ownership.sql}))`
      sql = `DELETE FROM messages where hash=$hash and ${accessControlSql}`
    }

    return this.db.run(sql, params)
  }
}

export default Api
