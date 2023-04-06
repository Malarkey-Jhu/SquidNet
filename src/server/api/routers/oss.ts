import { z } from 'zod';
import { STS } from 'ali-oss';

import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/api/trpc';
let sts = new STS({
  accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
});

export const OSSRouter = createTRPCRouter({
  getSTS: protectedProcedure.query(async () => {
    try {
      const result = await sts.assumeRole('acs:ram::1873071805172768:role/ramosstest', ``, 3000);

      return {
        AccessKeyId: result.credentials.AccessKeyId,
        AccessKeySecret: result.credentials.AccessKeySecret,
        SecurityToken: result.credentials.SecurityToken,
        Expiration: result.credentials.Expiration,
      };
    } catch (e) {
      console.error(e);
    }
  }),
});
