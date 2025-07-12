import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// AWS S3 configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'AKIA23WHTYZLAQPZSQF2',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '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',
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'hope-hr-upload'

// Debug: Log the bucket name value
console.log('AWS_S3_BUCKET value:', JSON.stringify(process.env.AWS_S3_BUCKET))
console.log('BUCKET_NAME variable:', JSON.stringify(BUCKET_NAME))
console.log('BUCKET_NAME length:', BUCKET_NAME.length)

/**
 * Generate a signed URL for uploading an image to S3
 */
export async function generateUploadUrl(fileName: string, contentType: string, key?: string): Promise<string> {
  const fileKey = key || `employee-photos/${Date.now()}-${fileName}`
  
  console.log('Creating PutObjectCommand with bucket:', JSON.stringify(BUCKET_NAME))
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    ContentType: contentType,
  })

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // 1 hour
  
  return signedUrl
}

/**
 * Generate a signed URL for viewing an image from S3
 */
export async function generateViewUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // 1 hour
  return signedUrl
}

/**
 * Get the public URL for an uploaded image (for private buckets, use generateViewUrl instead)
 */
export function getImageUrl(key: string): string {
  return `https://${BUCKET_NAME}.s3.eu-west-1.amazonaws.com/${key}`
}

/**
 * Delete an image from S3
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  // Extract key from URL
  const urlParts = imageUrl.split('/')
  const key = urlParts.slice(3).join('/') // Remove https://bucket.s3.region.amazonaws.com/
  
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  await s3Client.send(command)
}

/**
 * Extract key from S3 URL
 */
export function extractKeyFromUrl(imageUrl: string): string {
  const urlParts = imageUrl.split('/')
  return urlParts.slice(3).join('/')
} 