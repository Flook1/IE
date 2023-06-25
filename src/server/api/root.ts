import { createTRPCRouter } from "~/server/api/trpc";
import { testGenRouter } from "./routers/test/v1/test-data";
import { authMainRouter } from "./routers/v1/auth/authMain";
import { testCookie } from "./routers/test/v1/test-cookie";
import { testLimit } from "./routers/test/v1/test-limits";
import { testDateRouter } from "./routers/test/v1/test-dates";
import { genMainRouter } from "./routers/v1/general/gen-main";
import { authCheckRouter } from "./routers/v1/auth/authCheck";
import { authResetRouter } from "./routers/v1/auth/authReset";
import { authSignUpRouter } from "./routers/v1/auth/authSignUp";
import { userBasicRouter } from "./routers/v1/user/userBasic";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // AUTH
  // AUTH
  // AUTH
  // AUTH
  authMain: authMainRouter,
  authCheck: authCheckRouter,
  authReset: authResetRouter,
  authSignUp: authSignUpRouter,

  // MAIN
  // MAIN
  // MAIN
  genMain: genMainRouter,

  // USER
  // USER
  // USER
  userBasic: userBasicRouter,

  // TEST
  // TEST
  // TEST
  // TEST
  testData: testGenRouter,
  testDate: testDateRouter,
  testCookie: testCookie,
  testLimit: testLimit,
  // testAuth: testAuth,
});

// export type definition of API
export type AppRouter = typeof appRouter;
