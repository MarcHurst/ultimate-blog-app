import { z } from 'zod'
import { writeFormSchema } from '../../../components/WriteFormModal'
import { router, protectedProcedure, publicProcedure } from '../trpc'
import slugify from 'slugify'

export const postRouter = router({
  createPost: protectedProcedure
    .input(
      writeFormSchema.and(
        z.object({
          tagsIds: z
            .array(
              z.object({
                id: z.string(),
              })
            )
            .optional(),
        })
      )
    )
    .mutation(
      async ({
        ctx: { prisma, session },
        input: { title, description, text },
      }) => {
        // a function that checks whether the post with this title already exists
        const postExists = await prisma.post.findFirst({
          where: {
            title,
          },
        })

        if (postExists) {
          throw new Error('Post already exists')
        } else {
          await prisma.post.create({
            data: {
              title,
              description,
              text,
              slug: slugify(title),
              author: {
                connect: {
                  id: session.user.id,
                },
              },
            },
          })
        }
      }
    ),

  getPosts: publicProcedure.query(async ({ ctx: { prisma, session } }) => {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        createdAt: true,
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
    })
    return posts
  }),

  getPost: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { slug } }) => {
      const post = await prisma.post.findUnique({
        where: {
          slug,
        },
        select: {
          id: true,
          description: true,
          title: true,
          text: true,
          likes: session?.user?.id
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
      })
      return post
    }),
  likePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(
      async ({
        ctx: {
          prisma,
          session: {
            user: { id },
          },
        },
        input: { postId },
      }) => {
        await prisma.like.create({
          data: {
            userId: id,
            postId,
          },
        })
        // await prisma.post.update({
        //   where: {
        //     id: postId,
        //   },
        //   data: {
        //   }
        // })
      }
    ),

  dislikePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(
      async ({
        ctx: {
          prisma,
          session: {
            user: { id },
          },
        },
        input: { postId },
      }) => {
        await prisma.like.delete({
          where: {
            userId_postId: {
              userId: id,
              postId,
            },
          },
        })
      }
    ),

  bookmarkPost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.bookmark.create({
        data: {
          userId: session.user.id,
          postId,
        },
      })
    }),

  unbookmarkPost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(
      async ({
        ctx: {
          prisma,
          session: {
            user: { id },
          },
        },
        input: { postId },
      }) => {
        await prisma.bookmark.delete({
          where: {
            userId_postId: {
              userId: id,
              postId,
            },
          },
        })
      }
    ),

  readingList: protectedProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      const bookmarks = await prisma.bookmark.findMany({
        where: {
          userId: session.user.id,
        },
        take: 4,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          post: {
            select: {
              title: true,
              description: true,
              author: {
                select: {
                  name: true,
                  image: true,
                },
              },
              createdAt: true,
              slug: true,
            },
          },
        },
      })
      return bookmarks
    }
  ),
  /*
  id        String   @id @default(cuid())
  userId    String
  postId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  post      Post     @relation(fields: [postId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
 */

  createComment: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        text: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { postId, text } }) => {
      await prisma.comment.create({
        data: {
          text,
          userId: session.user.id,
          postId,
        },
      })
    }),

  fetchComments: protectedProcedure
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
      })
      return comments
    }),
})
