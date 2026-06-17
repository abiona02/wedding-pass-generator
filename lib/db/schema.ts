import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core'

// ---- Better Auth tables (do not rename columns) ----

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// ---- EverPass app tables (scoped by userId, no FKs) ----

export const events = pgTable('events', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  coupleNames: text('coupleNames'),
  eventType: text('eventType').notNull().default('wedding'),
  eventDate: timestamp('eventDate'),
  venueName: text('venueName'),
  venueAddress: text('venueAddress'),
  description: text('description'),
  dressCode: text('dressCode'),
  accentColor: text('accentColor').notNull().default('#b08968'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const guests = pgTable('guests', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  eventId: text('eventId').notNull(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  seats: integer('seats').notNull().default(1),
  tableAssignment: text('tableAssignment'),
  rsvpStatus: text('rsvpStatus').notNull().default('pending'),
  passCode: text('passCode').notNull().unique(),
  checkedIn: boolean('checkedIn').notNull().default(false),
  checkedInAt: timestamp('checkedInAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export type Event = typeof events.$inferSelect
export type Guest = typeof guests.$inferSelect
