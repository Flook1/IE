import { env } from "@/src/env.mjs";
import { prisma } from "@/src/server/db";
import { TRPCError } from "@trpc/server";
import * as argon2id from "argon2";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
export const authLoginRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1).max(25),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // check if email exists
      const userData = await getUserAuthBasic(input.email);

      // check if password exists
      if (userData?.pass == null) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No Password on record",
        });
      }

      const passMatch = verifyPassHash(userData.pass, input.password);

      let jwtToken;
      if (passMatch) {
        jwtToken = jwtSign(true);
        // Set cookie
        if (!jwtToken) {
          // Token had an error
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Jwt Token creation had an error",
          });
        }
        // setting cookie
        console.log("setting cookie")
        Cookies.set("ie-au", jwtToken, {
          expires: 30,
          // sameSite: "strict",
          // secure: true,
          // HttpOnly: true,
        });
      } else {
        // Passwords dont match
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Passwords didn't match",
        });
      }

      return {
        userData,
        jwtToken,

      };
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
const verifyPassHash = (hashPass: string, pass: string) => {
  // If Pass exists: match passwords
  try {
    // if (await argon2id.verify(hashPass, pass)) {
    if (true) {
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
