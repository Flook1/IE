import { prisma } from "@/src/server/db";
import { z } from "zod";
import { type tSesFull, type tSesJson } from "../../auth/utils-server/ses";
import { type tBusType } from "@/src/utils/general/zEnums";
import dayjs from "dayjs";
import { type ctxMain, type ctxSes } from "@/src/server/api/trpc";

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

const zUserGenType = z.enum([
  "total members",
  "new members",
  "inactive members",
]);
type tUserGenType = z.infer<typeof zUserGenType>;

export const userCount = async (
  ses: tSesJson,
  checkType: tUserGenType,
  busType?: tBusType,
  dateStart?: string,
  dateEnd?: string
) => {
  const currentDate = dayjs();

  const userCount = await prisma.user_main.count({
    where: {
      deleted_on: null,
      ...(ses.bus_type != "ie"
        ? {
            business_id: ses.bus_id,
          }
        : {}),
      ...(checkType == "inactive members"
        ? {
            last_login_time: {
              lte: currentDate.subtract(7, "d").toISOString(),
            },
          }
        : {}),
      ...(busType
        ? {
            rel_bus: {
              business_type: busType,
            },
          }
        : {}),
      ...(dateStart
        ? {
            created_on: {
              gte: dateStart,
              lte: dateEnd,
            },
          }
        : {}),
    },
  });

  return userCount;
};

export const userList = async (ctx: ctxMain, ses: tSesFull) => {
  const currUserId = ses.sesJson?.user.user_id;
  const currUserRole = ses.sesJson?.user.rel_role.role_name;
  const busId = ses.sesJson?.bus_id;

  const isIe = currUserRole == "ie_admin" || currUserRole == "editor_user";

  const list = await prisma.user_main.findMany({
    select: {
      user_id: true,
      name_first: true,
      name_last: true,
      email_id: true,
      rel_bus: {
        select: {
          id: true,
          business_name: true,
        },
      },
      rel_role: {
        select: {
          id: true,
          role_name: true,
        },
      },
    },
    where: {
      OR: [
        {...(isIe == false ? { user_id: currUserId } : {})},
        {...(isIe == true ? { updated_on: {not: null} } : {})},
      ],
    },
    orderBy: {
      name_first: "asc",
    },
    take: 25,
    skip: 0,
  });

  return list;
};
