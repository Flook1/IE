import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "~/env.mjs";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  // Working one:
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
          );
          console.error(`CAUSE: ${JSON.stringify(error.cause, null, " ")}`);
        }
      : undefined,
  /* -------------- // Testing for error to be sent to database ------------- */
  // onError: async ({ path, error }) => {
  //   try {
  //     const log = await  logError(path ?? "<no-path>", error);;
  //     return log;
  //   } catch (e) {
  //     console.error(`Error logging error: ${e}`);;
  //   }

  //   if (env.NODE_ENV === "development") {
  //     console.error(
  //       `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
  //     );
  //   } else {
  //     return undefined;
  //   }
  // },
});
