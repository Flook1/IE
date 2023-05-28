import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const testGenRouter = createTRPCRouter({
  basic: publicProcedure.query(() => {
    return {
      something: "everything",
    };
  }),
  basicDb: publicProcedure.query(async ({ ctx }) => {
    const userTest = await ctx.prisma.user_main.findFirst({});

    if (!userTest) {
      return { something: "db query error" };
    }
    const { user_id, email_id } = userTest;
    const userTest2 = { user_id, email_id };

    return {
    //   userTest,
      userTest2,
    };
  }),
});
