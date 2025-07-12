import { pgTable, unique, serial, varchar, integer, text, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const employees = pgTable("employees", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	position: varchar({ length: 255 }).notNull(),
	department: varchar({ length: 255 }).notNull(),
	salary: integer().notNull(),
	imageUrl: text("image_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("employees_email_unique").on(table.email),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	role: varchar({ length: 50 }).default('employee').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);
