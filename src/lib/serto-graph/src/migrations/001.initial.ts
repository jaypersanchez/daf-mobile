import { DbDriver, Migration } from '../types'

export const initial: Migration = {
  run: async (db: DbDriver) => {
    console.log('Creating initial DB schema...')
    await db.run(
      `CREATE TABLE IF NOT EXISTS messages (
      id TEXT,
      parent_id TEXT,
      iss TEXT,
      sub TEXT,
      type TEXT,
      data TEXT,
      time NUMERIC,
      jwt TEXT,
      internal NUMERIC NOT NULL default 1
    );`,
      null,
    )

    await db.run(
      `CREATE TABLE IF NOT EXISTS verifiable_claims (
      id TEXT,
      parent_id TEXT,
      iss TEXT,
      aud TEXT,
      sub TEXT,
      nbf NUMERIC,
      raw TEXT,
      internal NUMERIC NOT NULL default 1
    );`,
      null,
    )

    await db.run(
      `CREATE TABLE IF NOT EXISTS verifiable_claims_fields (
      parent_id INTEGER,
      iss TEXT, sub TEXT,
      nbf NUMERIC,
      claim_type TEXT,
      claim_value TEXT,
      is_obj NUMERIC NOT NULL default 0
    );`,
      null,
    )

    await db.run(
      `CREATE TRIGGER IF NOT EXISTS delete_messages BEFORE DELETE ON "messages" BEGIN
      DELETE FROM verifiable_claims where parent_id = old.id;
    END;`,
      null,
    )

    await db.run(
      `CREATE TRIGGER IF NOT EXISTS delete_verifiable_claims BEFORE DELETE ON "verifiable_claims" BEGIN
      DELETE FROM verifiable_claims_fields where parent_id = old.id;
    END;`,
      null,
    )
  },
}
