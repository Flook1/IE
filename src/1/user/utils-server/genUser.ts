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

export const userList = async (
  ctx: ctxMain,
  ses: tSesFull,
  take: number,
  page: number,
  search: string | null
) => {
  const pageOffset = page * take;

  const sesUserObj = ses.sesJson?.user;
  const sesRoleName = ses.sesJson?.user.rel_role.role_name;

  const busId = ses.sesJson?.bus_id;

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
      AND: [
        {
          ...(search
            ? {
                OR: [
                  { user_id: search },
                  { name_first: search },
                  { name_last: search },
                  {rel_bus: {business_name: search}},
                  {rel_bus: {id: search}},
                ],
              }
            : {}),
        },
        {
          OR: [
            {
              ...(sesRoleName !== "ie_admin" && sesRoleName !== "ie_user"
                ? { user_id: sesUserObj?.user_id }
                : {}),
            },
            {
              ...(sesRoleName == "ie_admin" || sesRoleName == "ie_user"
                ? { updated_on: { not: null } }
                : {}),
            },
          ],
        },
      ],
    },
    orderBy: {
      name_first: "asc",
    },
    take: take,
    skip: pageOffset,
  });

  return { list };
};

