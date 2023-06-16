import React, { useCallback, useState } from 'react'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { CiBookmarkPlus, CiBookmarkCheck } from 'react-icons/ci'

import { trpc } from '../utils/trpc'
import type { RouterOutputs } from '../utils/trpc'
import Avatar from './Avatar'

type PostProps = RouterOutputs['post']['getPosts'][number]

const Post = ({ ...post }: PostProps) => {
  const [isBookmarked, setisBookmarked] = useState(
    Boolean(post.bookmarks.length)
  )

  const bookmarkPost = trpc.post.bookmarkPost.useMutation({
    onSuccess: () => {
      setisBookmarked(true)
    },
  })

  const unbookmarkPost = trpc.post.unbookmarkPost.useMutation({
    onSuccess: () => {
      setisBookmarked(false)
    },
  })

  return (
    <div
      className='flex flex-col space-y-4 border-b border-gray-300 pb-8 last:border-none'
      key={post.id}
    >
      <Link
        href={`/user/${post.author.username}`}
        className='group flex w-full cursor-pointer items-center space-x-2'
      >
        <div className='relative h-10 w-10 rounded-full bg-gray-400'>
          {post.author.image && (
            <Avatar src={post.author.image} alt={post.author.name ?? ''} />
          )}
        </div>
        <div>
          <p className='font-semibold'>
            <span className='decoration-indigo-600 group-hover:underline'>
              {post.author.name}
            </span>{' '}
            &#8226;
            <span className='mx-1'>
              {dayjs(post.createdAt).format('YYYY-MM-DD')}
            </span>
          </p>
          <p className='text-sm'>!!User Title!!</p>
        </div>
      </Link>
      <Link
        href={`/${post.slug}`}
        className='group grid h-44 w-full grid-cols-12 gap-4 overflow-hidden'
      >
        <div className='col-span-8 flex h-full w-full flex-col space-y-4'>
          <p className='text-2xl font-bold text-gray-800 decoration-purple-600 group-hover:underline'>
            {post.title}
          </p>
          <p className='h-full w-full max-w-sm truncate break-words text-sm text-gray-500'>
            {post.description}
          </p>
        </div>
        <div className='col-span-4'>
          <div className='h-full w-full transform rounded-xl bg-gray-300 transition duration-300 hover:scale-105 hover:shadow-xl'>
            {/* Featured image goes here */}
          </div>
        </div>
      </Link>
      <div>
        <div className='flex w-full items-center justify-between space-x-4'>
          <div className='flex items-center space-x-2'>
            {post.tags &&
              post.tags.map((tag) => (
                <div
                  key={tag.id}
                  onClick={() => (window.location.href = `/tag/${tag.name}`)}
                  className='rounded-2xl bg-gray-200/50 px-5 py-3'
                >
                  {tag.name}
                </div>
              ))}
          </div>
          <div>
            {post.bookmarks && isBookmarked ? (
              <CiBookmarkCheck
                className='cursor-pointer text-3xl text-indigo-600'
                onClick={() => {
                  unbookmarkPost.mutate({
                    postId: post.id,
                  })
                }}
              />
            ) : (
              <CiBookmarkPlus
                className='text-3xl'
                onClick={() => {
                  bookmarkPost.mutate({
                    postId: post.id,
                  })
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
