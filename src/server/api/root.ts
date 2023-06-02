import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { testGenRouter } from "./routers/test/v1/test-data";
import { authLoginRouter } from "./routers/v1/auth/login";
import { testCookie } from "./routers/test/v1/test-cookie";
import { testLimit } from "./routers/test/v1/test-limits";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  testData: testGenRouter,
  testCookie: testCookie,
  testLimit: testLimit,
  authLogin: authLoginRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
