import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { sesGet, sesCheck, sesDelCookie } from "@/src/1/auth/utils-server/ses";

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
export const authCheckRouter = createTRPCRouter({
  sesCheck: publicProcedure
    .input(
      z.object({
        verify: z.boolean(),
      })
    )
    .query(async ({ ctx, input }) => {
      const sesSuccess = await sesCheck(ctx, input.verify);
      return sesSuccess;
    }),
  sesGet: publicProcedure.query(async ({ ctx }) => {
    const sesGetObj = await sesGet(ctx);

    return sesGetObj;
  }),
  // session delete:
  sesDel: publicProcedure.mutation(async ({ctx}) => {

    const sesDeleted = await sesDelCookie(ctx)

    return sesDeleted;
  })
});
