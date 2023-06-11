import { ruleAccess } from "@/src/1/auth/utils-server/access";
import { csrfCreate, csrfVerify } from "@/src/1/auth/utils-server/csrf";
import { isDev } from "@/src/1/auth/utils-server/isEnv";
import rateLimit from "@/src/1/auth/utils-server/rateLimit";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

/* -------------------------------------------------------------------------- */
export const testLimit = createTRPCRouter({
  limitTest: publicProcedure.query(async ({}) => {
    const limitSuccess = await rateLimit("1");

    console.log(`Passed: ${JSON.stringify(limitSuccess)}`)
    console.log(`Passed: ${JSON.stringify(limitSuccess)}`)
    console.log(`Passed: ${JSON.stringify(limitSuccess)}`)
    console.log(`Passed: ${JSON.stringify(limitSuccess)}`)
    console.log(`Passed: ${JSON.stringify(limitSuccess)}`)


    console.log("after limit passed");
    console.log("after limit passed");
    console.log("after limit passed");
    console.log("after limit passed");

    return "something";
  }),
});
