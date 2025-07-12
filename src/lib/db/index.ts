import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Database connection configuration
const connectionString = 'postgresql://admin1:ogechi12@hrsystem.c3a0qmaasxx9.eu-west-1.rds.amazonaws.com:5432/hrsystem?sslmode=require'

// Create postgres client
const client = postgres(connectionString, {
  max: 1, // Use a single connection for development
  ssl: 'require', // Require SSL connection
})

// Create Drizzle database instance
export const db = drizzle(client, { schema })

// Export schema for migrations
export * from './schema' 