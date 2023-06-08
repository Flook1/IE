import { ruleAccess } from "@/src/utils/auth/access";
import { csrfCreate, csrfVerify } from "@/src/utils/auth/csrf";
import { isDev } from "@/src/utils/auth/isEnv";
import type { IeCookie } from "@/src/utils/general/cookie";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

/* -------------------------------------------------------------------------- */
export const testCookie = createTRPCRouter({
  cookieLog: publicProcedure.query(({ ctx }) => {
    isDev("my");
    // console.log(ctx.req.cookies);

    const reqData = ctx.req.cookies;

    // ctx.res.setHeader("something", "something");
    // ctx.res.setHeader("set-cookie", "something");

    return {
      reqData,
    };
  }),
  cookieGet: publicProcedure.query(({ctx}) => {

    isDev("my")

    const allCookies: IeCookie = ctx.req.cookies
    const ieAuthSesCookie = allCookies.ieAuthSes
    const ieCsrfHashed = allCookies.ieCsrfHashed
    const ieCsrfToken = allCookies.ieCsrfToken


    return {
      allCookies,
      ieAuthSesCookie,
      ieCsrfHashed,
      ieCsrfToken,
    }
  }),
  setCSRF: publicProcedure.query(async ({ ctx }) => {
    await csrfCreate(ctx);

    return {
      cookies: "should be set",
    };
  }),
  csrfVerify: publicProcedure.query(async ({ ctx }) => {
    const verified = await csrfVerify(ctx)

    return verified
  }),
});

