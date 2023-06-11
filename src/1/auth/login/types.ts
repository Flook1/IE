import { env } from "@/src/env.mjs";
import { z } from "zod";

// Zod validations
export const zLoginForm = z.object({
  email: z
    .string()
    .min(2, {
      message: "not enough characters",
    })
    .email()
    .toLowerCase(),
  password: z
    .string()
    .min(Number(env.NEXT_PUBLIC_PASS_MIN))
    .max(Number(env.NEXT_PUBLIC_PASS_MAX)),
});
export type tLoginForm = z.infer<typeof zLoginForm>;

// error types
export type tErrAuth =
  | "No password on record"
  | "Incorrect Credentials"
  | "Reset Password Token Not Valid"
  | "Email Token Not Valid"
  | "Email Already Verified"
  | "Passwords Don't Match"

  export const objErrAuth = {
    NoPass: "No Password On Record",
    Creds: "Incorrect Credentials",
    ResetToken: "Reset Password Token Not Valid",
    EmailToken: "Email Token Not Valid",
    EmailVerified: "Email Already Verified",
    PassDontMatch: "Passwords Don't Match",
  }

