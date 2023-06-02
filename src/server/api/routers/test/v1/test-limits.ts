import { ruleAccess } from "@/src/utils/auth/access";
import { csrfCreate, csrfVerify } from "@/src/utils/auth/csrf";
import { isDev } from "@/src/utils/auth/isEnv";
import rateLimit from "@/src/utils/auth/rateLimit";
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

    return;
  }),
});
