import React, { Fragment } from 'react'
import { Transition, Dialog } from '@headlessui/react'
import { HiXMark } from 'react-icons/hi2'
import Comment from './Comment'
import { trpc } from '../utils/trpc'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

type CommentSidebarProps = {
  showCommentSidebar: boolean
  setshowCommentSidebar: React.Dispatch<React.SetStateAction<boolean>>
  postId: string
}

type CommentFormType = { text: string }

export const commentFormSchema = z.object({
  text: z.string().min(3),
})

const CommentSidebar = ({
  showCommentSidebar,
  setshowCommentSidebar,
  postId,
}: CommentSidebarProps) => {
  const getComments = trpc.comment.getComments.useQuery({
    postId,
  })

  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<CommentFormType>({
    resolver: zodResolver(commentFormSchema),
  })

  const commentRoute = trpc.useContext().comment

  const createComment = trpc.comment.createComment.useMutation({
    onSuccess: () => {
      toast.success('Comment created successfully 🥳')
      commentRoute.getComments.invalidate({ postId })
      reset()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <Transition.Root
      show={showCommentSidebar}
      as={Fragment}
      // enter="transition-opacity duration-75"
      // enterFrom="opacity-0"
      // enterTo="opacity-100"
      // leave="transition-opacity duration-150"
      // leaveFrom="opacity-100"
      // leaveTo="opacity-0"
    >
      <Dialog as='div' onClose={() => setshowCommentSidebar(false)}>
        <div className='fixed right-0 top-0'>
          <Transition.Child
            enter='transition duration-1000'
            leave='transition duration-500'
            enterFrom='translate-x-full'
            enterTo='translate-x-0'
            leaveFrom='translate-x-0'
            leaveTo='translate-x-full'
          >
            <Dialog.Panel className='relative h-screen w-full bg-white shadow-md sm:w-[600px]'>
              <div className='flex h-full w-full flex-col overflow-scroll px-6'>
                <div className='mb-5 mt-10 flex items-center justify-between px-6 text-xl'>
                  <h2 className='font-medium'>
                    Comments (
                    {getComments.isSuccess ? getComments?.data?.length : '0'})
                  </h2>
                  <div>
                    <HiXMark
                      className='cursor-pointer'
                      strokeWidth={'1px'}
                      onClick={() => setshowCommentSidebar(false)}
                    />
                  </div>
                </div>
                <div>
                  <form
                    onSubmit={handleSubmit((data) => {
                      createComment.mutate({
                        ...data,
                        postId,
                      })
                    })}
                    className='my-6 flex flex-col items-end space-y-5'
                  >
                    <textarea
                      id='comment'
                      rows={3}
                      className='w-full rounded-xl border border-gray-300 p-4 shadow-lg outline-none focus:border-gray-600'
                      placeholder='What are your thoughts?'
                      {...register('text')}
                    />
                    {isValid && (
                      <button
                        type='submit'
                        className='flex items-center space-x-3 rounded border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900'
                      >
                        <div>Comment</div>
                      </button>
                    )}
                  </form>
                  <div className='flex flex-col items-center justify-center space-y-6'>
                    {/* Comments */}
                    {getComments.isSuccess &&
                      getComments.data &&
                      getComments.data?.map((comment) => (
                        <Comment {...comment} key={comment.id} />
                      ))}
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default CommentSidebar
