import { createTRPCRouter } from '@/server/api/trpc';
import { exampleRouter } from '@/server/api/routers/example';
import { userRouter } from '@/server/api/routers/user';
import { OSSRouter } from '@/server/api/routers/oss';
import { postRouter } from '@/server/api/routers/post';
import { commentRouter } from '@/server/api/routers/comment';
import { searchRouter } from '@/server/api/routers/search';
import { musicRouter } from '@/server/api/routers/music';
import { adminRouter } from '@/server/api/routers/admin';
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  oss: OSSRouter,
  post: postRouter,
  comment: commentRouter,
  search: searchRouter,
  music: musicRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
