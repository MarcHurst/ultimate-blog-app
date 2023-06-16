import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import type { TAG } from './WriteFormModal'
const Tag = ({ ...tag }) => {
  const [selectedTags, setSelectedTags] = useState<TAG[]>([])

  return (
    <div
      key={tag.id}
      className='whitespace-nowrwap m-2 flex items-center justify-center space-x-2 rounded-2xl bg-gray-200/50 px-5 py-3'
    >
      <div>{tag.name}</div>
      <div
        onClick={() =>
          setSelectedTags((prev) =>
            prev.filter((currTag) => currTag.id !== tag.id)
          )
        }
        className='cursor-pointer'
      >
        <FaTimes />
      </div>
    </div>
  )
}

export default Tag
