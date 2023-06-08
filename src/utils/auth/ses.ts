import { prisma } from "@/src/server/db";
import { TRPCError } from "@trpc/server";
import cookie from "cookie";
import type { IeCookie, UserType, AuthSesObj } from "../general/cookie";
import { type ctxMain } from "@/src/server/api/trpc";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { TRPCClientError } from "@trpc/client";

dayjs.extend(utc);
dayjs.extend(timezone);

export const sesGet = async (opts: ctxMain) => {
  const allCookies: IeCookie = opts.req.cookies;
  const ieAuthSesCookie = allCookies.ieAuthSes;

  try {
    if (ieAuthSesCookie) {
      const sesObj = await prisma.sessions.findFirst({
        where: {
          sid: ieAuthSesCookie,
        },
        select: {
          sid: true,
          sess: true,
          expired: true,
        },
      });

      if (!sesObj?.sess) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "there is no session object in database",
        });
      }

      // todo need type of session
      const sesJson = sesObj?.sess;

      return {
        isSes: true,
        sesJson,
        sesObj,
      };
    } else {
      return {
        isSes: false,
      };
    }
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "something went wrong getting the session data from database",
      cause: error,
    });
  }
};

export const sesCreate = async (sesId: string, expire: Date) => {
  // we are jsut creating a unique id and creating a session from that
  await prisma.sessions.create({
    data: {
      sid: sesId,
      sess: {},
      expired: expire,
    },
    select: {
      sid: true,
    },
  });

  return {
    sesId,
  };
};

export const sesSetCookie = (sesId: string, expire: Date, opts: ctxMain) => {
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
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "soemthing went wrong trying to SETTING the ieauthses cookie, likely with the date",
      cause: error,
    });
  }

  return;
};

export const sesDelCookie = (sesId: string, opts: ctxMain) => {
  try {
    const dateNow = dayjs().tz("utc").toDate();
    // parse cookies
    const sesParsed = cookie.serialize("ieAuthSes", sesId, {
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
        "soemthing went wrong trying to DELETING the ieauthses cookie, likely with the date",
      cause: error,
    });
  }

  return;
};

/* -------------------------------------------------------------------------- */
export const sesSetDb = async (userId: string, sesId: string) => {
  if (!userId || !sesId) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No userId || sesId in the sesSet function",
    });
  }

  try {
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

    // update session
    // session should be created before this is called.
    if (false) {
      try {
        await prisma.sessions.update({
          where: {
            sid: sesId,
          },
          data: {
            sess: ses,
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

    // console.log("jsut before return");
    return ses;

  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong, not sure what",
      cause: error,
    });
  }

};

/* -------------------------------------------------------------------------- */
/* ---------------------------------- types --------------------------------- */
export interface TSesObj {
  sesId:          string;
  user:           User;
  bus_id:         string;
  bus_type:       string;
  user_name_full: string;
  userType:       string;
}

export interface User {
  user_id:     string;
  email_id:    string;
  name_first:  string;
  name_last:   string;
  business_id: string;
  rel_bus:     RelBus;
  role_id:     number;
  rel_role:    RelRole;
}

export interface RelBus {
  id:            string;
  owner_user_id: string;
  business_name: string;
  business_type: string;
  client_type:   null;
  payment_type:  string;
  currency_id:   number;
  rel_country:   RelCountry;
}

export interface RelCountry {
  currency_symbol: string;
  currency_code:   string;
  currency_name:   string;
}

export interface RelRole {
  id:        number;
  role_name: string;
  role_info: string;
}

