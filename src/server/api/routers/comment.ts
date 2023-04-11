import { z } from 'zod';

import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/api/trpc';

export const commentRouter = createTRPCRouter({
  findMany: publicProcedure
    .input(z.object({ postId: z.string(), skip: z.number(), take: z.number() }))
    .query(async ({ input, ctx }) => {
      const totalRecordsPromise = ctx.prisma.comment.count({
        where: {
          postId: input.postId,
          published: true,
        },
      });
      const commentsPromise = ctx.prisma.comment.findMany({
        skip: input.skip,
        take: input.take,
        where: {
          postId: input.postId,
          published: true,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const [comments, totalRecords] = await Promise.all([commentsPromise, totalRecordsPromise]);
      return {
        comments,
        curSkip: input.skip,
        hasMore: input.skip + input.take < totalRecords,
        total: totalRecords,
      };
    }),
  create: protectedProcedure
    .input(z.object({ postId: z.string(), content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      const comment = await ctx.prisma.comment.create({
        data: {
          content: input.content,
          published: true,
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
      });

      return comment;
    }),
});
