import { env } from "@/src/env.mjs";
import {  isDev, isProd } from "@/src/utils/auth/isEnv";
import { getUserAuthFull } from "@/src/utils/user/getUserAuthFull";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const testGenRouter = createTRPCRouter({
  envLog: publicProcedure.query(() => {
    isDev(`my`)
    console.log(`NODE Env: ${env.NODE_ENV}`);
    console.log(`My Env: ${env.MY_ENV}`);
    return {
      NodeEnv: env.NODE_ENV,
      MyEnv: env.MY_ENV,
      WorkflowRun: true,
    };
  }),
  basic: publicProcedure.query(() => {
    isDev("my");

    return {
      something: "everything",
    };
  }),
  basicDb: publicProcedure.query(async ({ ctx }) => {
    isDev("my");

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
    isProd("my");
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
    isDev("my");

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
