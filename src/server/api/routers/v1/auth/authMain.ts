import { env } from "@/src/env.mjs";
import { prisma } from "@/src/server/db";
import { TRPCError } from "@trpc/server";
import * as argon2id from "argon2";
import crypto, { randomUUID } from "crypto";
import dayjs from "dayjs";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  zLoginForm,
  type tLoginForm,
  type tErrAuth,
  objErrAuth,
} from "@/src/1/auth/login/types";
import {
  verifyPassHash,
  getUserAuthBasic,
} from "@/src/1/auth/utils-server/login";
import {
  sesCreate,
  sesDelCookie,
  sesSetCookie,
  sesSetDb,
} from "@/src/1/auth/utils-server/ses";

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
export const authMainRouter = createTRPCRouter({
  login: publicProcedure.input(zLoginForm).mutation(async ({ ctx, input }) => {

    // check if email exists
    const userData = await getUserAuthBasic(input.email);

    // check if user exists
    if (!userData) {
      // if (true) {
      // this is when need to reset the email, likely client from old system
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: objErrAuth.Creds,
      });
    }
    // check if password exists
    if (userData?.pass == null) {
      // if (true) {
      // this is when need to reset the email, likely client from old system
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: objErrAuth.NoPass,
      });
    }

    const passMatch = await verifyPassHash(userData.pass, input.password);

    if (!passMatch) {
      // Passwords dont match
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: objErrAuth.Creds,
      });
    }

    // Create sess id:
    const sesId = crypto.randomUUID();
    const dateJs = dayjs();
    const dateExpires = dateJs.add(30, "days").toDate();

    // setting cookie
    sesSetCookie(ctx, sesId, dateExpires);

    // create db session
    await sesCreate(sesId, dateExpires);

    // update session with object
    const sesObj = await sesSetDb(ctx, userData.user_id, sesId);

    return { ...sesObj };
    // return
  }),

  logOut: publicProcedure.mutation(async ({ ctx }) => {
    const sesDelSuccess = await sesDelCookie(ctx);
    return sesDelSuccess;
  }),

  emailVerify: publicProcedure
    .input(
      z.object({
        verifyToken: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let errMsg: tErrAuth;

      const dateNow = dayjs();
      // get user object
      const qUser = await prisma.user_main.findFirst({
        where: {
          email_token: input.verifyToken,
        },
        select: {
          user_id: true,
          email_verified: true,
        },
      });

      if (!qUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: objErrAuth.EmailToken,
        });
      }

      if (qUser?.email_verified) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: objErrAuth.EmailVerified,
        });
      }

      // update user email verified
      const uUser = await prisma.user_main.update({
        where: {
          user_id: qUser.user_id,
        },
        data: {
          email_verified: dateNow.format(),
          email_token: null,
        },
        select: {
          user_id: true,
        },
      });

      return;
    }),
});
