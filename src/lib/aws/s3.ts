import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// AWS S3 configuration (hardcoded for testing)
const s3Client = new S3Client({
  region: 'eu-west-1',
  credentials: {
    accessKeyId: 'AKIA23WHTYZLAQPZSQF2',
    secretAccessKey: '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',
  },
})

const BUCKET_NAME = 'hope-hr-upload'

/**
 * Generate a signed URL for uploading an image to S3
 */
export async function generateUploadUrl(fileName: string, contentType: string, key?: string): Promise<string> {
  try {
    const fileKey = `employee-photos/${Date.now()}-${fileName}`
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      ContentType: contentType,
    })

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // 1 hour
    return signedUrl
  } catch (error) {
    console.error('Error generating upload URL:', error)
    throw error
  }
}

/**
 * Generate a signed URL for viewing an image from S3
 */
export async function generateViewUrl(key: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // 1 hour
    return signedUrl
  } catch (error) {
    console.error('Error generating view URL:', error)
    throw error
  }
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
  try {
    // Extract key from URL
    const urlParts = imageUrl.split('/')
    const key = urlParts.slice(3).join('/') // Remove https://bucket.s3.region.amazonaws.com/
    
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    await s3Client.send(command)
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

/**
 * Extract key from S3 URL
 */
export function extractKeyFromUrl(imageUrl: string): string {
  const urlParts = imageUrl.split('/')
  return urlParts.slice(3).join('/')
} 