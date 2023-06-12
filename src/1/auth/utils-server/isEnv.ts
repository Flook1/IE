import { env } from "@/src/env.mjs";
import { TRPCError } from "@trpc/server";

/* -------------------------------------------------------------------------- */
type EnvSel = "my" | "node";
type EnvType = "development" | "test" | "production" | "staging";

export const isEnv = (
  envSel: EnvSel,
  envType: EnvType,
  throwError: boolean
) => {
  if (envSel !== "node" && envSel !== "my") {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "hard coded error on enviroment check with string passed",
    });
  }

  let allowed = false

  if (envSel === "node") {
    if (env.NODE_ENV === envType) {
      allowed = true;
    } else {
      allowed = false;
    }
  } else if (envSel === "my") {
    if (env.NEXT_PUBLIC_MY_ENV === envType) {
      allowed = true;
    } else {
      allowed = false;
    }
  }

  if (throwError && !allowed) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Only allowed in ${envType} environment`,
    });
  } else {
    return allowed;
  }
};

export const isTest = (envSel: EnvSel) => {
  if (envSel !== "node" && envSel !== "my") {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "hard coded error on environment check with string passed",
    });
  }

  if (envSel === "node") {
    if (env.NODE_ENV === "test") {
      return;
    } else {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only allowed in test environment",
      });
    }
  } else if (envSel === "my") {
    if (env.NEXT_PUBLIC_MY_ENV === "test") {
      return;
    } else {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only allowed in test environment",
      });
    }
  }
};

export const isDev = (envSel: EnvSel) => {
  if (envSel !== "node" && envSel !== "my") {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "hard coded error on enviroment check with string passed",
    });
  }

  if (envSel === "node") {
    if (env.NODE_ENV === "development") {
      return;
    } else {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only allowed in development  environment",
      });
    }
  } else if (envSel === "my") {
    if (env.NEXT_PUBLIC_MY_ENV === "development") {
      return;
    } else {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only allowed in dev  environment",
      });
    }
  }
};

export const isProd = (envSel: EnvSel) => {
  if (envSel !== "node" && envSel !== "my") {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "hard coded error on enviroment check with string passed",
    });
  }

  if (envSel === "node") {
    if (env.NODE_ENV === "production") {
      return;
    } else {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only allowed in production environment",
      });
    }
  } else if (envSel === "my") {
    if (env.NEXT_PUBLIC_MY_ENV === "production") {
      return;
    } else {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only allowed in prod  environment",
      });
    }
  }
};

export const isStage = (envSel: EnvSel) => {
  if (envSel !== "node" && envSel !== "my") {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "hard coded error on enviroment check with string passed",
    });
  }

  if (envSel === "node") {
    if (env.NODE_ENV === "staging") {
      return;
    } else {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only allowed in staging environment",
      });
    }
  } else if (envSel === "my") {
    if (env.NEXT_PUBLIC_MY_ENV === "staging") {
      return;
    } else {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only allowed in stag environment",
      });
    }
  }
};