import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

const LoadingSpinner = () => {
  return (
    <div className='w-full flex flex-col justify-center items-center space-x-4'>
      <div>
        <AiOutlineLoading3Quarters className='animate-spin' />
      </div>
      <div>Loading...</div>
    </div>
  )
}

export default LoadingSpinner

