import { relations, sql } from 'drizzle-orm'
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: int('email_verified', { mode: 'boolean' }).notNull(),
  image: text('image'),
  createdAt: int('created_at', { mode: 'timestamp' })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: int('updated_at', { mode: 'timestamp' })
    .$onUpdate(() => new Date())
    .notNull(),
  twoFactorEnabled: int('two_factor_enabled', { mode: 'boolean' }),
})

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: int('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: int('created_at', { mode: 'timestamp' })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: int('updated_at', { mode: 'timestamp' })
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: int('access_token_expires_at', {
    mode: 'timestamp',
  }),
  refreshTokenExpiresAt: int('refresh_token_expires_at', {
    mode: 'timestamp',
  }),
  scope: text('scope'),
  password: text('password'),
  createdAt: int('created_at', { mode: 'timestamp' })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: int('updated_at', { mode: 'timestamp' })
    .$onUpdate(() => new Date())
    .notNull(),
})

export const verifications = sqliteTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: int('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: int('created_at', { mode: 'timestamp' })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: int('updated_at', { mode: 'timestamp' })
    .$onUpdate(() => new Date())
    .notNull(),
})

export const twoFactors = sqliteTable('two_factors', {
  id: text('id').primaryKey(),
  secret: text('secret').notNull(),
  backupCodes: text('backup_codes').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})

export const passkeys = sqliteTable('passkeys', {
  id: text('id').primaryKey(),
  name: text('name'),
  publicKey: text('public_key').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  credentialID: text('credential_i_d').notNull(),
  counter: int('counter').notNull(),
  deviceType: text('device_type').notNull(),
  backedUp: int('backed_up', { mode: 'boolean' }).notNull(),
  transports: text('transports'),
  createdAt: int('created_at', { mode: 'timestamp' }),
})

// 🛠 users テーブルのリレーション定義
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  twoFactors: many(twoFactors),
}))

// 🛠 accounts テーブルのリレーション定義
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

// 🛠 twoFactors テーブルのリレーション定義
export const twoFactorsRelations = relations(twoFactors, ({ one }) => ({
  user: one(users, {
    fields: [twoFactors.userId],
    references: [users.id],
  }),
}))
