import { DbDriver, Migration } from '../types'

export const second: Migration = {
  run: async (db: DbDriver) => {
    console.log('Creating indexes...')

    await db.run(
      `CREATE INDEX IF NOT EXISTS "messages_hash" ON "messages" ("hash");`,
      [],
    )
    await db.run(
      `CREATE INDEX IF NOT EXISTS "messages_parent_hash" ON "messages" ("parent_hash");`,
      [],
    )
    await db.run(
      `CREATE INDEX IF NOT EXISTS "messages_sub" ON "messages" ("sub");`,
      [],
    )
    await db.run(
      `CREATE INDEX IF NOT EXISTS "messages_iss" ON "messages" ("iss");`,
      [],
    )

    await db.run(
      `CREATE INDEX IF NOT EXISTS "verifiable_claims_parent_hash" ON "verifiable_claims" ("parent_hash");`,
      [],
    )
    await db.run(
      `CREATE INDEX IF NOT EXISTS "verifiable_claims_iss" ON "verifiable_claims" ("iss");`,
      [],
    )
    await db.run(
      `CREATE INDEX IF NOT EXISTS "verifiable_claims_sub" ON "verifiable_claims" ("sub");`,
      [],
    )

    await db.run(
      `CREATE INDEX IF NOT EXISTS "verifiable_claims_fields_parent_hash" ON "verifiable_claims_fields" ("parent_hash");`,
      [],
    )
    await db.run(
      `CREATE INDEX IF NOT EXISTS "verifiable_claims_fields_sub" ON "verifiable_claims_fields" ("sub");`,
      [],
    )
    await db.run(
      `CREATE INDEX IF NOT EXISTS "verifiable_claims_fields_iss" ON "verifiable_claims_fields" ("iss");`,
      [],
    )
    await db.run(
      `CREATE INDEX IF NOT EXISTS "verifiable_claims_fields_claim_type" ON "verifiable_claims_fields" ("claim_type");`,
      [],
    )
  },
}
