import React from 'react'
import Image from 'next/image'

type AvatarProps = {
  src: string
  alt: string
}
;<div className='relative h-10 w-10 rounded-full bg-gray-400'></div>

const Avatar = ({ src, alt }: AvatarProps) => {
  return (
    <div className='relative h-10 w-10 rounded-full bg-gray-400'>
      <Image
        src={src}
        alt={alt}
        fill
        className='relative h-10 w-10 rounded-full bg-gray-400'
      />
    </div>
  )
}

export default Avatar
