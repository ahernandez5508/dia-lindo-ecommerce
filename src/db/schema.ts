import {
  bigint,
  boolean,
  datetime,
  decimal,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core'

export const adminUsers = mysqlTable('admin_users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
})

export const categories = mysqlTable('categories', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const products = mysqlTable('products', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: int('stock').notNull().default(0),
  categoryId: int('category_id').references(() => categories.id),
  images: text('images'), // JSON array of URLs
  active: boolean('active').notNull().default(true),
  customizable: boolean('customizable').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
})

export const orders = mysqlTable('orders', {
  id: int('id').autoincrement().primaryKey(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 50 }),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  paymentMethod: varchar('payment_method', { length: 20 }).notNull().default('transferencia'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  notes: text('notes'),
  mpPreferenceId: varchar('mp_preference_id', { length: 255 }),
  mpPaymentId: varchar('mp_payment_id', { length: 255 }),
  trackingToken: varchar('tracking_token', { length: 36 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
})

export const orderItems = mysqlTable('order_items', {
  id: int('id').autoincrement().primaryKey(),
  orderId: int('order_id')
    .notNull()
    .references(() => orders.id),
  productId: int('product_id').references(() => products.id),
  productName: varchar('product_name', { length: 255 }).notNull(),
  quantity: int('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
})

// Auth.js sessions (requerido por @auth/drizzle-adapter)
export const sessions = mysqlTable('sessions', {
  sessionToken: varchar('session_token', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => adminUsers.id, { onDelete: 'cascade' }),
  expires: datetime('expires').notNull(),
})
