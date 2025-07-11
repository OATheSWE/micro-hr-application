import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Database connection configuration
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:ogechi12@localhost:5432/hr-system'

// Create postgres client
const client = postgres(connectionString, {
  max: 1, // Use a single connection for development
})

// Create Drizzle database instance
export const db = drizzle(client, { schema })

// Export schema for migrations
export * from './schema' 