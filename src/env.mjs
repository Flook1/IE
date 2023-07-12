import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production", "staging"]),
    // MY_ENV: z.enum(["dev", "test", "prod", "stag"]).default("dev"),
    DATABASE_URL: z.string().url().min(1),
    JWT_SECRET: z.string().min(1),
    // Add `.min(1) on ID and SECRET if you want to make sure they're not empty

    // Stripe
    STRIPE_SECRET_KEY: z.string().min(1),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
    NEXT_PUBLIC_MY_ENV: z.enum(["development", "test", "production", "staging"]).default("development"),
    NEXT_PUBLIC_PASS_MIN: z.string().min(1),
    NEXT_PUBLIC_PASS_MAX: z.string().min(1),
    NEXT_PUBLIC_PASS_SYMBOL: z.string().min(1),
    NEXT_PUBLIC_PASS_NUMBER: z.string().min(1),
    NEXT_PUBLIC_PASS_CAPITAL: z.string().min(1),
    // stripe
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),

  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    // MY_ENV: process.env.MY_ENV,
    NEXT_PUBLIC_MY_ENV: process.env.MY_ENV,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    // Pass info:
    NEXT_PUBLIC_PASS_MIN: process.env.NEXT_PUBLIC_PASS_MIN,
    NEXT_PUBLIC_PASS_MAX: process.env.NEXT_PUBLIC_PASS_MAX,
    NEXT_PUBLIC_PASS_SYMBOL: process.env.NEXT_PUBLIC_PASS_SYMBOL,
    NEXT_PUBLIC_PASS_NUMBER: process.env.NEXT_PUBLIC_PASS_NUMBER,
    NEXT_PUBLIC_PASS_CAPITAL: process.env.NEXT_PUBLIC_PASS_CAPITAL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
