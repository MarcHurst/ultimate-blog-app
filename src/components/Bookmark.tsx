import Link from 'next/link'
import React from 'react'
import type { RouterOutputs } from '../utils/trpc'
import dayjs from 'dayjs'
import Avatar from './Avatar'

type BookmarkProps = RouterOutputs['post']['readingList'][number]

const Bookmark = ({ ...bookmark }: BookmarkProps) => {
  return (
    <Link
      href={`/${bookmark.post.slug}`}
      key={bookmark.id}
      className='group flex items-center space-x-6'
    >
      <div className='aspect-square h-full w-2/5 rounded-xl bg-gray-300'></div>
      <div className='flex w-3/5 flex-col space-y-2'>
        <div className='text-lg font-semibold decoration-indigo-600 group-hover:underline'>
          {bookmark.post.title}
        </div>
        <div className='truncate'>{bookmark.post.description}</div>
        <div className='flex w-full items-center space-x-4'>
          {bookmark.post.author.image && bookmark.post.author.name ? (
            <Avatar
              src={bookmark.post.author.image}
              alt={bookmark.post.author.name}
            />
          ) : (
            <div className='h-8 w-8 rounded-full bg-gray-300'></div>
          )}
          <div>{bookmark.post.author.name} &#x2022;</div>
          <div>
            {dayjs(bookmark.post.createdAt).format('YYYY-MM-DD @ HH:mm')}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Bookmark
