import { ruleAccess } from "@/src/1/auth/utils-server/access";
import { csrfCreate, csrfVerify } from "@/src/1/auth/utils-server/csrf";
import rateLimit from "@/src/1/auth/utils-server/rateLimit";
import { sesSetDb } from "@/src/1/auth/utils-server/ses";
import { isDev } from "@/src/1/auth/utils-server/isEnv";
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
