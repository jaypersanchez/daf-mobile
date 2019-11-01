export interface DbDriver {
  rows(sql: string, params: any[] | {} | null): Promise<any>
  run(sql: string, params: any[]): Promise<any>
}

export interface Migration {
  run(db: DbDriver, index: number): Promise<any>
}
