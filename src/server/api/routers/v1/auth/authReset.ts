import { env } from "@/src/env.mjs";
import { prisma } from "@/src/server/db";
import { TRPCError } from "@trpc/server";
import * as argon2id from "argon2";
import crypto, { randomUUID } from "crypto";
import dayjs from "dayjs";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  zResetPassForm,
  type tErrAuth,
  objErrAuth,
  zResetPassUpdate,
  zResetTokenVerify,
} from "@/src/1/auth/login/types";

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
export const authResetRouter = createTRPCRouter({
  resetPassCreate: publicProcedure
    .input(zResetPassForm)
    .mutation(async ({ ctx, input }) => {
      let errMsg: tErrAuth;

      // create pass reset token
      const uuid = randomUUID();
      const dateNow = dayjs().add(1, "hour").format();
      // get user
      const qUser = await prisma.user_main.findFirst({
        where: {
          email_id: input.email,
          deleted_on: null,
        },
        select: {
          user_id: true,
          email_id: true,
          name_first: true,
          name_last: true,
        },
      });

      if (!!qUser) {
        // update user
        const uUser = await prisma.user_main.update({
          where: {
            user_id: qUser.user_id,
          },
          data: {
            pass_reset_token: uuid,
            pass_reset_token_expiry: dateNow,
          },
        });

        // token created. Send Emails. send admin and user
        // todo
        if (true) {
          // create email here
        }
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: objErrAuth.Creds,
        });
      }

      return;
    }),

  resetPassVerify: publicProcedure
    .input(zResetTokenVerify)
    .query(async ({ ctx, input }) => {
      let errMsg: tErrAuth;

      const dateNow = dayjs().format();

      const token = await prisma.user_main.findFirst({
        where: {
          pass_reset_token: input.resetToken,
          pass_reset_token_expiry: {
            gte: dateNow,
          },
        },
        select: {
          user_id: true,
        },
      });

      if (!token) {
        errMsg = "Reset Password Token Not Valid";
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: errMsg,
        });
      }

      return;
    }),

  resetPassUpdate: publicProcedure
    .input(zResetPassUpdate)
    .mutation(async ({ ctx, input }) => {
      let errMsg: tErrAuth;

      if (input.password !== input.passwordConfirm) {
        // check pass match
        // error out
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: objErrAuth.PassDontMatch,
        });
      }

      // hash pass
      const hashed = await argon2id.hash(input.password);

      // get user object
      const dateNow = dayjs().format();
      const qUser = await prisma.user_main.findFirst({
        where: {
          pass_reset_token: input.passwordToken,
          pass_reset_token_expiry: {
            gte: dateNow,
          },
        },
        select: {
          user_id: true,
        },
      });
      // error if no user found:
      if (!qUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: objErrAuth.EmailToken,
        });
      }

      // Update user object
      try {
        const uUser = await prisma.user_main.update({
          where: {
            user_id: qUser?.user_id,
          },
          data: {
            pass: hashed,
            pass_reset_token: null,
            pass_reset_token_expiry: null,
            updated_by: qUser.user_id,
            updated_on: dateNow,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "CONTACT IE | error updated user record for password reset",
          cause: error,
        });
      }

      // Send email maybe?
      //todo send email above the recent password change

      return;
    }),
});
