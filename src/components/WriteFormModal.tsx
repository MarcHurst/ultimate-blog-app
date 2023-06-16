import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { GlobalContext } from '../contexts/GlobalContextProvider'
import Modal from './Modal'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { trpc } from '../utils/trpc'
import { toast } from 'react-hot-toast'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import TagForm from './TagForm'
import TagsAutocompletion from './TagsAutocompletion'
import { FaTimes } from 'react-icons/fa'

type WriteFormType = {
  title: string
  description: string
  text: string
}

export type TAG = {
  id: string
  name: string
}

export const writeFormSchema = z.object({
  title: z.string().min(20),
  description: z.string().min(60),
  text: z.string().min(100),
})

const WriteFormModal = () => {
  const { isWriteModalOpen, setIsWriteModalOpen } = useContext(GlobalContext)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    // control,
  } = useForm<WriteFormType>({
    resolver: zodResolver(writeFormSchema),
  })

  const postRoute = trpc.useContext().post

  const createPost = trpc.post.createPost.useMutation({
    onSuccess: () => {
      setIsWriteModalOpen(false)
      toast.success('Post created successfully')
      reset()
      postRoute.getPosts.invalidate()
    },
    onError: () => {
      setIsWriteModalOpen(false)
      toast.error('Error creating post')
    },
  })

  const [selectedTags, setSelectedTags] = useState<TAG[]>([])

  const onSubmit = (data: WriteFormType) => {
    setIsWriteModalOpen(false)
    createPost.mutate(
      selectedTags.length > 0 ? { ...data, tagsIds: selectedTags } : data
    )
  }

  const [isTagCreateModalOpen, setIsTagCreateModalOpen] = useState(false)

  const getTags = trpc.tag.getTags.useQuery()

  return (
    <Modal isOpen={isWriteModalOpen} onClose={() => setIsWriteModalOpen(false)}>
      {getTags.isSuccess && (
        <>
          <TagForm
            isOpen={isTagCreateModalOpen}
            onClose={() => setIsTagCreateModalOpen(false)}
          />
          <div className='my-4 flex w-full items-center space-x-4'>
            <div className='z-10 w-4/5'>
              <TagsAutocompletion
                tags={getTags.data}
                setSelectedTags={setSelectedTags}
                selectedTags={selectedTags}
              />
            </div>
            <button
              onClick={() => setIsTagCreateModalOpen(true)}
              className='space-x-3 whitespace-nowrap rounded border border-gray-200 px-4 py-2 text-sm transition hover:border-gray-900 hover:text-gray-900'
            >
              Create Tag
            </button>
          </div>
          <div className='my-4 flex w-full flex-wrap items-center'>
            {selectedTags.map((tag) => (
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
            ))}
          </div>
        </>
      )}
      <form
        onSubmit={handleSubmit((data) => {
          onSubmit(data)
        })}
        className='relative flex flex-col items-center justify-center space-y-4'
      >
        {createPost.isLoading && (
          <div className='absolute flex h-full w-full items-center justify-center'>
            <AiOutlineLoading3Quarters className='animate-spin' />
          </div>
        )}
        <input
          type='text'
          id='title'
          className='h-full w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-600'
          placeholder='Title'
          {...register('title')}
        />
        <p className='w-full pb-10 text-sm text-red-500'>
          {errors.title?.message}
        </p>
        <input
          type='text'
          id='shortDescription'
          className='h-full w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-600'
          placeholder='Short Description'
          {...register('description')}
        />
        <p className='w-full pb-10 text-sm text-red-500'>
          {errors.description?.message}
        </p>
        <textarea
          id='mainBody'
          cols={10}
          rows={10}
          className='h-full w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-600'
          placeholder='Main body'
          {...register('text')}
        />
        <p className='w-full pb-10 text-sm text-red-500'>
          {errors.text?.message}
        </p>
        <div className='flex w-full justify-end'>
          <button
            type='submit'
            className='flex items-center space-x-3 rounded border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900'
          >
            <div>Publish</div>
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default WriteFormModal
