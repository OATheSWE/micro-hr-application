import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth/jwt'
import { generateUploadUrl, getImageUrl } from '@/lib/aws/s3'

// POST /api/upload/image - Generate signed URL for image upload
export async function POST(request: NextRequest) {
  try {
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

    // Generate signed URL
    const signedUrl = await generateUploadUrl(fileName, contentType)
    
    // Generate the final image URL
    const key = `employee-photos/${Date.now()}-${fileName}`
    const imageUrl = getImageUrl(key)

    return NextResponse.json({
      signedUrl,
      imageUrl,
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