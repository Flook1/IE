import { env } from "@/src/env.mjs";
import { prisma } from "@/src/server/db";
import { TRPCError } from "@trpc/server";
import * as argon2id from "argon2";
import crypto, { randomUUID } from "crypto";
import { eachMonthOfInterval } from "date-fns";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { zLoginForm, type tLoginForm, type tErrAuth } from "@/src/1/auth/login/types";


/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
export const authMainRouter = createTRPCRouter({
  login: publicProcedure
    .input(zLoginForm)
    .mutation(async ({ ctx, input }) => {
      let errMsg: tErrAuth

      // check if email exists
      const userData = await getUserAuthBasic(input.email);


      // check if user exists
      if (!userData) {
      // if (true) {
        errMsg = "Incorrect Credentials"
        // this is when need to reset the email, likely client from old system
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:  errMsg,
        });
      }
      // check if password exists
      if (userData?.pass == null) {
      // if (true) {
        errMsg = "No password on record"
        // this is when need to reset the email, likely client from old system
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:  errMsg,
        });
      }

      const passMatch = await verifyPassHash(userData.pass, input.password);

      let jwtToken;
      if (passMatch) {
        // Create sess id:

        const sesId = crypto.randomUUID;
        const dateNow = new Date();

        console.log(`dateNow:`);
        // create session:

        // setting cookie
        console.log("setting cookie");
        // Cookies.set("ie-au", jwtToken, {
        // expires: 30,
        // sameSite: "strict",
        // secure: true,
        // HttpOnly: true,
        // });
      } else {
        errMsg = "Incorrect Credentials"
        // Passwords dont match
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: errMsg,
        });
      }

      return {
        userData,
        jwtToken,
      };
    }),

  resetPassCreate: publicProcedure
    .input(
      z.object({
        email: z.string().email().toLowerCase(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let errMsg: tErrAuth

      // create email verifcation
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
      } else {
        errMsg = "Incorrect Credentials"

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: errMsg,
        });
      }

      return;
    }),

  resetPassVerify: publicProcedure
    .input(
      z.object({
        resetToken: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      let errMsg:tErrAuth

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
        errMsg = "Reset Password Token Not Valid"
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: errMsg,
        });
      }

      return;
    }),

  resetPassUpdate: publicProcedure
    .input(
      z.object({
        passwordToken: z.string().uuid(),
        password: z
          .string()
          .min(Number(env.NEXT_PUBLIC_PASS_MIN))
          .max(Number(env.NEXT_PUBLIC_PASS_MAX)),
        passwordConfirm: z
          .string()
          .min(Number(env.NEXT_PUBLIC_PASS_MIN))
          .max(Number(env.NEXT_PUBLIC_PASS_MAX)),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let errMsg:tErrAuth

      if (input.password !== input.passwordConfirm) {
        errMsg = "Passwords Don't Match"
        // check pass match
        // error out
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: errMsg,
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
        errMsg = "Reset Password Token Not Valid"
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: errMsg,
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

      return;
    }),

  emailVerify: publicProcedure
    .input(
      z.object({
        verifyToken: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let errMsg: tErrAuth


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

      if (!qUser){
        errMsg = "Email Token Not Valid"
        throw new TRPCError({code: "BAD_REQUEST", message: errMsg})
      }

      if (qUser?.email_verified){
        errMsg = "Email Already Verified"
        throw new TRPCError({code: "BAD_REQUEST", message: errMsg})
      }

      // update user email verified
      const uUser = await prisma.user_main.update({
        where: {
          user_id: qUser.user_id
        },
        data: {
          email_verified: dateNow.format(),
          email_token: null,
        },
        select: {
          user_id: true
        }
      });

      return
    }),
});

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
// Server components below

/* -------------------------------------------------------------------------- */
// Get user for auth details
const getUserAuthBasic = async (email: string) => {
  const user = await prisma.user_main.findFirst({
    where: {
      email_id: email,
    },
    select: {
      user_id: true,
      business_id: true,
      email_id: true,
      pass: true,
      pass_reset_token: true,
      pass_reset_token_expiry: true,
    },
  });

  console.log(`user from getUser ${JSON.stringify(user, null, " ")}}`);

  return user;
};

/* -------------------------------------------------------------------------- */
const jwtSign = (authed: boolean) => {
  if (authed) {
    try {
      // Create jwt
      console.log("starting to create JWT");
      const jwtOpts = {
        userId: "asdnflaksdfnkajksd",
        busId: "naskdnfklasdf",
        somethingNested: {
          rule1: true,
          rule2: true,
          rule3: true,
          rule4: true,
        },
      };
      console.log(`jwtOpts: ${JSON.stringify(jwtOpts, null, " ")}`);

      // jwt signing:
      const jwtToken = jwt.sign(jwtOpts, env.JWT_SECRET);

      return jwtToken;
    } catch (error) {
      // Jwt creation failed
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong with creating jwt",
        cause: error,
      });
    }
  }
};

/* -------------------------------------------------------------------------- */
const verifyPassHash = async (hashPass: string, pass: string) => {
  // If Pass exists: match passwords
  try {
    if (await argon2id.verify(hashPass, pass)) {
      // if passwords match
      return true;
    } else {
      // passwords dont match
      return false;
    }
  } catch (error) {
    // Internal password hash error
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Something when wrong with the password hash matching  with argon.",
      cause: error,
    });
  }
};
