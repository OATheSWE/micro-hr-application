import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// AWS S3 configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET || ''

/**
 * Generate a signed URL for uploading an image to S3
 */
export async function generateUploadUrl(fileName: string, contentType: string): Promise<string> {
  const key = `employee-photos/${Date.now()}-${fileName}`
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  })

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // 1 hour
  
  return signedUrl
}

/**
 * Get the public URL for an uploaded image
 */
export function getImageUrl(key: string): string {
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`
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