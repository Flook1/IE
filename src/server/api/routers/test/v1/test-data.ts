import { env } from "@/src/env.mjs";
import { ruleAccess } from "@/src/utils/auth/access";
import {  isDev, isProd } from "@/src/utils/auth/isEnv";
import { getUserAuthFull } from "@/src/utils/user/getUserAuthFull";
import { TRPCError } from "@trpc/server";
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
  basicRuleCheck: publicProcedure.query(async () => {
    isDev("my");
    const ruleAccessData = await ruleAccess("dashboard", "c")

    return {
      ruleAccessData,
      something: "everything",
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
  errorStopTest2: publicProcedure.query(() => {
    console.log("running BEFORE error test");
    console.log("running BEFORE  error test");

    throw new TRPCError({code: "INTERNAL_SERVER_ERROR"});

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
