import { prisma } from "@/src/server/db";
import { type tSesObj } from "../auth/utils-server/ses";
import dayjs from "dayjs";
import { zOrderStatus } from "@/src/utils/general/zEnums";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ordRev, ordStatusCount } from "./genOrder";
import { dateGenUtc } from "../gen/utils/genDates";
import { userCount } from "../user/utils-server/genUser";

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

export const dashFunc = async (ses: tSesObj) => {
  // common date stuff

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

  const memClient = await userCount(ses, "total members", "client");

  const memNew = await userCount(
    ses,
    "new members",
    undefined,
    dateGenUtc.thisMonthStart.toISOString(),
    dateGenUtc.thisMonthEnd.toISOString()
  );

  const memInactive = await userCount(ses, "inactive members");

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

  // need total count for this
  // todo avg per order rev this month
  const avgRevDayThisMonth =
    totalRevThisMonth.grossUsd / dateGenUtc.thisMonthDaysSoFar;

  const avgRevDayLastMonth =
    totalRevLastMonth.grossUsd / dateGenUtc.lastMonthDaysTotal;

  const avgRevDay6Month =
  revTotal6MonthAgo.grossUsd / dateGenUtc.lastMonthDaysTotal;


  // todo avg per order rev last month

  const avgOrdDayThisMonth = ordCountThisMonth / dateGenUtc.thisMonthDaysSoFar;
  const avgOrdDayLastMonth = ordCountLastMonth / dateGenUtc.lastMonthDaysTotal;


  return {
    totalRevAllTime,
    totalRevThisMonth,
    totalRevLastMonth,
    revTotal6MonthAgo,
    memClient,
    memNew,
    memInactive,
    ordCountAll,
    ordCountThisMonth,
    ordCountLastMonth,
    avgRevDayThisMonth,
    avgRevDayLastMonth,
    avgOrdDayThisMonth,
    avgOrdDayLastMonth,
    avgRevDay6Month,
  };
};

const ie_team = async (ses: tSesObj) => {
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
  // todo
  return;
};

const client_owner = async (ses: tSesObj) => {
  // todo over due jobs
  // todo processing  this month

  const memClient = await userCount(ses, "total members", "client");

  const memNew = await userCount(
    ses,
    "new members",
    undefined,
    dateGenUtc.thisMonthStart.toISOString(),
    dateGenUtc.thisMonthEnd.toISOString()
  );

  const memInactive = await userCount(ses, "inactive members");

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
  const ordCountThisYear = await ordStatusCount(
    ses,
    "total comp between",
    dateGenUtc.thisYearStart.toISOString(),
    dateGenUtc.thisYearEnd.toISOString()
  );

  // client team is mostly same as above
  // todo finish
  return;
};

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
