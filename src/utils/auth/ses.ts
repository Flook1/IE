import { prisma } from "@/src/server/db";
import { TRPCError } from "@trpc/server";
import { unknown } from "zod";
import type { UserType } from "../general/cookie";

// set session or update session, will update session if session passed.

export const sesCreate = async (sesId: string, expire: Date) => {
  // we are jsut creating a unique id and creating a session from that
  await prisma.sessions.create({
    data: {
      sid: sesId,
      sess: {},
      expired: expire
    }
  })

  return
}


export const sesSet = async (userId: string, sesId: string) => {
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

  // First lets get the user object

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

  console.log(`isManager, count more than 0 ${isManager.length}`);

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

  // combine session object:
  const ses = {
    sesId,
    user,
    bus_id,
    bus_type,
    user_name_full,
    userType,
  };

  console.log(`ses object | ${JSON.stringify(ses, null, " ")}`);

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
      });
    }
  }

  return ses;
};
