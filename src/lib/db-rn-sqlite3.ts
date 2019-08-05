import { openDatabase } from 'react-native-sqlite-storage'
import { Types } from './serto-graph'

export class RnSqlite implements Types.DbDriver {
  private db: any

  initialize(): Promise<any> {
    let setDb = (db: any) => {
      this.db = db
    }
    setDb = setDb.bind(this)

    return new Promise((resolve, reject) => {
      const db = openDatabase(
        { name: 'test', location: 'default' },
        () => {
          setDb(db)
          resolve()
        },
        reject,
      )
    })
  }

  run(sql: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx: any) => {
        tx.executeSql(sql, params || [], (t: any, result: any) => {
          resolve()
        })
      }, reject)
    })
  }

  rows(sql: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx: any) => {
        tx.executeSql(sql, params || [], (t: any, result: any) => {
          resolve(result.rows.raw())
        })
      }, reject)
    })
  }
}
