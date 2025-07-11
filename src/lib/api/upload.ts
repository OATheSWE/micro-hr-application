import { api } from './client'

export interface UploadImageResponse {
  signedUrl: string
  imageUrl: string
  key: string
}

export interface UploadImageRequest {
  fileName: string
  contentType: string
}

// Upload API service
export const uploadApi = {
  // Generate signed URL for image upload
  generateUploadUrl: async (data: UploadImageRequest): Promise<UploadImageResponse> => {
    return api.post<UploadImageResponse>('/upload/image', data)
  },
} 