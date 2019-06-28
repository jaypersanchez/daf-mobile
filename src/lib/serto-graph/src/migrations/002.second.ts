import { DbDriver, Migration } from '../types'

export const second: Migration = {
  run: async (db: DbDriver) => {
    console.log('Creating indexes...')

    await db.run(
      `CREATE INDEX IF NOT EXISTS "messages_id" ON "messages" ("id");`,
      null,
    )
    await db.run(
      `CREATE INDEX IF NOT EXISTS "messages_parent_id" ON "messages" ("parent_id");`,
      null,
    )
    await db.run(
      `CREATE INDEX IF NOT EXISTS "messages_sub" ON "messages" ("sub");`,
      null,
    )
    await db.run(
      `CREATE INDEX IF NOT EXISTS "messages_iss" ON "messages" ("iss");`,
      null,
    )

    await db.run(
      `CREATE INDEX IF NOT EXISTS "verifiable_claims_parent_id" ON "verifiable_claims" ("parent_id");`,
      null,
    )
    await db.run(
      `CREATE INDEX IF NOT EXISTS "verifiable_claims_iss" ON "verifiable_claims" ("iss");`,
      null,
    )
    await db.run(
      `CREATE INDEX IF NOT EXISTS "verifiable_claims_sub" ON "verifiable_claims" ("sub");`,
      null,
    )

    await db.run(
      `CREATE INDEX IF NOT EXISTS "verifiable_claims_fields_parent_id" ON "verifiable_claims_fields" ("parent_id");`,
      null,
    )
    await db.run(
      `CREATE INDEX IF NOT EXISTS "verifiable_claims_fields_sub" ON "verifiable_claims_fields" ("sub");`,
      null,
    )
    await db.run(
      `CREATE INDEX IF NOT EXISTS "verifiable_claims_fields_iss" ON "verifiable_claims_fields" ("iss");`,
      null,
    )
    await db.run(
      `CREATE INDEX IF NOT EXISTS "verifiable_claims_fields_claim_type" ON "verifiable_claims_fields" ("claim_type");`,
      null,
    )
  },
}
