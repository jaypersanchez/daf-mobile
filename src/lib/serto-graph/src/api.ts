import * as didJWT from 'did-jwt'
import * as blake from 'blakejs'
import { DbDriver, Viewer, Logger } from './types'
import runMigrations from './migrations'
import * as messages from './messages'

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
      sql = 'SELECT * FROM verifiable_claims order by iat desc'
      if (iss && !sub) {
        params = { $iss: iss }
        sql = 'SELECT * FROM verifiable_claims where iss=$iss order by iat desc'
      } else if (!iss && sub) {
        params = { $sub: sub }
        sql = 'SELECT * FROM verifiable_claims where sub=$sub order by iat desc'
      } else if (iss && sub) {
        params = { $iss: iss, $sub: sub }
        sql =
          'SELECT * FROM verifiable_claims where iss=$iss and sub=$sub order by iat desc'
      }
    } else {
      const ownership = this.getOwnershipSqlParams(viewer)
      params = ownership.params
      const accessControlSql = `inner join messages as m on vc.parent_id = m.id where (m.sub in (${
        ownership.sql
      }) or m.iss in (${ownership.sql}))`

      sql = `SELECT vc.* FROM verifiable_claims as vc ${accessControlSql} order by vc.iat desc`
      if (iss && !sub) {
        params[`$iss`] = iss
        sql = `SELECT vc.* FROM verifiable_claims as vc ${accessControlSql} and vc.iss=$iss order by iat desc`
      } else if (!iss && sub) {
        params[`$sub`] = sub
        sql = `SELECT vc.* FROM verifiable_claims as vc ${accessControlSql} and vc.sub=$sub order by iat desc`
      }
    }

    return this.db.rows(sql, params).then(rows =>
      rows.map(row => ({
        hash: row.id,
        parentHash: row.parent_id,
        iss: { did: row.iss },
        sub: { did: row.sub },
        raw: row.raw,
        iat: row.iat,
        exp: row.exp,
      })),
    )
  }

  claimsForMessageHash(hash: string) {
    return this.db
      .rows('SELECT * FROM verifiable_claims where parent_id=?', [hash])
      .then(rows =>
        rows.map(row => ({
          hash: row.id,
          parentHash: row.parent_id,
          iss: { did: row.iss },
          sub: { did: row.sub },
          raw: row.raw,
          iat: row.iat,
          exp: row.exp,
        })),
      )
  }

  claimsFieldsForClaimHash(hash: string) {
    return this.db
      .rows('SELECT * FROM verifiable_claims_fields where parent_id=?', [hash])
      .then(rows =>
        rows.map(row => ({
          hash: row.id,
          parentHash: row.parent_id,
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
      sql = 'SELECT * FROM messages order by iat desc'
      if (iss && !sub) {
        params = { $iss: iss }
        sql = 'SELECT * FROM messages where iss=$iss order by iat desc'
      } else if (!iss && sub) {
        params = { $sub: sub }
        sql = 'SELECT * FROM messages where sub=$sub order by iat desc'
      } else if (iss && sub) {
        params = { $iss: iss, $sub: sub }
        sql =
          'SELECT * FROM messages where iss=$iss or sub=$sub order by iat desc'
      }
    } else {
      const ownership = this.getOwnershipSqlParams(viewer)
      params = ownership.params
      const accessControlSql = `(iss in (${ownership.sql}) or sub in (${
        ownership.sql
      }))`
      sql = `SELECT * FROM messages where ${accessControlSql} order by iat desc`
      if (iss && !sub) {
        params[`$iss`] = iss
        sql = `SELECT * FROM messages where iss=$iss and ${accessControlSql} order by iat desc`
      } else if (!iss && sub) {
        params[`$sub`] = sub
        sql = `SELECT * FROM messages where sub=$sub and ${accessControlSql} order by iat desc`
      } else if (iss && sub) {
        params[`$iss`] = iss
        params[`$sub`] = sub
        sql = `SELECT * FROM messages where (iss=$iss or sub=$sub) and ${accessControlSql} order by iat desc`
      }
    }
    return this.db.rows(sql, params).then(rows =>
      rows.map(row => ({
        hash: row.id,
        iss: { did: row.iss },
        sub: { did: row.sub },
        type: row.type,
        raw: row.raw,
        iat: row.iat,
      })),
    )
  }

  findMessage(hash: string, viewer: Viewer) {
    let params = null
    let sql = null
    if (viewer.isAdmin) {
      params = [hash]
      sql = 'SELECT * FROM messages where id=?'
    } else {
      const ownership = this.getOwnershipSqlParams(viewer)
      params = { ...ownership.params, $hash: hash }
      const accessControlSql = `(iss in (${ownership.sql}) or sub in (${
        ownership.sql
      }))`
      sql = `SELECT * FROM messages where id=$hash and ${accessControlSql}`
    }

    return this.db
      .rows(sql, params)
      .then(rows =>
        rows.map(row => ({
          hash: row.id,
          iss: { did: row.iss },
          sub: { did: row.sub },
          type: row.type,
          raw: row.raw,
          iat: row.iat,
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
      'select distinct sub as did from messages',
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
    const firstName = await this.popularClaimForDid(did, 'firstName')
    const lastName = await this.popularClaimForDid(did, 'lastName')
    let shortId = firstName
    shortId = lastName ? `${firstName && firstName + ' '}${lastName}` : shortId
    shortId = !shortId ? `${did.slice(0, 15)}...${did.slice(-4)}` : shortId
    return shortId
  }

  async saveMessage(jwt: string) {
    const decoded = await didJWT.decodeJWT(jwt) // todo change to verifyJWT
    const message = decoded.payload
    if (!messages.isValidMessage(message)) {
      throw Error('Invalid message')
    }
    const hash = blake.blake2bHex(jwt)

    // Do we need to save _value? It can be derived from `raw` when needed.id
    await this.db.run(
      'INSERT INTO messages (id, iss, sub, iat, type, _value, raw, sourceType ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        hash,
        message.iss,
        message.sub,
        message.iat,
        message.type,
        JSON.stringify(message),
        jwt,
        'JWT',
      ],
    )

    if (message.vc && Array.isArray(message.vc)) {
      for (const key in message.vc) {
        if (message.vc.hasOwnProperty(key)) {
          const verifiableClaimJWT = message.vc[key]
          await this.saveVerifiableClaim(verifiableClaimJWT, hash)
        }
      }
    }

    return { jwt, hash }
  }

  async saveVerifiableClaim(input: string, messageHash: string) {
    let jwt = input
    if (jwt.slice(0, 6) === '/ipfs/') {
      const response = await fetch('https://cloudflare-ipfs.com' + input)
      jwt = await response.text()
    }
    const decoded = await didJWT.decodeJWT(jwt) // todo change to verifyJWT
    const verifiableClaim = decoded.payload
    if (!messages.isValidVerifiableClaim(verifiableClaim)) {
      throw Error('Invalid verifiable claim')
    }
    const vcHash = blake.blake2bHex(jwt)

    await this.db.run(
      'INSERT INTO verifiable_claims (id, parent_id, iss, sub, iat, raw ) VALUES (?, ?, ?, ?, ?, ?)',
      [
        vcHash,
        messageHash,
        verifiableClaim.iss,
        verifiableClaim.sub,
        verifiableClaim.iat,
        jwt,
      ],
    )

    const { claim } = verifiableClaim

    for (const type in claim) {
      if (claim.hasOwnProperty(type)) {
        const value = claim[type]
        const isObj =
          typeof value === 'function' || (typeof value === 'object' && !!value)
        await this.db.run(
          'INSERT INTO verifiable_claims_fields (parent_id, iss, sub, iat, claim_type, claim_value, is_obj ) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            vcHash,
            verifiableClaim.iss,
            verifiableClaim.sub,
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
    let params = null
    let sql = null
    if (viewer.isAdmin) {
      params = [hash]
      sql = 'DELETE FROM messages where id=?'
    } else {
      const ownership = this.getOwnershipSqlParams(viewer)
      params = { ...ownership.params, $hash: hash }
      const accessControlSql = `(iss in (${ownership.sql}) or sub in (${
        ownership.sql
      }))`
      sql = `DELETE FROM messages where id=$hash and ${accessControlSql}`
    }

    return this.db.run(sql, params)
  }
}

export default Api
