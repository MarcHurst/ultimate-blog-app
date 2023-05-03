import React from 'react'
import { IoReorderThreeOutline } from 'react-icons/io5'
import { BsBell } from 'react-icons/bs'
import { FiEdit } from 'react-icons/fi'
import { CiSearch } from 'react-icons/ci'
import { HiChevronDown } from 'react-icons/hi'

const HomePage = () => {
  return <>
    <div className='flex flex-col w-full h-screen'>
      <header className='flex h-20 w-full flex-row justify-around items-center bg-white border-b-[1px] border-gray-300'>
        <div>
          <IoReorderThreeOutline className='text-2xl text-gray-600' />
        </div>
        <div className='text-xl font-thin'>Ultimate Blog App</div>
        <div className='flex items-center space-x-4'>
          <div><BsBell className='text-2xl text-gray-600' /></div>
          <div>
            <div className='w-5 h-5 bg-gray-600 rounded-full' />
          </div>
          <div>
            <button className='flex transition hover:border-gray-900 hover:text-gray-900 rounded items-center space-x-3 px-4 py-2 border border-gray-200'>
              <div>Write</div>
              <div>
                <FiEdit />
              </div>
            </button>
          </div>
        </div>
        {/* This is the header area */}

      </header>
      <section className='grid grid-cols-12 place-items-center w-full h-full'>
        <main className='col-span-8 border-r border-gray-300 w-full h-full'>
          <div className='flex flex-col w-full space-y-4 py-10 px-24'>
            <div className='flex space-x-4 w-full items-center'>
              <label
                htmlFor='search'
                className='relative w-full border-gray-800 rounded-3xl border'
              >
                <div className='absolute left-1 h-full flex items-center'>
                  <CiSearch className='' />
                </div>
                <input type="text" name="search" id="search"
                  placeholder='Search...'
                  className='outline-none placeholder:text-gray-300 placeholder:text-xs w-full rounded-3xl text-sm py-1 px-4 pl-7 ' />
              </label>
              <div className='flex items-center w-full space-x-4 justify-end'>
                <div>
                  My topics:
                </div>
                <div className='flex space-x-2 items-center'>
                  {Array
                    .from({ length: 4 })
                    .map((_, i) => (
                      <div key={i} className='rounded-3xl bg-gray-200/50 px-4 py-3'>
                        tag {i}
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            <div className='w-full justify-between flex items-center border-b border-gray-300 pb-8'>
              <div>Articles</div>
              <div>
                <button className='flex space-x-2 items-center border-gray-800 rounded-3xl border px-4 py-1.5 font-semibold'>
                  <div>Following</div>
                  <div><HiChevronDown className='text-xl' /></div>
                </button>
              </div>
            </div>
          </div>
          <div className='w-full flex flex-col justify-center space-y-4 bg-red-400'>
            {
              Array
                .from({ length: 5 })
                .map((_, i) => (
                  <div key={i} className="grid grid-cols-12 w-full h-32">
                    <div className='col-span-8'>Content Part</div>
                    <div className='col-span-4'>
                      <div className="bg-gray-300 w-full h-full rounded-xl"></div>
                  </div>
                  </div>
                ))
            }
          </div>
        </main>
        <aside className='col-span-4'>This is used for side bar</aside>
      </section>
    </div>
  </>
}

export default HomePage

