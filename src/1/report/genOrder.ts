import { prisma } from "@/src/server/db";
import { type tSesObj } from "../auth/utils-server/ses";
import dayjs from "dayjs";
import { zOrderStatus } from "@/src/utils/general/zEnums";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

const zOrdCountType = z.enum([
  "all",
  "overdue",
  "processing",
  "almost overdue",
  "total comp all",
  "total comp between",
  "not assigned",
  "zipping",
]);
type tOrdCountType = z.infer<typeof zOrdCountType>;

const ordStatusCount = async (
  ses: tSesObj,
  checkType: tOrdCountType,
  dateStart?: string,
  dateEnd?: string
) => {
  const currentDate = dayjs();

  let statusArray: Array<string> = [""];
  if (checkType == "overdue" || checkType == "almost overdue") {
    statusArray = [
      zOrderStatus.Enum.processing,
      zOrderStatus.Enum["quality control"],
    ];
  } else if (checkType == "processing") {
    statusArray = [zOrderStatus.Enum.processing];
  } else if (
    checkType == "total comp between" ||
    checkType == "total comp all"
  ) {
    statusArray = [zOrderStatus.Enum.completed];
  } else if (checkType == "not assigned") {
    statusArray = [zOrderStatus.Enum.requested];
  } else if (checkType == "zipping") {
    statusArray = [zOrderStatus.Enum.zipping];
  } else if (checkType == "all") {
    statusArray = [
      zOrderStatus.Enum.adjustment,
      zOrderStatus.Enum.cancelled,
      zOrderStatus.Enum.checkout,
      zOrderStatus.Enum.completed,
      zOrderStatus.Enum.processing,
      zOrderStatus.Enum["quality control"],
      zOrderStatus.Enum.requested,
      zOrderStatus.Enum.zipping,
    ];
  }

  const busType = ses.bus_type;
  const busId = ses.bus_id;
  const userType = ses.userType;
  const userId = ses.user.user_id;

  if (busType != "client" && busType != "editor" && busType != "ie") {
    // means its customer business or null, so error out
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Contact Image Edits. ses doesnt have business type.",
    });
  }

  const ordCount = await prisma.order_main.count({
    where: {
      ...(busType == "client" &&
      (userType == "client owner" || userType == "client manager")
        ? {
            client_business_id: busId,
          }
        : {}),
      ...(busType == "client" && userType == "client team"
        ? {
            client_business_id: busId,
            client_user_id: userId,
          }
        : {}),
      ...(busType == "editor" &&
      (userType == "editor owner" || userType == "editor manager")
        ? {
            editor_business_id: busId,
          }
        : {}),
      ...(busType == "editor" && userType == "editor team"
        ? {
            editor_business_id: busId,
            editor_user_id: userId,
          }
        : {}),
      rel_OrderState: {
        state_name: { in: statusArray },
      },
      ...(checkType == "overdue"
        ? {
            date_due_on: {
              lte: currentDate.toString(),
            },
          }
        : {}),
      ...(checkType == "almost overdue"
        ? {
            AND: {
              date_due_on: {
                gte: currentDate.subtract(1, "h").toString(),
                lte: currentDate.toString(),
              },
            },
          }
        : {}),
      ...(checkType == "total comp between"
        ? {
            AND: {
              date_due_on: {
                gte: dateStart,
                lte: dateEnd,
              },
            },
          }
        : {}),
      deleted_on: { equals: null },
    },
  });

  return ordCount;
};

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

const zRevReport = z.enum([
  "profit",
  "profitUsd",
  "net",
  "netUsd",
  "editorTotal",
  "editorBusTotal",
]);
type tRevReport = z.infer<typeof zRevReport>;

const ordRev = async (
  ses: tSesObj,
  reportType: tRevReport,
  dateStart: string,
  dateEnd: string
) => {
  const { bus_type, bus_id, userType } = ses;
  const { user_id } = ses.user;

  if (bus_type != "client" && bus_type != "editor" && bus_type != "ie") {
    // means its customer business or null, so error out
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Contact Image Edits. ses doesnt have business type.",
    });
  }

  const ord = await prisma.order_main.findMany({
    select: {
      order_detail: {
        select: {
          usd_rate: true,
          gross_amount: true,
          net_amount: true,
          usd_net_amount: true,
          editor_bus_total: true,
          editor_user_total: true,
        },
      },
    },
    where: {
      rel_OrderState: {
        state_name: { equals: zOrderStatus.Enum.completed },
      },
      ...(bus_type == "client" &&
      (userType == "client owner" || userType == "client manager")
        ? {
            client_business_id: bus_id,
          }
        : {}),
      ...(bus_type == "client" && userType == "client team"
        ? {
            client_business_id: bus_id,
            client_user_id: user_id,
          }
        : {}),
      ...(bus_type == "editor" &&
      (userType == "editor owner" || userType == "editor manager")
        ? {
            editor_business_id: bus_id,
          }
        : {}),
      ...(bus_type == "editor" && userType == "editor team"
        ? {
            editor_business_id: bus_id,
            editor_user_id: user_id,
          }
        : {}),

      // dates
      date_completed_on: {
        gte: dateStart,
        lte: dateEnd,
      },
    },
  });

  //todo need to sum the totals

  return;
};

export { ordRev, ordStatusCount };
