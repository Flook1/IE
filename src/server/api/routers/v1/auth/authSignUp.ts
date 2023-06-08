import { env } from "@/src/env.mjs";
import { prisma } from "@/src/server/db";
import * as zEnum from "@/src/utils/general/zEnums";
import { TRPCError } from "@trpc/server";
import * as argon2id from "argon2";
import crypto, { randomUUID } from "crypto";
import { eachMonthOfInterval } from "date-fns";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
export const authSignUpRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(
      z.object({
        email: z.string().email().toLowerCase(),
        password: z
          .string()
          .min(Number(env.NEXT_PUBLIC_PASS_MIN))
          .max(Number(env.NEXT_PUBLIC_PASS_MAX)),
        passwordConfirm: z
          .string()
          .min(Number(env.NEXT_PUBLIC_PASS_MIN))
          .max(Number(env.NEXT_PUBLIC_PASS_MAX)),
        nameFirst: z.string().min(1).max(25).toLowerCase(),
        nameLast: z.string().min(1).max(25).toLowerCase(),
        clientType: zEnum.ClientType,
        busType: zEnum.BusType,
        busName: z.string().min(1).max(25).toLowerCase(),
        payType: zEnum.PayType,
        curr: zEnum.CurrCode,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const dateNow = dayjs();

      // check if email exists
      const qUserEmail = await prisma.user_main.findFirst({
        where: {
          email_id: input.email,
        },
        select: {
          user_id: true,
        },
      });

      if (qUserEmail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already in use",
        });
      }

      // we can assume we can create account
      // pass comfirm
      if (input.password !== input.passwordConfirm) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "passwords dont match",
        });
      }

      const hashed = await argon2id.hash(input.password);

      // check if business name exists
      let qBusCount = await prisma.business.count({
        where: {
          business_name: input.busName,
        },
      });
      let busName = input.busName;
      if (qBusCount > 0) {
        qBusCount = qBusCount + 1;
        busName = `${busName} ${qBusCount}`;
      }

      // get role:
      const qRole = await prisma.auth_role.findFirst({
        where: {
          business_type: input.busType,
        },
        select: {
          id: true,
          role_name: true,
        },
      });

      if (!qRole) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Couldn't find role id, in the qRole",
        });
      }

      let qCurrSel = await prisma.country.findFirst({
        where: {
          currency_code: input.curr,
        },
        select: {
          id: true,
          currency_code: true,
          currency_symbol: true,
          currency_name: true,
        },
      });

      if (input.busType == "editor") {
        qCurrSel = await prisma.country.findFirst({
          where: {
            currency_code: "USD",
          },
          select: {
            id: true,
            currency_code: true,
            currency_symbol: true,
            currency_name: true,
          },
        });
      }

      if (!qCurrSel) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "didnt get currency from qCurrSel query",
        });
      }

      // email verify stuff:
      const emailVerifyToken = randomUUID();

      // todo  need to do things with stripe
      const stripeCode = "something";

      // insert user
      const iUser = await prisma.user_main.create({
        data: {
          email_id: input.email,
          role_id: qRole.id,
          name_first: input.nameFirst,
          name_last: input.nameLast,
          pass: hashed,
          stripe_code: stripeCode,
          country_id: qCurrSel?.id,
          email_token: emailVerifyToken,
          is_legacy: false,
          created_on: dateNow.format(),
        },
        select: {
          user_id: true,
        },
      });

      // insert business
      const iBus = await prisma.business.create({
        data: {
          business_type: input.busType,
          display_name: input.busName,
          business_name: input.busName,
          country_id: qCurrSel.id,
          currency_id: qCurrSel.id,
          owner_user_id: iUser.user_id,
          client_type: input.clientType,
          payment_type: input.payType,
          stripe_code: stripeCode,
          legal_privacy_agreed_on: dateNow.format(),
          legal_terms_agreed_on: dateNow.format(),
          created_by: iUser.user_id,
          created_on: dateNow.format(),
          is_legacy: false,
          ...(input.busType === "editor" && { max_jobs_per_editor: 5 }),
        },
        select: {
          id: true,
        },
      });

      // update user and connect to business
      const uUser = await prisma.user_main.update({
        where: {
          user_id: iUser.user_id,
        },
        data: {
          business_id: iBus.id
        }
      });

      //trigger send email verification
      // todo

      // trigger login/ses


      // done
      return

    }),
});

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
// Server components below
