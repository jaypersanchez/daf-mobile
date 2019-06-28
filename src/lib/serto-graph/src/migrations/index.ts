import { initial } from './001.initial'
import { second } from './002.second'
import { DbDriver, Logger } from '../types'
import Log from '../../../Log'

const availableMigrations = [initial, second]

export const insertLastMigrationId = (db: DbDriver, id: Number) => {
  const timestamp = new Date().getTime()
  Log.info('Finished migration: ' + id, 'serto graph')
  return db.run('INSERT INTO migrations VALUES (?, ?)', [id, timestamp])
}

const runMigrations = (db: DbDriver) => {
  Log.info('Running migrations...', 'serto graph')

  return db
    .run(
      'CREATE TABLE IF NOT EXISTS migrations (migrationId TEXT, timestamp TEXT)',
      null,
    )
    .then(() =>
      db.rows(
        'SELECT * FROM migrations ORDER BY migrationId DESC LIMIT 1',
        null,
      ),
    )
    .then(rows => {
      let lastMigrationId = -1
      if (rows[0] && rows[0].migrationId) {
        Log.info(
          'Latest migrationId:' +
            rows[0].migrationId +
            ' finished at:' +
            rows[0].timestamp,
          'serto graph',
        )
        lastMigrationId = parseInt(rows[0].migrationId, 10)
      }

      const newMigrations = []

      for (let x = lastMigrationId + 1; x < availableMigrations.length; x++) {
        newMigrations.push({ migration: availableMigrations[x], index: x })
      }

      // Running migrations in a sequence
      return newMigrations
        .reduce(
          (promise, item) =>
            promise.then(result =>
              item.migration
                .run(db, item.index)
                .then(Array.prototype.concat.bind(result))
                .then(insertLastMigrationId(db, item.index)),
            ),
          Promise.resolve([]),
        )
        .then(() => Log.info('Migrations finished.', 'serto graph'))
    })
}

export default runMigrations
