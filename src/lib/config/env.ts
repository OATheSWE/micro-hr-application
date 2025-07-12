import { config } from 'dotenv'

// Load environment variables once at startup
config()

// Environment configuration
export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL || '',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || '',
  
  // AWS S3 (using non-AWS prefixed names for Amplify compatibility)
  ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID || process.env.ACCESS_KEY_ID || '',
  SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || process.env.SECRET_ACCESS_KEY || '',
  REGION: process.env.S3_REGION || process.env.REGION || 'eu-west-1',
  S3_BUCKET: process.env.S3_BUCKET_NAME || process.env.S3_BUCKET || '',
  
  // Next.js
  NEXTAUTH_URL: 'https://main.d2rui1j8gj3xa8.amplifyapp.com',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
}

// Validate required environment variables
export function validateEnv() {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'S3_ACCESS_KEY_ID', // Updated for Amplify
    'S3_SECRET_ACCESS_KEY', // Updated for Amplify
    'S3_BUCKET_NAME' // Updated for Amplify
  ]
  
  const missing = required.filter(key => !env[key as keyof typeof env])
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing)
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
  
  console.log('✅ All required environment variables are set')
}

// Export for use in other files
export default env 