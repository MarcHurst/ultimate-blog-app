import React from 'react'
import { z } from 'zod'

export const unsplashSearchRouteSchema = z.object({
  searchQuery: z.string().min(5, 'Too short'),
})

type UnsplashGalleryProps = {
  isUnsplashModalOpen: boolean
  setIsUnsplashModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  postId: string
  slug: string
}

const UnsplashGallery = ({
  isUnsplashModalOpen,
  setIsUnsplashModalOpen,
  postId,
  slug,
}: UnsplashGalleryProps) => {
  return <div>UnsplashGallery</div>
}

export default UnsplashGallery
