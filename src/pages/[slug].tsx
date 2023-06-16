import { useRouter } from 'next/router'
import React, { Fragment, useCallback, useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import MainLayout from '../layouts/MainLayout'
import { trpc } from '../utils/trpc'
import { BsChat } from 'react-icons/bs'
import { FcLike, FcLikePlaceholder } from 'react-icons/fc'
import CommentSidebar from '../components/CommentSidebar'
import { useSession } from 'next-auth/react'

const PostPage = () => {

  const router = useRouter()

  const postRoute = trpc.useContext().post
  const { status } = useSession()

  const invalidateCurrentPostPage = useCallback(() => {
    postRoute.getPost.invalidate({ slug: router.query.slug as string })
  }, [postRoute])

  const getPost = trpc.post.getPost.useQuery(
    {
      slug: router.query.slug as string,
    },
    {
      enabled: Boolean(router.query.slug),
    }
  )

  const likePost = trpc.post.likePost.useMutation({
    onSuccess: () => {
      invalidateCurrentPostPage()
    },
  })

  const dislikePost = trpc.post.dislikePost.useMutation({
    onSuccess: () => {
      invalidateCurrentPostPage()
    },
  })

  const [showCommentSidebar, setshowCommentSidebar] = useState(false)

  return (
    <MainLayout>
      {getPost?.data?.id && (
        <CommentSidebar
          showCommentSidebar={showCommentSidebar}
          setshowCommentSidebar={setshowCommentSidebar}
          postId={getPost.data?.id}
        />
      )}
      {getPost.isLoading && <LoadingSpinner />}
      {getPost.isSuccess && status === 'authenticated' && (
        <div className='fixed bottom-10 flex w-full justify-center'>
          <div className='group flex items-center justify-center space-x-4 rounded-full border border-gray-400 bg-white px-8 py-4 shadow-xl transition duration-300 hover:border-gray-900'>
            <div className='border-r pr-4 transition duration-300 group-hover:border-gray-900'>
              {getPost.data?.likes && getPost.data?.likes.length > 0 ? (
                <FcLike
                  onClick={() =>
                    getPost.data?.id &&
                    dislikePost.mutate({
                      postId: getPost.data?.id,
                    })
                  }
                  className='cursor-pointer text-2xl'
                />
              ) : (
                <FcLikePlaceholder
                  onClick={() =>
                    getPost.data?.id &&
                    likePost.mutate({
                      postId: getPost.data?.id,
                    })
                  }
                  className='cursor-pointer text-2xl'
                />
              )}
            </div>
            <div>
              <BsChat
                className='cursor-pointer text-base'
                onClick={() => {
                  setshowCommentSidebar(!showCommentSidebar)
                }}
              />
            </div>
          </div>
        </div>
      )}
      <div className='flex h-full w-full items-center justify-center p-10'>
        <div className='w-full max-w-screen-lg flex-col space-y-6'>
          <div className='relative h-[60vh] w-full rounded-xl bg-gray-300 shadow-lg'>
            {/* Here we will render our image */}
            <div className='absolute flex h-full w-full items-center justify-center'>
              <div className='rounded-xl bg-black bg-opacity-50 p-4 text-3xl text-white'>
                {getPost.data?.title}
              </div>
            </div>
          </div>
          <div className='border-l-4 border-gray-800 pl-6'>
            {getPost.data?.description}
          </div>
          <div>{getPost.data?.text}</div>
          <div>This post has the following tags:</div>
          <ul>
            {getPost.data?.tags?.map((tag) => (
              <li key={tag.id}>{tag.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </MainLayout>
  )
}

export default PostPage
