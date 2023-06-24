import { env } from "@/src/env.mjs";
import * as zEnum from "@/src/utils/general/zEnums";
import { z } from "zod";

// Zod validations

// Error objects

export const objErrAuth = {
  NoPass: "No Password On Record",
  Creds: "Incorrect Credentials",
  ResetToken: "Reset Password Token Not Valid",
  EmailToken: "Email Token Not Valid",
  EmailVerified: "Email Already Verified",
  EmailUsed: "Email Already Used",
  PassDontMatch: "Passwords Don't Match",
  RoleIdMismatch: "Couldn't Find role id, in the qRole",
  CurrMissing: "Couldn't Get Currency From qCurrSel query",
} as const;
export type tErrAuth = typeof objErrAuth;

export const objErrSes = {
  SesNotValid: "Not Valid Session",
  NoCookie: "No Session Cookie",
};
export type tErrSes = "Not Valid Session" | "No Session Cookie";

/* -------------------------------------------------------------------------- */
// login form
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
export type tResetPassUpdate = z.infer<typeof zResetPassUpdate>;

export const zResetTokenVerify = z.object({
  resetToken: z.string().uuid(),
});
export type tResetTokenVerify = z.infer<typeof zResetTokenVerify>;

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
// sign up stuff

export const zSignUpForm = z.object({
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
  clientType: zEnum.zClientType.optional(),
  busType: zEnum.zBusType,
  busName: z.string().min(1).max(25).toLowerCase(),
  payType: zEnum.zPayType.optional(),
  curr: zEnum.zCurrCode,
});

export type tSignUpForm = z.infer<typeof zSignUpForm>;