import { env } from "@/src/env.mjs";
import { isTest, isDev, isProduction } from "@/src/utils/test/isDev";
import { getUserAuthFull } from "@/src/utils/user/getUserAuthFull";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const testGenRouter = createTRPCRouter({
  envLog: publicProcedure.query(() => {
    console.log(`NODE Env: ${env.NODE_ENV}`);
    console.log(`My Env: ${env.MY_ENV}`);
    return {
      NodeEnv: env.NODE_ENV,
      MyEnv: env.MY_ENV,
    };
  }),
  basic: publicProcedure.query(() => {
    isTest();

    return {
      something: "everything",
    };
  }),
  basicDb: publicProcedure.query(async ({ ctx }) => {
    isTest();

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
  errorStopTest: publicProcedure.query(() => {
    isProduction();
    // the test user id:
    console.log("running after error test");
    console.log("running after error test");
    console.log("running after error test");
    console.log("running after error test");
    console.log("running after error test");
    console.log("running after error test");
    console.log("running after error test");

    return "nothing";
  }),
  getUserFullAuth: publicProcedure.query(async () => {
    isTest();

    // the test user id:
    console.log("running after error test");
    console.log("running after error test");
    console.log("running after error test");
    console.log("running after error test");
    console.log("running after error test");
    console.log("running after error test");
    console.log("running after error test");
    const id = "qfbu8n";
    const userFullAuthTest = await getUserAuthFull(id);

    return {
      userFullAuthTest,
    };
  }),
});
