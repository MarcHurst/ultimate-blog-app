import { z } from 'zod'
import { router, protectedProcedure, publicProcedure } from '../trpc'
import { commentFormSchema } from '../../../components/CommentSidebar'

export const commentRouter = router({
  createComment: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { text, postId } }) => {
      await prisma.comment.create({
        data: {
          text,
          user: {
            connect: {
              id: session.user.id,
            },
          },
          post: {
            connect: {
              id: postId,
            },
          },
        },
      })
    }),

  getComments: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx: { prisma }, input: { postId } }) => {
      const comments = await prisma.comment.findMany({
        where: {
          postId,
        },
        select: {
          id: true,
          text: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      return comments
    }),
})
