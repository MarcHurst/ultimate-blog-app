import { Tag } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import slugify from 'slugify'
import { z } from 'zod'

import { tagCreateSchema } from '../../../components/TagForm'
import { router, protectedProcedure, publicProcedure } from '../trpc'

export const tagRouter = router({
  createTag: protectedProcedure
    .input(tagCreateSchema)
    .mutation(async ({ ctx: { prisma }, input }) => {
      // Check to see if the tag already exists
      const tag = await prisma.tag.findUnique({
        where: {
          name: input.name,
        },
      })

      if (tag) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Tag already exists',
        })
      }

      // It doesn't exist, so create it.
      await prisma.tag.create({
        data: {
          ...input,
          slug: slugify(input.name),
        },
      })
    }),

  getTags: protectedProcedure.query(async ({ ctx: { prisma } }) => {
    return await prisma.tag.findMany()
  }),

  getTag: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { name } }) => {
      return await prisma.tag.findUnique({
        where: {
          name,
        },
        select: {
          slug: true,
          name: true,
          description: true,
          posts: {
            select: {
              id: true,
              slug: true,
              title: true,
              description: true,
              createdAt: true,
              featuredImage: true,
              author: {
                select: {
                  name: true,
                  image: true,
                  username: true,
                },
              },
              bookmarks: session?.user?.id
                ? {
                    where: {
                      userId: session?.user?.id,
                    },
                  }
                : false,
              tags: {
                select: {
                  name: true,
                  id: true,
                  slug: true,
                },
              },
            },
          },
        },
      })
    }),

  getUserTags: protectedProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: session.user.id,
          },
          select: {
            posts: {
              select: {
                tags: true,
              },
            },
          },
        })
        const tagsArr: Tag[] = []
        user?.posts.forEach((post) => {
          post.tags.forEach((tag) => {
            tagsArr.push(tag)
          })
        })
        return tagsArr
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
        })
      }
    }
  ),
})
