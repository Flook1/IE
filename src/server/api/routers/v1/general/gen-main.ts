import { isEnv } from "@/src/1/auth/utils-server/isEnv";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
export const genMainRouter = createTRPCRouter({
  isEnv: publicProcedure
    .input(
      z.object({
        envSel: z.enum(["my", "node"]),
        envType: z.enum(["development", "staging", "production", "test"]),
      })
    )
    .query(({ ctx, input }) => {
      const allowed = isEnv(input.envSel, input.envType, false);

      return { isAllowed: allowed };
    }),
});
