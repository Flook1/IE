import { ruleAccess } from "@/src/utils/auth/access";
import { csrfCreate, csrfVerify } from "@/src/utils/auth/csrf";
import { isDev } from "@/src/utils/auth/isEnv";
import rateLimit from "@/src/utils/auth/rateLimit";
import { sesSetDb } from "@/src/utils/auth/ses";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

/* -------------------------------------------------------------------------- */
// This is to mainly test auth queries to see how they are doing.

export const testAuth = createTRPCRouter({
  authSesObj: publicProcedure.query(async ({}) => {
    isDev("my");

    // create session obj test
    const sesSetObj =  await sesSetDb("qfbu8n", "randomses");


    return sesSetObj
  }),
});
