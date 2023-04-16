import { z } from 'zod';
import bcrypt from 'bcrypt';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/api/trpc';
import { User } from '@prisma/client';

export const userRouter = createTRPCRouter({
  findPosts: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        skip: z.number(),
        take: z.number(),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const posts = await ctx.prisma.post.findMany({
        skip: input.skip,
        take: input.take + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: {
          isDeleted: false,
          authorId: input.userId,
          published: true,
        },
      });
      return {
        posts: posts.slice(0, input.take),
        hasMore: posts.length === input.take + 1,
      };
    }),
  findLikes: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        skip: z.number(),
        take: z.number(),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const likes = await ctx.prisma.like.findMany({
        skip: input.skip,
        take: input.take + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: {
          isDeleted: false,
          userId: input.userId,
        },
        include: {
          post: true,
        },
      });
      return {
        likes: likes.slice(0, input.take),
        hasMore: likes.length === input.take + 1,
      };
    }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        country: z.string().optional(),
        nscode: z.string().optional(),
        gender: z.number().optional(),
        showNsCode: z.boolean().optional(),
        image: z.string().optional(),
        banner: z.string().optional(),
        intro: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: input,
      });
      return true;
    }),

  find: publicProcedure.input(z.object({ userId: z.string() })).query(async ({ input, ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: input.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        gender: true,
        image: true,
        nscode: true,
        showNsCode: true,
        country: true,
        roleId: true,
        banner: true,
        intro: true,
      },
    });

    return user;
  }),
  register: publicProcedure
    .input(z.object({ email: z.string(), password: z.string(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // useing bycrypt to hash the password
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // check existing user
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User already exists.',
          // optional: pass the original error to retain stack trace
          // cause: theError,
        });
      }

      // create a new user
      const user: User = await ctx.prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
        },
      });
      // return the user
      return true;
    }),
});
