import { z } from 'zod';
import { google, youtube_v3 } from 'googleapis';
import { GaxiosResponse } from 'gaxios';

import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/api/trpc';

// initialize the Youtube API library

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});
const splatoon3_playlist_id = 'PLqkwcOuHs6GmKF_qqBzgyMDrViWvhobns';
const simpleCache = new Map<string, GaxiosResponse<youtube_v3.Schema$SearchListResponse>>();

export const SEARCH_VALUES = ['PLAYER', 'POST'] as const;

export const searchRouter = createTRPCRouter({
  findUsers: publicProcedure
    .input(z.object({ text: z.string(), page: z.number().gte(1), pageSize: z.number() }))
    .query(async ({ input, ctx }) => {
      const { text } = input;
      const data = await ctx.prisma.$transaction([
        ctx.prisma.user.count({
          where: {
            OR: [{ name: { contains: text } }, { nscode: { contains: text } }],
          },
        }),
        ctx.prisma.user.findMany({
          skip: (input.page - 1) * input.pageSize,
          take: input.pageSize,
          where: {
            OR: [{ name: { contains: text } }, { nscode: { contains: text } }],
          },
        }),
      ]);

      return { total: data[0], users: data[1], hasMore: data[0] > input.page * input.pageSize };
    }),

  findPosts: publicProcedure
    .input(z.object({ text: z.string(), page: z.number().gte(1), pageSize: z.number() }))
    .query(async ({ input, ctx }) => {
      const { text } = input;
      const data = await ctx.prisma.$transaction([
        ctx.prisma.post.count({
          where: {
            OR: [{ title: { contains: text } }, { content: { contains: text } }],
          },
        }),
        ctx.prisma.post.findMany({
          skip: (input.page - 1) * input.pageSize,
          take: input.pageSize,
          where: {
            OR: [{ title: { contains: text } }, { content: { contains: text } }],
          },
        }),
      ]);

      return { total: data[0], posts: data[1], hasMore: data[0] > input.page * input.pageSize };
    }),

  findYoutubeVideos: publicProcedure
    .input(z.object({ text: z.string(), pageToken: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      if (simpleCache.has(input.text)) {
        return simpleCache.get(input.text);
      }

      const res = await youtube.search.list({
        part: ['snippet', ''],
        q: input.text + 'Splatoon 3',
        type: ['video'],
        channelId: 'UC7Wu_7guCrcyykG51iH26Jg',
        maxResults: 20,
        pageToken: input.pageToken,
      });

      if (res.status !== 200) {
        throw new Error('Youtube API error');
      }

      simpleCache.set(input.text, res);
      return res;
    }),
});
