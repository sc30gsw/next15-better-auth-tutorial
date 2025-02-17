import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const testTable = sqliteTable('tests', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  email: text().notNull().unique(),
})
