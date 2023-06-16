import { router, protectedProcedure } from '../trpc'
import { createApi } from 'unsplash-js'
import { env } from '../../../env/server.mjs'
import { TRPCError } from '@trpc/server'
import { unsplashSearchRouteSchema } from '../../../components/UnsplashGallery'

const unsplash = createApi({
  accessKey: env.UNSPLASH_ACCESS_KEY,
})

export const unsplashRouter = router({
  getImages: protectedProcedure
    .input(unsplashSearchRouteSchema)
    .query(async ({ input: { searchQuery } }) => {
      try {
        // TODO: Finish unsplash router
        const imagesData = await unsplash.search.getPhotos({
          query: searchQuery,
          orientation: 'landscape',
        })

        return imagesData.response
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Unsplash Error: ${error}`,
        })
      }
    }),
})
