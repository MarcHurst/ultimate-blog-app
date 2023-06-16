import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import MainLayout from '../../layouts/MainLayout'
import { trpc } from '../../utils/trpc'
import Post from '../../components/Post'
import Modal from '../../components/Modal'
import { SlShareAlt } from 'react-icons/sl'
import { BiEdit } from 'react-icons/bi'
import Link from 'next/link'

const UserProfilePage = () => {
  const router = useRouter()

  const currentUser = useSession()

  const userRoute = trpc.useContext().user

  const [isFollowModalOpen, setisFollowModalOpen] = useState({
    isOpen: false,
    modalType: 'followers',
  })

  const userProfile = trpc.user.getUserProfile.useQuery(
    //Query to use
    {
      username: router.query.username as string,
    },
    //Conditions to use the query
    {
      enabled: !!router.query.username,
    }
  )

  const userPosts = trpc.user.getUserPosts.useQuery(
    //Query to use
    {
      username: router.query.username as string,
    },
    //Conditions to use the query
    {
      enabled: !!router.query.username,
    }
  )

  const followers = trpc.user.getAllFollowers.useQuery(
    {
      userId: userProfile?.data?.id as string,
    },
    {
      enabled: Boolean(userProfile?.data?.id),
    }
  )

  const following = trpc.user.getAllFollowing.useQuery(
    {
      userId: userProfile?.data?.id as string,
    },
    {
      enabled: Boolean(userProfile?.data?.id),
    }
  )

  const followUser = trpc.user.followUser.useMutation({
    onSuccess: () => {
      userRoute.getAllFollowers.invalidate()
      userRoute.getAllFollowing.invalidate()
      userRoute.getUserProfile.invalidate()
      toast.success('User followed')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const unfollowUser = trpc.user.unfollowUser.useMutation({
    onSuccess: () => {
      userRoute.getAllFollowers.invalidate()
      userRoute.getAllFollowing.invalidate()
      userRoute.getUserProfile.invalidate()
      toast.success('User unfollowed')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <MainLayout>
      {followers.isSuccess && following.isSuccess && (
        <Modal
          isOpen={isFollowModalOpen.isOpen}
          onClose={() =>
            setisFollowModalOpen((pre) => ({ ...pre, isOpen: false }))
          }
        >
          <div className='flex w-full flex-col items-center justify-center space-y-4'>
            {isFollowModalOpen.modalType === 'followers' && (
              <div className='flex w-full flex-col justify-center'>
                <h3 className='my-2 p-2 text-xl'>Followers</h3>
                {followers.data?.followedBy.map((user) => (
                  <div
                    key={user.id}
                    className='my-1 flex w-full items-center justify-between rounded-xl bg-gray-200 px-4 py-2'
                  >
                    <div>
                      <Link href={`/user/${user.username}`}>{user.name}</Link>
                    </div>

                    <button
                      onClick={() =>
                        user.followedBy.length > 0
                          ? unfollowUser.mutate({ followingUserId: user.id })
                          : followUser.mutate({
                              followingUserId: user.id,
                            })
                      }
                      className='flex items-center space-x-3 rounded border border-gray-400/50 bg-white px-4 py-2 transition hover:border-gray-900 hover:text-gray-900'
                    >
                      {user.followedBy.length > 0 ? 'Unfollow' : 'Follow'}
                    </button>
                  </div>
                ))}
              </div>
            )}
            {isFollowModalOpen.modalType === 'following' && (
              <div className='flex w-full flex-col justify-center'>
                <h3 className='my-2 p-2 text-xl'>Followers</h3>
                {following.data?.followings.map((user) => (
                  <div
                    key={user.id}
                    className='my-1 flex w-full items-center justify-between rounded-xl bg-gray-200 px-4 py-2'
                  >
                    <div>
                      <Link href={`/user/${user.username}`}>{user.name}</Link>
                    </div>

                    <button
                      onClick={() =>
                        unfollowUser.mutate({
                          followingUserId: user.id,
                        })
                      }
                      className='flex items-center space-x-3 rounded border border-gray-400/50 bg-white px-4 py-2 transition hover:border-gray-900 hover:text-gray-900'
                    >
                      Unfollow
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
      <div className='flex h-full w-full items-center justify-center'>
        <div className='my-10 flex h-full w-full flex-col items-center justify-center lg:max-w-screen-md xl:max-w-screen-lg'>
          <div className='flex w-full flex-col rounded-3xl bg-white shadow-md'>
            <div className='relative h-44 w-full rounded-t-3xl bg-gradient-to-r from-rose-100 to-teal-100'>
              <div className='absolute -bottom-10 left-12'>
                <div className='group relative h-28 w-28 rounded-full border-2 border-white bg-gray-100'>
                  {currentUser.data?.user?.id === userProfile.data?.id && (
                    <label
                      htmlFor='avatarFile'
                      className='absolute z-10 flex h-full w-full cursor-pointer items-center justify-center rounded-full  transition group-hover:bg-black/40'
                    >
                      <BiEdit className='hidden text-3xl text-white group-hover:block' />
                      <input
                        type='file'
                        name='avatarFile'
                        id='avatarFile'
                        className='sr-only'
                        accept='image/*'
                        // onChange={handleChangeImage}
                        multiple={false}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
            <div className='ml-12 mt-10 flex flex-col space-y-0.5 rounded-b-3xl py-4'>
              <div className='text-2xl font-semibold text-gray-800'>
                {userProfile.data?.name}
              </div>
              <div className='text-gray-600'>@{userProfile.data?.username}</div>
              <div className='text-gray-600'>
                {userProfile.data?._count.posts} Posts
              </div>
              <div className='flex items-center space-x-4'>
                <button
                  onClick={() =>
                    setisFollowModalOpen({
                      isOpen: true,
                      modalType: 'followers',
                    })
                  }
                  className='text-gray-700 hover:text-gray-900'
                >
                  <span className='text-gray-900'>{}</span>{' '}
                  {userProfile.data?._count.followedBy} Followers
                </button>
                <button
                  onClick={() =>
                    setisFollowModalOpen({
                      isOpen: true,
                      modalType: 'following',
                    })
                  }
                  className='text-gray-700 hover:text-gray-900'
                >
                  <span className='text-gray-900'>{}</span>
                  {userProfile.data?._count.followings} Followings
                </button>
              </div>
              <div className='flex w-full items-center space-x-4'>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    toast.success('URL copied to clipboard 🥳')
                  }}
                  className='mt-2 flex transform items-center space-x-3 rounded border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900 active:scale-95 '
                >
                  <div>Share</div>
                  <div>
                    <SlShareAlt />
                  </div>
                </button>
                {userProfile.isSuccess && userProfile.data?.followedBy && (
                  <button
                    onClick={() => {
                      if (userProfile.data?.id) {
                        // FIrst, see if we're already following them.
                        userProfile.data.followedBy.length > 0
                          ? // If we are, unfollow them.
                            unfollowUser.mutate({
                              followingUserId: userProfile.data.id,
                            })
                          : // Otherwise, follow them.
                            followUser.mutate({
                              followingUserId: userProfile.data.id,
                            })
                      }
                      console.log('clicked')
                    }}
                    className='mt-2 flex items-center space-x-3 rounded border border-gray-400/50 bg-white px-4 py-2 transition hover:border-gray-900 hover:text-gray-900'
                  >
                    {userProfile.data?.followedBy.length > 0
                      ? 'Unfollow'
                      : 'Follow'}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className='my-10 w-full'>
            {userPosts.isSuccess &&
              userPosts.data?.posts.map((post) => (
                <Post {...post} key={post.id} />
              ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default UserProfilePage
