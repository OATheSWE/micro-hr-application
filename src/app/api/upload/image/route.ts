import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth/jwt'
import { generateUploadUrl } from '@/lib/aws/s3'
import { config } from 'dotenv'

// Load environment variables
config()

// Debug: Log environment variables at the top
console.log('=== UPLOAD API DEBUG ===')
console.log('S3_BUCKET:', JSON.stringify(process.env.S3_BUCKET))
console.log('REGION:', JSON.stringify(process.env.REGION))
console.log('ACCESS_KEY_ID:', process.env.ACCESS_KEY_ID ? 'SET' : 'NOT_SET')
console.log('SECRET_ACCESS_KEY:', process.env.SECRET_ACCESS_KEY ? 'SET' : 'NOT_SET')
console.log('========================')

// POST /api/upload/image - Generate signed URL for image upload
export async function POST(request: NextRequest) {
  try {
    console.log('=== UPLOAD API CALLED ===')
    
    // Check authentication
    const userData = getUserFromRequest(request.headers)
    if (!userData) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Allow both admin and employee roles for image upload
    if (userData.role !== 'admin' && userData.role !== 'employee') {
      return NextResponse.json(
        { message: 'Access denied. Admin or employee role required.' },
        { status: 403 }
      )
    }

    const { fileName, contentType } = await request.json()

    // Validate input
    if (!fileName || !contentType) {
      return NextResponse.json(
        { message: 'File name and content type are required' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { message: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      )
    }

    console.log('About to call generateUploadUrl...')
    
    // Generate the key first (this ensures same timestamp)
    const key = `employee-photos/${Date.now()}-${fileName}`
    
    // Generate signed URL with the same key
    const signedUrl = await generateUploadUrl(fileName, contentType, key)
    
    // Return the exact URL that the file will have after upload
    const objectUrl = `https://hope-hr-upload.s3.eu-west-1.amazonaws.com/${key.replace(/ /g, '+')}`

    return NextResponse.json({
      signedUrl,
      imageUrl: objectUrl, // This is the exact URL the file will have
      key,
    })
  } catch (error) {
    console.error('Generate upload URL error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 