/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output configuration for Amplify
  output: 'standalone',
  
  // Environment variables for Amplify (using non-AWS prefixed names)
  env: {
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_REGION: process.env.S3_REGION,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
  },
  
  // Experimental features
  experimental: {
    serverComponentsExternalPackages: ['@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner'],
  },
  
  // Image optimization
  images: {
    domains: ['your-s3-bucket.s3.eu-west-1.amazonaws.com'], // Replace with your actual S3 bucket domain
    unoptimized: true, // For Amplify deployment
  },
}

export default nextConfig
