import { env } from "@/src/env.mjs";
import { prisma } from "@/src/server/db";
import { TRPCError } from "@trpc/server";
import * as argon2id from "argon2";
import crypto, { randomUUID } from "crypto";
import { eachMonthOfInterval } from "date-fns";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import { boolean, z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  zLoginForm,
  type tLoginForm,
  type tErrAuth,
  objErrSes,
} from "@/src/1/auth/login/types";
import { type IeCookie } from "@/src/utils/general/cookie";
import { sesGet, sesCheck } from "@/src/1/auth/utils-server/ses";

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
export const authCheckRouter = createTRPCRouter({
  sesCheck: publicProcedure
    .input(
      z.object({
        verify: z.boolean(),
      })
    )
    .query(async ({ ctx, input }) => {
      await sesCheck(ctx, input.verify)
    }),
  sesGetReturn: publicProcedure.query(async({ ctx, input }) => {
    const sesReturned = await sesGet(ctx)

    return {...sesReturned}
  }),
  sesGet: publicProcedure.query(async({ctx}) => {
    const sesGetObj = await sesGet(ctx)

    return {...sesGetObj}
  })
});
