import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { router, protectedProcedure, publicProcedure } from '../trpc'

export const userRouter = router({
  getUserProfile: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { username } }) => {
      return await prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          name: true,
          image: true,
          id: true,
          username: true,
          _count: {
            select: {
              posts: true,
              followedBy: true,
              followings: true,
            },
          },
          followedBy: session?.user?.id
            ? {
                where: {
                  id: session?.user?.id,
                },
              }
            : false,
        },
      })
    }),

  getUserPosts: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { username } }) => {
      return await prisma.user.findUnique({
        where: {
          username,
        },
        select: {
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

  // Follow a user
  followUser: protectedProcedure
    .input(
      z.object({
        followingUserId: z.string(),
      })
    )
    .mutation(
      async ({ ctx: { prisma, session }, input: { followingUserId } }) => {
        if (session.user.id === followingUserId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'You cannot follow yourself, noob!',
          })
        }

        return await prisma.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            followings: {
              connect: {
                id: followingUserId,
              },
            },
          },
        })
      }
    ),
  // Unfollow a user
  unfollowUser: protectedProcedure
    .input(
      z.object({
        followingUserId: z.string(),
      })
    )
    .mutation(
      async ({ ctx: { prisma, session }, input: { followingUserId } }) => {
        return await prisma.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            followings: {
              disconnect: {
                id: followingUserId,
              },
            },
          },
        })
      }
    ),

  // List all of a user's followers.
  getAllFollowers: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { userId } }) => {
      return await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          followedBy: {
            select: {
              name: true,
              username: true,
              id: true,
              image: true,
              followedBy: {
                where: {
                  id: session.user.id,
                },
              },
            },
          },
        },
      })
    }),

  // List all of the users that someone is following.
  getAllFollowing: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { userId } }) => {
      return await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          followings: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
      })
    }),

  // Next Function Goes here.
})
