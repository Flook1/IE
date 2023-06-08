import { ctxMain } from "@/src/server/api/trpc";
import { prisma } from "@/src/server/db";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";

export interface ErrObj {
  apiName: string;
  apiStep?: string;
  internalCode?: string;
  msg: string;
  trpcCode: code;
  trpcThrow: boolean;
  sendEmail: boolean;
  dbInsert: boolean;
  inputData?: object;
}

export type code =
  | "INTERNAL_SERVER_ERROR"
  | "PARSE_ERROR"
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "METHOD_NOT_SUPPORTED"
  | "TIMEOUT"
  | "CONFLICT"
  | "PRECONDITION_FAILED"
  | "PAYLOAD_TOO_LARGE"
  | "UNPROCESSABLE_CONTENT"
  | "TOO_MANY_REQUESTS"
  | "CLIENT_CLOSED_REQUEST";

export const errLog = async (errObj: ErrObj, error: object) => {
  try {
    const dateNow = dayjs().toDate();
    const errString = JSON.stringify(error);
    // insert into db
    if (errObj.dbInsert) {
      const logInsert = await prisma.log_api.create({
        data: {
          created_on: dateNow,
          errors: errString,
          log_id: errObj.internalCode,
          server_action: errObj.apiName,
          remarks: errObj,
        },
        select: {
          id: true,
        },
      });
    }

    // send email if true:
    if (errObj.sendEmail) {
      // send email
    }

    if (errObj.trpcThrow) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "something here",
        cause: error,
      });
    } else {
      return;
    }
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error on errLog inputing into database",
      cause: error,
    });
  }
};
