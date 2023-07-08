import { prisma } from "@/src/server/db";
import { type tSesJson } from "../auth/utils-server/ses";
import dayjs from "dayjs";
import { zOrderStatus } from "@/src/1/gen/utils/zEnums";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ordRev, ordStatusCount } from "./genOrder";
import { dateGenUtc } from "../gen/utils/genDates";
import { userCount } from "../user/utils-server/genUser";

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

export const dashFunc = async (ses: tSesJson) => {
  // Working
  /* ------------------------------------------------------------------------ */

  const totalRevAllTime = await ordRev(
    ses,
    dateGenUtc.allTimeStart.toISOString(),
    dateGenUtc.dateNow.toISOString()
  );

  const totalRevThisMonth = await ordRev(
    ses,
    dateGenUtc.thisMonthStart.toISOString(),
    dateGenUtc.thisMonthEnd.toISOString()
  );
  const totalRevLastMonth = await ordRev(
    ses,
    dateGenUtc.lastMonthStart.toISOString(),
    dateGenUtc.lastMonthEnd.toISOString()
  );

  const revTotal6MonthAgo = await ordRev(
    ses,
    dateGenUtc.thisMonthStart.subtract(4, "M").toISOString(),
    dateGenUtc.thisMonthEnd.subtract(4, "M").toISOString()
  );

  const avgRevDayThisMonth =
    totalRevThisMonth.grossUsd / dateGenUtc.thisMonthDaysSoFar;
  const avgRevDayLastMonth =
    totalRevLastMonth.grossUsd / dateGenUtc.lastMonthDaysTotal;
  const avgRevDay6Month =
    revTotal6MonthAgo.grossUsd / dateGenUtc.lastMonthDaysTotal;

  /* ------------------------------------------------------------------------ */
  // outstanding order stuff

  const {
    ordCountLastMonth,
    ordCountNotAssigned,
    ordCountProcessing,
    ordCountThisMonth,
    ordCountToday,
    ordCountAll,
    avgOrdDayLastMonth,
    avgOrdDayThisMonth,
  } = await ordTotals(ses);

  const { memClient, memInactive, memNew } = await userTotals(ses);
  /* ------------------------------------------------------------------------ */
  // stuff

  return {
    totalRevAllTime,
    totalRevThisMonth,
    totalRevLastMonth,
    revTotal6MonthAgo,
    ordCountAll,
    ordCountToday,
    ordCountNotAssigned,
    ordCountProcessing,
    ordCountThisMonth,
    ordCountLastMonth,
    avgRevDayThisMonth,
    avgRevDayLastMonth,
    avgOrdDayThisMonth,
    avgOrdDayLastMonth,
    avgRevDay6Month,
    memClient,
    memNew,
    memInactive,
  };
};

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

const ordTotals = async (ses: tSesJson) => {
  const ordCountAll = await ordStatusCount(ses, "total comp all");

  const ordCountThisMonth = await ordStatusCount(
    ses,
    "total comp between",
    dateGenUtc.thisMonthStart.toISOString(),
    dateGenUtc.thisMonthEnd.toISOString()
  );
  const ordCountLastMonth = await ordStatusCount(
    ses,
    "total comp between",
    dateGenUtc.lastMonthStart.toISOString(),
    dateGenUtc.lastMonthEnd.toISOString()
  );
  const ordCountToday = await ordStatusCount(
    ses,
    "all",
    dateGenUtc.todayStart.toISOString(),
    dateGenUtc.todayEnd.toISOString()
  );
  const ordCountProcessing = await ordStatusCount(ses, "processing");

  const ordCountNotAssigned = await ordStatusCount(ses, "not assigned");

  const avgOrdDayThisMonth = ordCountThisMonth / dateGenUtc.thisMonthDaysSoFar;
  const avgOrdDayLastMonth = ordCountLastMonth / dateGenUtc.lastMonthDaysTotal;

  return {
    ordCountThisMonth,
    ordCountLastMonth,
    ordCountToday,
    ordCountProcessing,
    ordCountNotAssigned,
    ordCountAll,
    avgOrdDayThisMonth,
    avgOrdDayLastMonth,
  };
};

const userTotals = async (ses: tSesJson) => {
  const memClient = await userCount(ses, "total members", "client");

  const memNew = await userCount(
    ses,
    "new members",
    undefined,
    dateGenUtc.thisMonthStart.toISOString(),
    dateGenUtc.thisMonthEnd.toISOString()
  );

  const memInactive = await userCount(ses, "inactive members");

  return { memClient, memNew, memInactive };
};

