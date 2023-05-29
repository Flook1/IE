import { env } from "@/src/env.mjs";
import { TRPCError } from "@trpc/server";

/* -------------------------------------------------------------------------- */

export const isTest = () => {
  if (env.NODE_ENV === "test") {
    return;
  } else {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only allowed in test enviroment",
    });
  }
};


export const isDev = () => {
    if (env.NODE_ENV === "development") {
      return;
    } else {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only allowed in production enviroment",
      });
    }
  };


export const isProduction = () => {
  if (env.NODE_ENV === "production") {
    return;
  } else {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only allowed in production enviroment",
    });
  }
};
