import { type GetServerSidePropsContext } from 'next';
import { getServerSession, type NextAuthOptions, type DefaultSession } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { env } from '@/env.mjs';
import { prisma } from '@/server/db';
import bcrypt from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user'];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string;
      }
      return session;
    },
    jwt(params) {
      if (params.user) {
        params.token.userId = params.user.id;
      }
      return params.token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials, req) {
        const user = await prisma.user.findUnique({
          where: { email: credentials!.email },
        });
        if (!user) {
          throw new Error('No user found');
        }
        if (user.password === null) {
          throw new Error('Unable to sign in with credentials');
        }
        const passwordValid = await bcrypt.compare(credentials!.password, user.password);
        if (!passwordValid) {
          throw new Error('Unable to sign in with credentials');
        }
        return user;
      },
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
