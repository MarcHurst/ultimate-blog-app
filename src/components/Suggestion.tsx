import React from 'react'

const Suggestion = ({ ...suggestion }) => {
  return (
    <div key={suggestion.id} className='flex flex-row items-center space-x-5'>
      <div className='h-10 w-10 flex-none rounded-full bg-gray-300'></div>
      <div>
        <div className='text-sm font-bold text-gray-900'>Someone</div>
        <div className='text-xs'>Username</div>
      </div>
      <div>
        <button
          className='flex items-center space-x-3 rounded border border-gray-400/50 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900'
          onClick={() => console.log('Suggestion button clicked')}
        >
          Follow
        </button>
      </div>
    </div>
  )
}

export default Suggestion
