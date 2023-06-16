import { useRouter } from 'next/router'
import React from 'react'
import LoadingSpinner from '../../components/LoadingSpinner'
import Post from '../../components/Post'
import MainLayout from '../../layouts/MainLayout'
import { trpc } from '../../utils/trpc'

const tagPage = () => {
  const router = useRouter()
  const getTag = trpc.tag.getTag.useQuery({
    name: router.query.tag as string,
  })

  return (
    <MainLayout>
      {getTag.isLoading && <LoadingSpinner />}
      {getTag.isSuccess && getTag.data && (
        <div>
          <div>{getTag.data.name}</div>
          <div>{getTag.data.description}</div>
          <div>{getTag.data.slug}</div>
          <div>
            Posts:{' '}
            <div>
              {getTag.data.posts &&
                getTag.data?.posts?.map((post) => (
                  <Post key={post.id} {...post} />
                ))}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

export default tagPage
