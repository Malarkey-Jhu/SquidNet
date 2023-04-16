import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/api/trpc';

export const adminRouter = createTRPCRouter({
  deletePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.post.update({
        where: {
          id: input.postId,
        },
        data: {
          isDeleted: true,
        },
      });
      return true;
    }),

  findManyPosts: publicProcedure
    .input(z.object({ page: z.number().gte(1), pageSize: z.number() }))
    .query(async ({ input, ctx }) => {
      const data = await ctx.prisma.$transaction([
        ctx.prisma.post.count(),
        ctx.prisma.post.findMany({
          skip: (input.page - 1) * input.pageSize,
          take: input.pageSize,
          where: {
            isDeleted: false,
          },
          include: {
            author: {
              select: {
                id: true,
                image: true,
                name: true,
              },
            },
            images: true,
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        }),
      ]);

      return {
        total: data[0],
        posts: data[1],
        hasMore: data[0] > input.page * input.pageSize,
      };
    }),
});
