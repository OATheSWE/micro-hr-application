import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://admin1:ogechi12@hrsystem.c3a0qmaasxx9.eu-west-1.rds.amazonaws.com:5432/hrsystem',
  },
}) 