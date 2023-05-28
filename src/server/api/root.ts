import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { testGenRouter } from "./routers/test/v1/test-data";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  testData: testGenRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
