import { z } from 'zod';
import bcrypt from 'bcrypt';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/api/trpc';
import { User } from '@prisma/client';

export const userRouter = createTRPCRouter({
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
      return user;
    }),
});
