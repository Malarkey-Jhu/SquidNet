import { z } from 'zod';
import { google, youtube_v3 } from 'googleapis';

import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/api/trpc';

// initialize the Youtube API library

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});
const splatoon3_playlist_id = 'PLqkwcOuHs6GmKF_qqBzgyMDrViWvhobns';

export const musicRouter = createTRPCRouter({
  like: protectedProcedure
    .input(z.object({ musicId: z.string(), like: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const like = await ctx.prisma.like.upsert({
        where: {
          userId_musicId: {
            userId,
            musicId: input.musicId,
          },
        },
        create: {
          user: {
            connect: {
              id: userId,
            },
          },
          musicId: input.musicId,
        },
        update: {
          isDeleted: !input.like,
        },
      });

      return true;
    }),

  findLikes: publicProcedure
    .input(z.object({ musicId: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        const total = await ctx.prisma.like.count({
          where: {
            musicId: input.musicId,
            isDeleted: false,
          },
        });
        return {
          total,
          liked: false,
        };
      }
      const data = await ctx.prisma.$transaction([
        ctx.prisma.like.count({
          where: {
            musicId: input.musicId,
            isDeleted: false,
          },
        }),
        ctx.prisma.like.count({
          where: {
            musicId: input.musicId,
            isDeleted: false,
            user: {
              id: ctx.session?.user?.id,
            },
          },
        }),
      ]);

      return {
        total: data[0],
        liked: data[1] > 0,
      };
    }),

  findAll: publicProcedure
    .input(z.object({ pageToken: z.string().optional(), etag: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      const headers = {};
      if (input.etag) {
        headers['If-None-Match'] = input.etag;
      }

      const res = await youtube.playlistItems.list(
        {
          part: ['snippet'],
          playlistId: splatoon3_playlist_id,
          maxResults: 10,
          pageToken: input.pageToken,
        },
        {
          headers,
        },
      );

      if (res.status === 200) {
        return res.data;
      }

      res.status = 500;
      return [];
    }),
});
