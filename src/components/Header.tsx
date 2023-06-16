import React, { useContext } from 'react'
import { IoReorderThreeOutline } from 'react-icons/io5'
import { BsBell } from 'react-icons/bs'
import { FiEdit } from 'react-icons/fi'
import { signIn, signOut, useSession } from 'next-auth/react'
import { HiLogout } from 'react-icons/hi'
import Link from 'next/link'
import { GlobalContext } from '../contexts/GlobalContextProvider'

const Header = () => {
  const { status } = useSession()
  const { setIsWriteModalOpen } = useContext(GlobalContext)

  return (
    <header className='flex h-20 w-full flex-row justify-around items-center bg-white border-b-[1px] border-gray-300'>
      <div>
        <IoReorderThreeOutline className='text-2xl text-gray-600' />
      </div>
      <Link href={"/"} className='cursor-pointer select-none text-xl font-thin'>
        T3 Demo Test
      </Link>
      {
        status === 'authenticated' ? (
          <div className='flex items-center space-x-4'>
            <div>
              <BsBell className='text-2xl text-gray-600' />
            </div>
            <div>
              <div className='h-5 w-5 bg-gray-600 rounded-full' />
            </div>
            <div>
              <button
                onClick={() => setIsWriteModalOpen(true)}
                className='flex items-center space-x-3 rounded border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900'
              >
                <div>Write</div>
                <div>
                  <FiEdit />
                </div>
              </button>
            </div>
            <div>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-3 rounded border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900"
              >
                <div>Logout</div>
                <div>
                  <HiLogout />
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => signIn()}
              className='flex transition hover:border-gray-900 hover:text-gray-900 rounded items-center space-x-3 px-4 py-2 border border-gray-200'>
              Sign In
            </button>
          </div>
        )
      }
    </header>
  )
}

export default Header

