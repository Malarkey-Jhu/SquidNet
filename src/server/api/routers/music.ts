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
