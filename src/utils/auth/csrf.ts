import type { ctxMain } from "@/src/server/api/trpc";
import argon from "argon2";
import { nanoid } from "nanoid";
import cookie from "cookie";
import type { IeCookie } from "../general/cookie";
import { TRPCError } from "@trpc/server";

/* -------------------------------------------------------------------------- */

export const csrfCreate = async (opts: ctxMain) => {
  const allCookies: IeCookie = opts.req.cookies;

  const token = allCookies.ieCsrfToken;
  const hashed = allCookies.ieCsrfHashed;

  if (!token || !hashed) {
    // One is missing, so recreate

    const csrfToken = nanoid();
    const csrfHashed = await argon.hash(csrfToken);

    // parse cookies
    const tokenParsed = cookie.serialize("ieCsrfToken", csrfToken);
    const hashedParsed = cookie.serialize("ieCsrfHashed", csrfHashed);

    // set the headers
    opts.res.setHeader("set-cookie", [tokenParsed, hashedParsed]);
  }
};

export const csrfVerify = async (opts: ctxMain) => {
  const allCookies: IeCookie = opts.req.cookies;

  const token = allCookies.ieCsrfToken;
  const hashed = allCookies.ieCsrfHashed;

  if (!token || !hashed) {
    // Means missing a token/hashed
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Error, missing csrf token for verification",
    });
  }

  const verify = await argon.verify(hashed, token);

  if (!verify) {
    // means dont match
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "csrf tokens dont match, being attacked?",
    });
  }

  return verify;
};