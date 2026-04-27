import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _db: any

function getDb() {
  if (!_db) {
    const pool = mysql.createPool(process.env.DATABASE_URL!)
    _db = drizzle(pool, { schema, mode: 'default' })
  }
  return _db as ReturnType<typeof drizzle<typeof schema>>
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_, prop) {
    return Reflect.get(getDb(), prop)
  },
})
