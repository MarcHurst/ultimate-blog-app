import React from 'react'
import { trpc } from '../utils/trpc'
import Bookmark from './Bookmark'
import Suggestion from './Suggestion'

const SideSection = () => {
  const readingList = trpc.post.readingList.useQuery()

  return (
    <aside className='col-span-4 flex h-full w-full flex-col space-y-4 p-6'>
      <div>
        <h3 className='my-6 text-lg font-semibold'>
          People you might be interested in
        </h3>
        {/* This is the people you might be interested in */}
        {/* Suggestions */}
        <div className='flex flex-col space-y-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Suggestion key={i} />
          ))}
        </div>
      </div>
      {/* Bookmarks */}
      <div>
        <h3 className='my-6 text-lg font-semibold'>Your reading list</h3>
        <div className='flex flex-col space-y-8'>
          {readingList.isSuccess &&
            readingList.data &&
            readingList.data?.length > 0 &&
            readingList.data?.map((bookmark) => (
              <Bookmark {...bookmark} key={bookmark.id} />
            ))}
        </div>
      </div>
      <div></div>
    </aside>
  )
}

export default SideSection
