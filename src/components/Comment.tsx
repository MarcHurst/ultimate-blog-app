import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import React from 'react'
import { RouterOutputs } from '../utils/trpc'
import Avatar from './Avatar'

type CommentProps = RouterOutputs['comment']['getComments'][number]

const Comment = ({ ...comment }: CommentProps) => {
  return (
    <div className='flex w-full flex-col space-y-2 border-b border-b-gray-300 pb-4 last:border-none'>
      <div className='flex w-full items-center space-x-2'>
        {comment.user.image && (
          <Avatar src={comment.user.image} alt={comment.user.name ?? 'Unknown'} />
        )}
        <div>
          <div>
            {comment?.user?.name} &#8226;{' '}
            {dayjs(comment.createdAt).fromNow()}
          </div>
          <div>{comment.text}</div>
        </div>
      </div>
      <div className='text-sm text-gray-600'>{comment.text}</div>
    </div>
  )
}

export default Comment
