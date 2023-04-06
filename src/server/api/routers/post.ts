import { z } from 'zod';
import sanitizeHtml from 'sanitize-html';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/api/trpc';

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({ title: z.string(), content: z.string(), images: z.array(z.string()).optional() }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      // sanitize the content
      const content = sanitizeHtml(input.content);
      // // create a new post
      const post = await ctx.prisma.post.create({
        data: {
          title: input.title,
          content,
          published: true,
          author: {
            connect: {
              id: userId,
            },
          },
          images: {
            createMany: {
              data: input.images?.map((image, idx) => ({ url: image, order: idx })) ?? [],
            },
          },
        },
      });
      // return the post
      return post;
    }),

  like: protectedProcedure
    .input(z.object({ postId: z.string(), like: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const like = await ctx.prisma.like.upsert({
        where: {
          userId_postId: {
            postId: input.postId,
            userId,
          },
        },
        create: {
          post: {
            connect: {
              id: input.postId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
        update: {
          isDeleted: !input.like,
        },
      });

      return true;
    }),

  findMany: publicProcedure
    .input(z.object({ skip: z.number(), take: z.number() }))
    .query(async ({ input, ctx }) => {
      const queryConfig = {
        where: {
          isDeleted: false,
          published: true,
        },
        include: {
          images: true,
          _count: {
            select: {
              likes: true,
            },
          },
          likes: {
            where: {
              userId: ctx.session?.user.id,
              isDeleted: false,
            },
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      };

      // if (ctx.session?.user.id) {
      //   queryConfig.include.
      // }
      const totalRecordsPromise = ctx.prisma.post.count({
        where: {
          isDeleted: false,
          published: true,
        },
      });

      const postsPromise = ctx.prisma.post.findMany({
        skip: input.skip,
        take: input.take,
        where: {
          isDeleted: false,
          published: true,
        },
        include: {
          images: true,
          _count: {
            select: {
              likes: true,
            },
          },
          likes: {
            where: {
              userId: ctx.session?.user.id,
              isDeleted: false,
            },
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const [posts, totalRecords] = await Promise.all([postsPromise, totalRecordsPromise]);
      return {
        posts,
        curSkip: input.skip,
        hasMore: input.skip + input.take < totalRecords,
      };
    }),

  findOne: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const post = await ctx.prisma.post.findUnique({
      where: {
        id: input.id,
      },
      include: {
        images: true,
        _count: {
          select: {
            likes: true,
          },
        },
        likes: {
          where: {
            userId: ctx.session?.user.id,
            isDeleted: false,
          },
          select: {
            id: true,
          },
        },
      },
    });
    return post;
  }),
});
