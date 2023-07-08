import { prisma } from "@/src/server/db";
import { env } from "@/src/env.mjs";
import { TRPCError } from "@trpc/server";
import cookie from "cookie";
import { type ctxMain } from "@/src/server/api/trpc";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import jwt from "jsonwebtoken";
import type {
  IeCookie,
  AuthSesObj,
  UserType,
} from "@/src/1/gen/types/cookie";
import { objErrSes } from "../login/types";
import * as argon2id from "argon2";

dayjs.extend(utc);
dayjs.extend(timezone);

/* -------------------------------------------------------------------------- */
// Get user for auth details
export const getUserAuthBasic = async (email: string) => {
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
export const verifyPassHash = async (hashPass: string, pass: string) => {
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





/* -------------------------------------------------------------------------- */
export const jwtSign = (authed: boolean) => {
    //   not being used
    // deprec

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

