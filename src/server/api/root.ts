import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { testGenRouter } from "./routers/test/v1/test-data";
import { authMainRouter } from "./routers/v1/auth/authMain";
import { testCookie } from "./routers/test/v1/test-cookie";
import { testLimit } from "./routers/test/v1/test-limits";
import { testAuth } from "./routers/test/v1/test-auth";
import { testDateRouter } from "./routers/test/v1/test-dates";
import { genMainRouter } from "./routers/v1/general/gen-main";
import { authCheckRouter } from "./routers/v1/auth/authCheck";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  testData: testGenRouter,
  testDate: testDateRouter,
  testCookie: testCookie,
  testLimit: testLimit,
  // testAuth: testAuth,
  authMain: authMainRouter,
  authCheck: authCheckRouter,
  genMain: genMainRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
