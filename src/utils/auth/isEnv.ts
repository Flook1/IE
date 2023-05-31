import { env } from "@/src/env.mjs";
import { TRPCError } from "@trpc/server";

/* -------------------------------------------------------------------------- */

export const isTest = (envSel: string) => {
  if (envSel !== "node" && envSel !== "my") {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "hard coded error on enviroment check with string passed",
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
    if (env.MY_ENV === "test") {
      return;
    } else {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only allowed in test environment",
      });
    }
  }
};

export const isDev = (envSel: string) => {
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
    if (env.MY_ENV === "dev") {
      return;
    } else {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only allowed in dev  environment",
      });
    }
  }
};

export const isProd = (envSel: string) => {
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
    if (env.MY_ENV === "prod") {
      return;
    } else {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only allowed in prod  environment",
      });
    }
  }
};


export const isStage = (envSel: string) => {
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
    if (env.MY_ENV === "stag") {
      return;
    } else {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only allowed in stag environment",
      });
    }
  }
};
