import { prisma } from "@/src/server/db";
import { TRPCError } from "@trpc/server";
import cookie from "cookie";
import { type ctxMain } from "@/src/server/api/trpc";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type {
  IeCookie,
  AuthSesObj,
  UserType,
} from "@/src/utils/general/cookie";
import { objErrSes } from "../login/types";
import { boolean } from "zod";

dayjs.extend(utc);
dayjs.extend(timezone);

/* -------------------------------------------------------------------------- */

export const sesCheck = async (
  opts: ctxMain,
  verify: boolean,
  throwErr: boolean
) => {
  const dateJs = dayjs();
  const dateNow = dateJs.format();

  const allCookies: IeCookie = opts.req.cookies;

  const ieAuthSesCookie = allCookies.ieAuthSes;

  // console.log(ieAuthSesCookie)
  // console.log(verify)
  let success = false;

  if (!ieAuthSesCookie) {
    if (throwErr) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: objErrSes.NoCookie,
      });
    } else {
      success = false;
      return success;
    }
  }

  if (!verify) {
    // console.log("exists, dont need to validate");
    // exists return
    success = true;
    return success;
  }

  if (verify) {
    const sesGetCheck = await prisma.sessions.findFirst({
      where: {
        sid: ieAuthSesCookie,
        expires_on: {
          gte: dateNow,
        },
        deleted_on: null,
      },
      select: { sid: true },
    });

    if (!sesGetCheck) {
      if(throwErr) {

        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: objErrSes.SesNotValid,
        });
      } else {
        success = false
        return success
      }
    } else {
      success = true;
      return success;
    }
  }

  return success;
};

export const sesGet = async (opts: ctxMain) => {
  const dateJs = dayjs();
  const dateNow = dateJs.format();

  const allCookies: IeCookie = opts.req.cookies;
  const ieAuthSesCookie = allCookies.ieAuthSes;

  if (ieAuthSesCookie) {
    const sesObj = await prisma.sessions.findFirst({
      where: {
        sid: ieAuthSesCookie,
        expires_on: { gte: dateNow },
        deleted_on: null,
      },
      select: {
        sid: true,
        sess: true,
        expires_on: true,
      },
    });

    if (!sesObj || !sesObj?.sess) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: objErrSes.SesNotValid,
      });

      // we should trigger session update
    }

    // setting type for session object
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const sesJson: TSesObj = sesObj?.sess as any;

    return {
      isSes: true,
      sesJson,
      sesObj,
    };
  }

  if (!ieAuthSesCookie) {
    return {
      isSes: false,
    };
  }
};

export const sesCreate = async (sesId: string, expires: Date) => {
  // we are jsut creating a unique id and creating a session from that
  await prisma.sessions.create({
    data: {
      sid: sesId,
      sess: {},
      expires_on: expires,
    },
    select: {
      sid: true,
    },
  });

  return {
    sesId,
  };
};

export const sesSetCookie = (opts: ctxMain, sesId: string, expire: Date) => {
  console.log("setting cookie");

  // parse cookies
  try {
    const sesParsed = cookie.serialize("ieAuthSes", sesId, {
      httpOnly: true,
      path: "/",
      sameSite: true,
      secure: false,
      expires: expire,
    });

    opts.res.setHeader("set-cookie", [sesParsed]);

    return;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "soemthing went wrong trying to SETTING the ieauthses cookie, likely with the date",
      cause: error,
    });
  }
};

export const sesDelCookie = async (opts: ctxMain, sesId?: string) => {
  // get cookie id
  let ses_id: string;
  if (sesId) {
    ses_id = sesId;
  } else {
    const allCookies: IeCookie = opts.req.cookies;
    if (!allCookies.ieAuthSes) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "cookie doesnt exist",
      });
    }
    ses_id = allCookies.ieAuthSes;
  }

  // delete cookie
  try {
    const dateNow = dayjs().tz("utc").toDate();
    // delete from prisma
    await prisma.sessions.update({
      where: {
        sid: ses_id,
      },
      data: {
        deleted_on: dateNow,
      },
    });
    // parse cookies
    const sesParsed = cookie.serialize("ieAuthSes", ses_id, {
      httpOnly: true,
      path: "/",
      sameSite: true,
      secure: false,
      expires: dateNow,
    });

    opts.res.setHeader("set-cookie", [sesParsed]);
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "something went wrong trying to DELETING the ieauthses cookie, likely with the date",
      cause: error,
    });
  }

  return { success: true };
};

/* -------------------------------------------------------------------------- */
export const sesSetDb = async (
  opts: ctxMain,
  userId: string,
  sesId: string
) => {
  if (!userId || !sesId) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No userId || sesId in the sesSet function",
    });
  }

  const user = await prisma.user_main.findFirst({
    where: {
      user_id: userId,
    },
    select: {
      user_id: true,
      email_id: true,
      name_first: true,
      name_last: true,
      business_id: true,
      email_verified: true,
      // business details
      rel_bus: {
        select: {
          id: true,
          owner_user_id: true,
          business_name: true,
          business_type: true,
          client_type: true,
          payment_type: true,
          currency_id: true,
          rel_country: {
            select: {
              currency_symbol: true,
              currency_code: true,
              currency_name: true,
            },
          },
        },
      },
      // role section
      role_id: true,
      rel_role: {
        select: {
          id: true,
          role_name: true,
          role_info: true,
        },
      },
    },
  });

  // Now lets setup the conditional informaiton for ses
  // Obj start
  const bus_id: string | undefined = user?.rel_bus?.id;
  const bus_type: string | undefined = user?.rel_bus?.business_type;

  const user_name_full: string | undefined =
    user?.name_first && user?.name_last
      ? user.name_first + user.name_last
      : "Unknown";

  // user type, sub user type
  let userType: UserType = null;

  const isManager = await prisma.user_parent_child.findMany({
    where: {
      parent_user_id: userId,
      deleted_on: null,
    },
    select: {
      child_user_id: true,
      parent_user_id: true,
    },
  });

  console.log(`isManager, count more than 0 | countIs:  ${isManager.length}`);

  if (user?.rel_bus?.business_type == "client") {
    if (user.user_id == user.rel_bus.owner_user_id) {
      // if passed means is owner
      userType = "client owner";
    } else {
      if (isManager.length > 0) {
        userType = "client manager";
      } else {
        userType = "client team";
      }
    }
  }

  // Editor check
  if (user?.rel_bus?.business_type == "editor") {
    if (user.user_id == user.rel_bus.owner_user_id) {
      // if passed means is owner
      userType = "editor owner";
    } else {
      if (isManager.length > 0) {
        userType = "editor manager";
      } else {
        userType = "editor team";
      }
    }
  }

  // ie check
  if (user?.rel_bus?.business_type == "ie") {
    if (user.user_id == user.rel_bus.owner_user_id) {
      // if passed means is owner
      userType = "ie owner";
    } else {
      userType = "ie team";
    }
  }

  // combine session object:
  const ses = {
    sesId,
    user,
    bus_id,
    bus_type,
    user_name_full,
    userType,
  };

  // console.log(`ses object | ${JSON.stringify(ses, null, " ")}`);
  // this is just to stop type error in prisma insert
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sesInsert: any = ses;
  // update session
  if (true) {
    try {
      await prisma.sessions.update({
        where: {
          sid: sesId,
        },
        data: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          sess: sesInsert,
        },
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Error trying to update session object, maybe cant find the session id",
        cause: error,
      });
    }
  }

  // console.log("just before return");
  return ses;
};

/* -------------------------------------------------------------------------- */
/* ---------------------------------- types --------------------------------- */

/* -------------------------------------------------------------------------- */

// Type check object below

// Ses object
export interface TSesObj {
  sesId: string;
  user: User;
  bus_id: string;
  bus_type: string;
  user_name_full: string;
  userType: string;
}

export interface User {
  user_id: string;
  email_id: string;
  name_first: string;
  name_last: string;
  business_id: string;
  rel_bus: RelBus;
  role_id: number;
  rel_role: RelRole;
}

export interface RelBus {
  id: string;
  owner_user_id: string;
  business_name: string;
  business_type: string;
  client_type: null;
  payment_type: string;
  currency_id: number;
  rel_country: RelCountry;
}

export interface RelCountry {
  currency_symbol: string;
  currency_code: string;
  currency_name: string;
}

export interface RelRole {
  id: number;
  role_name: string;
  role_info: string;
}
