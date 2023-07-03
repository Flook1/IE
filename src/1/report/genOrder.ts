import { prisma } from "@/src/server/db";
import { type tSesObj } from "../auth/utils-server/ses";
import dayjs from "dayjs";
import { zOrderStatus } from "@/src/utils/general/zEnums";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { marginCalc, netProfitMargin } from "../gen/utils/genFinancial";

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
      id: true,
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

  // Instead of only calculating some, we are going to calculate all and then just where pick out what we do and dont need.
  interface tSumObj {
    netProfitUsd: number;
    netProfit: number;
    grossUsd: number;
    gross: number;
    // netSaleUsd: number;
    editorUserTotalUsd: number;
    editorBusTotalUsd: number;
    // usdRate:number
    ieMargin: number;
  }

  const sumObj: tSumObj = {
    netProfitUsd: 0,
    netProfit: 0,
    grossUsd: 0,
    gross: 0,
    // netSaleUsd: 0,
    editorUserTotalUsd: 0,
    editorBusTotalUsd: 0,
    // usdRate: 0,
    ieMargin: 0,
  };
  let iCount = 0;

  try {
    for (let i = 0; i < ord.length; i++) {
      const forOrd = ord[i]?.order_detail;

      if (forOrd && forOrd.length > 0)
        for (let iDets = 0; iDets < forOrd.length; iDets++) {
          const dets = forOrd[iDets];
          iCount += 1;
          sumObj.gross += Number(dets?.net_amount);
          sumObj.grossUsd += Number(dets?.usd_net_amount);
          sumObj.editorUserTotalUsd += Number(dets?.editor_user_total);
          sumObj.editorBusTotalUsd += Number(dets?.editor_bus_total);
          // useless because different order types
          // sumObj.usdRate += Number(dets?.usd_rate)/iCount;
        }
      else {
        return sumObj;
      }
    }
  } catch (e) {
    // something went wrong with summing
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong with summing on revenues",
      cause: e,
    });
  }

  // calculate margin
  const profitCalc = netProfitMargin(sumObj.grossUsd, sumObj.editorBusTotalUsd);
  sumObj.netProfitUsd = profitCalc.net;
  sumObj.ieMargin = profitCalc.margin;

  //  filter
  let filterObj = {};

  if (ses.bus_type == "ie") {
    filterObj  = {
      ...sumObj
    }
  } else if (ses.bus_type == "client") {
    const {gross} = sumObj
    filterObj = {
      gross
    }
  } else if (ses.bus_type == "editor") {
    const {editorBusTotalUsd, editorUserTotalUsd} = sumObj
    filterObj = {
      editorBusTotalUsd,
      editorUserTotalUsd
    }

  }

  return filterObj as tSumObj;
};

export { ordRev, ordStatusCount };
