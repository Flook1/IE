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
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(Number(env.NEXT_PUBLIC_PASS_MIN))
    .max(Number(env.NEXT_PUBLIC_PASS_MAX)),
});
export type tLoginForm = z.infer<typeof zLoginForm>;

// error types
// export type tErrAuth =
  // | "No password on record"
  // | "Incorrect Credentials"
  // | "Reset Password Token Not Valid"
  // | "Email Token Not Valid"
  // | "Email Already Verified"
  // | "Passwords Don't Match";
export type tErrAuth = typeof objErrAuth

export const objErrAuth = {
  NoPass: "No Password On Record",
  Creds: "Incorrect Credentials",
  ResetToken: "Reset Password Token Not Valid",
  EmailToken: "Email Token Not Valid",
  EmailVerified: "Email Already Verified",
  PassDontMatch: "Passwords Don't Match",
} as const;

export type tErrSes = "Not Valid Session" | "No Session Cookie";
export const objErrSes = {
  SesNotValid: "Not Valid Session",
  NoCookie: "No Session Cookie",
};

/* -------------------------------------------------------------------------- */
// For reset forms
// Zod validations
export const zResetPassForm = z.object({
  email: z
    .string()
    .min(2, {
      message: "not enough characters",
    })
    .email()
    .toLowerCase()
    .trim(),
});
export type tResetPassForm = z.infer<typeof zResetPassForm>;

export const zResetPassUpdate = z.object({
  passwordToken: z.string().uuid(),
  password: z
    .string()
    .min(Number(env.NEXT_PUBLIC_PASS_MIN))
    .max(Number(env.NEXT_PUBLIC_PASS_MAX)),
  passwordConfirm: z
    .string()
    .min(Number(env.NEXT_PUBLIC_PASS_MIN))
    .max(Number(env.NEXT_PUBLIC_PASS_MAX)),
});
export type tResetPassUpdate = z.infer<typeof zResetPassUpdate>

export const zResetTokenVerify = z.object({
  resetToken: z.string().uuid()
})
export type tResetTokenVerify = z.infer<typeof zResetTokenVerify>