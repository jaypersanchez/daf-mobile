import { DbDriver, Migration } from '../types'

export const initial: Migration = {
  run: async (db: DbDriver) => {
    console.log('Creating initial DB schema...')
    await db.run(
      `CREATE TABLE IF NOT EXISTS messages (
      hash TEXT,
      parent_hash TEXT,
      iss TEXT,
      sub TEXT,
      type TEXT,
      data TEXT,
      time NUMERIC,
      jwt TEXT,
      internal NUMERIC NOT NULL default 1
    );`,
      [],
    )

    await db.run(
      `CREATE TABLE IF NOT EXISTS verifiable_claims (
      hash TEXT,
      parent_hash TEXT,
      iss TEXT,
      aud TEXT,
      sub TEXT,
      nbf NUMERIC,
      raw TEXT,
      internal NUMERIC NOT NULL default 1
    );`,
      [],
    )

    await db.run(
      `CREATE TABLE IF NOT EXISTS verifiable_claims_fields (
      parent_hash INTEGER,
      iss TEXT, sub TEXT,
      nbf NUMERIC,
      claim_type TEXT,
      claim_value TEXT,
      is_obj NUMERIC NOT NULL default 0
    );`,
      [],
    )

    await db.run(
      `CREATE TRIGGER IF NOT EXISTS delete_messages BEFORE DELETE ON "messages" BEGIN
      DELETE FROM verifiable_claims where parent_hash = old.hash;
    END;`,
      [],
    )

    await db.run(
      `CREATE TRIGGER IF NOT EXISTS delete_verifiable_claims BEFORE DELETE ON "verifiable_claims" BEGIN
      DELETE FROM verifiable_claims_fields where parent_hash = old.hash;
    END;`,
      [],
    )
  },
}
