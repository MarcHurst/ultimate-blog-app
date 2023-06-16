import React from 'react'
import { CiSearch } from 'react-icons/ci'
import { HiChevronDown } from 'react-icons/hi'
import { trpc } from '../utils/trpc'
import LoadingSpinner from './LoadingSpinner'
import Post from './Post'

const MainSection = () => {
  const getPosts = trpc.post.getPosts.useQuery()
  const getTags = trpc.tag.getUserTags.useQuery()

  return (
    <main className='col-span-8 border-r border-gray-300 px-24'>
      <div className='flex w-full flex-col space-y-4 px-24 py-10'>
        <div className='flex w-full items-center space-x-4'>
          <label
            htmlFor='search'
            className='relative w-full rounded-3xl border border-gray-800'
          >
            <div className='absolute left-1 flex h-full items-center'>
              <CiSearch className='' />
            </div>
            <input
              type='text'
              name='search'
              id='search'
              placeholder='Search...'
              className='w-full rounded-3xl px-4 py-1 pl-7 text-sm outline-none placeholder:text-xs placeholder:text-gray-300 '
            />
          </label>
          <div className='flex w-full items-center justify-end space-x-4'>
            <div className='flex items-center space-x-2'>
              {getTags.isSuccess &&
                getTags.data?.map((tag) => (
                  <div
                    key={tag.id}
                    className='rounded-3xl bg-gray-200/50 px-4 py-3'
                  >
                    tag {tag.name}
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className='flex w-full items-center justify-between border-b border-gray-300 pb-8'>
          <div>Articles</div>
          <div>
            <button className='flex items-center space-x-2 rounded-3xl border border-gray-800 px-4 py-1.5 font-semibold'>
              <div>Following</div>
              <div>
                <HiChevronDown className='text-xl' />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className='flex w-full flex-col justify-center space-y-8'>
        {getPosts.isLoading && <LoadingSpinner />}
        {getPosts.isSuccess &&
          getPosts.data &&
          getPosts.data?.map((post) => <Post {...post} key={post.id} />)}
      </div>
    </main>
  )
}

export default MainSection
