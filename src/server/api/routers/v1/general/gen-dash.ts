import { sesQuickCheckThrow } from "@/src/1/auth/utils-server/ses";
import { z } from "zod";
import { createTRPCRouter, sesProcedure } from "~/server/api/trpc";

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
export const genMainRouter = createTRPCRouter({
  dashContent: sesProcedure.query(async ({ ctx }) => {
    sesQuickCheckThrow(ctx.getSes.isSes);
    
    return "something";
  }),
});
