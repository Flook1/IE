import { prisma } from "@/src/server/db";
import { TRPCError } from "@trpc/server";
import cookie from "cookie";
import { type ctxMain } from "@/src/server/api/trpc";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type { IeCookie, AuthSesObj, UserType } from "@/src/1/gen/types/cookie";
import { objErrSes } from "../login/types";
import {
  type tPayType,
  type tBusType,
  type tCurrCode,
  type tRoles,
  type tClientType,
} from "@/src/1/gen/utils/zEnums";

dayjs.extend(utc);
dayjs.extend(timezone);

/* -------------------------------------------------------------------------- */

export const sesQuickCheckThrow = (sesValid: boolean) => {
  if (!sesValid) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: objErrSes.SesNotValid,
    });
  }

  // todo
  // should maybe check the session structure
  // but this would require Query, so maybe better on the context part
  // question On your statement above, are you using Query as React Query or are you saying you would need to do a query?
  // answer in this case, since this is used server side, nto client side.  query would mean prisma query to get session, and we could check structure of json, thats mainly to check if something went wrong, not too important yet
};

export const sesCheck = async (
  opts: ctxMain,
  // question Is verify here like user email verified or?
  // answer verify here means, to not just check the session using a prisma query to actually make sure it exists in database, otherwise we are just cehcking the session cookie is there. (verify would take much longer, and this generally wouldnt need to be done if this was already checked on trpc procedure that already checks session.)
  verify: boolean,
  throwErr: boolean
) => {
  const dateJs = dayjs();
  const dateNow = dateJs.toISOString();

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
      if (throwErr) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: objErrSes.SesNotValid,
        });
      } else {
        success = false;
        return success;
      }
    } else {
      success = true;
      return success;
    }
  }

  return success;
};

export const sesGet = async (opts: ctxMain, throwErr: boolean) => {
  const dateJs = dayjs();
  const dateNow = dateJs.format();

  const allCookies: IeCookie = opts.req.cookies;
  const ieAuthSesCookie = allCookies.ieAuthSes;

  if (ieAuthSesCookie) {
    const sesObjData = await prisma.sessions.findFirst({
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

    if (!sesObjData || !sesObjData?.sess) {
      if (throwErr) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: objErrSes.SesNotValid,
        });
        // we should trigger session update
        // todo
      } else {
        return {
          isSes: false,
        };
      }
    }

    // setting type for session object

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const sesJson: tSesJson = sesObjData?.sess as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const sesObj: tSesObj = sesObjData as any;

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
  // we are just creating a unique id and creating a session from that
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
      message: objErrSes.CookieParse,
      cause: error,
    });
  }
};

// question Could you simplify on how this deletes the session cookie? I don't understand it very well
// answer okay, ive added extra comments below
export const sesDelCookie = async (opts: ctxMain, sesId?: string) => {
  // sesId optional, this is for when admin wants to sign out specific users. otherwise just get current user session id

  // get cookie ses id
  let ses_id: string;
  if (sesId) {
    // if ses id passed, set that to the ses_id var above
    ses_id = sesId;
  } else {
    // if ses not passed, we need to get the ses_id from cookies

    const allCookies: IeCookie = opts.req.cookies;

    if (!allCookies.ieAuthSes) {
      // question Should this still be here since VSCode is saying it's unreachable code?
      // answer we can likely delete this, i just havent yet. i was throwing error initally but if there is no auth cookie, then there is no signed in user anyway, so dont really need to throw error, we can just return earlier.
      if (false) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: objErrSes.NoCookie,
        });
      }
      // dont need to throw error, instead just return with message
      return {
        success: true,
        message: objErrSes.NoCookie,
      };
    }
    ses_id = allCookies.ieAuthSes;
  }

  //we now has ses_id of what we want to delete.
  // first make sure ses_id is in database

  // delete cookie
  const dateNow = dayjs().tz("utc");
  // check if ses exists on database
  const sesExists = await prisma.sessions.findFirst({
    select: {
      sid: true,
    },
    where: {
      sid: ses_id,
    },
  });

  // if its in database, we are going to update it, and change deleted date to now, so any futher queries for active session id, this one wont be included, because its deleted.
  if (sesExists?.sid) {
    // delete from prisma
    const updateSes = await prisma.sessions.update({
      where: {
        sid: ses_id,
      },
      data: {
        deleted_on: dateNow.toISOString(),
      },
    });
  }

  // we have deleted from database, now we need to adjust client side to remove the cookie
  // to do this, we response with a cookie of same name, and just exire date of now, so when client gets it, it will be removed from the client browser because it expired.
  try {
    // need to adjust cookie anyway, because we checked if cookie exists above
    // parse cookies
    const sesParsed = cookie.serialize("ieAuthSes", ses_id, {
      httpOnly: true,
      path: "/",
      sameSite: true,
      secure: false,
      expires: dateNow.toDate(),
    });

    opts.res.setHeader("set-cookie", [sesParsed]);
  } catch (error) {
    // hopefully this error will never happen but idk
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: objErrSes.CookieParse,
      cause: error,
    });
  }

  return { success: true, message: "all good" };
};

/* -------------------------------------------------------------------------- */
// question What is  used for?
// answer not used yet, but the idea is we will need to update the session json/obj in database, if the user data changes, example if someone changes role/any of data in ses json changes, we need to update it.
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

  // Now lets setup the conditional information for ses
  // Obj start
  const bus_id: string | undefined = user?.rel_bus?.id;
  const bus_type: tBusType | undefined = user?.rel_bus?.business_type;

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
// Returned Type
// type tSesObj23 = UnwrapPromise<ReturnType<typeof sesGet>>;

// question what is the use of these triple manuals?
// answer when you see me do comments like that, its just point out something obvious to me that i should recognise quickly. in this case, below the types are manully typed out, but ideally id like to move this to inferred types, but haven't been able to figure it out yet.

// MANUAL
// MANUAL
// MANUAL
// Ses object

// ses full object
export type tSesFull =
  | {
      isSes: boolean;
      sesJson?: tSesJson;
      sesObj?: tSesObj;
    }
  | {
      isSes: boolean;
      sesJson: undefined;
      sesObj: undefined;
    };

export type tSesObj = {
  sid: string;
  sess: tSesJson;
  expires_on: Date;
};

// session json
// question In this types, does bus mean business?
// answer bus means business yes. Ill try to get a list together of commonly named abbreviations i use. If you prefer i am happy to move away from abbreviations, i rather be verbose if its more clear

// question Why are some of the naming conventions here camel case and snake case?
// answer error from me, i just named a variable in functions above with camelcase, however everything else in the type is from database, which uses snake_case. So my error.
export type tSesJson = {
  sesId: string;
  user: User;
  bus_id: string;
  bus_type: tBusType;
  user_name_full: string;
  userType: UserType;
};

export type User = {
  user_id: string;
  email_id: string;
  name_first: string;
  name_last: string;
  business_id: string;
  rel_bus: RelBus;
  role_id: number;
  rel_role: RelRole;
};

export type RelBus = {
  id: string;
  owner_user_id: string;
  business_name: string;
  business_type: string;
  // client_type: null;
  client_type: tClientType;
  payment_type: tPayType;
  currency_id: number;
  rel_country: RelCountry;
};

export type RelCountry = {
  currency_symbol: string;
  currency_code: tCurrCode;
  currency_name: string;
};

export type RelRole = {
  id: number;
  role_name: tRoles;
  role_info: string;
};
