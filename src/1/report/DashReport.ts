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

const ie_admin = async (ses: tSesObj) => {
  // common date stuff

  const totalRev = await ordRev(
    ses,
    "netUsd",
    dateGenUtc.allTime,
    dateGenUtc.dateNow
  );

  const grossProfitThisMonth = await ordRev(
    ses,
    "profitUsd",
    dateGenUtc.thisMonthStart,
    dateGenUtc.thisMonthEnd
  );
  const grossProfitLastMonth = await ordRev(
    ses,
    "profitUsd",
    dateGenUtc.lastMonthStart,
    dateGenUtc.lastMonthEnd
  );

  const grossRevThisMonth = await ordRev(
    ses,
    "netUsd",
    dateGenUtc.thisMonthStart,
    dateGenUtc.thisMonthEnd
  );
  const grossRevLastMonth = await ordRev(
    ses,
    "netUsd",
    dateGenUtc.lastMonthStart,
    dateGenUtc.lastMonthEnd
  );

  const editorBusTotalThisMonth = await ordRev(
    ses,
    "editorBusTotal",
    dateGenUtc.thisMonthStart,
    dateGenUtc.thisMonthEnd
  );

  const editorBusTotalLastMonth = await ordRev(
    ses,
    "editorBusTotal",
    dateGenUtc.lastMonthStart,
    dateGenUtc.lastMonthEnd
  );

  const memClient = await userCount(ses, "total members", "client");

  const memNew = await userCount(
    ses,
    "new members",
    undefined,
    dateGenUtc.thisMonthStart,
    dateGenUtc.thisMonthEnd
  );

  const memInactive = await userCount(ses, "inactive members");

  const ordCountAll = await ordStatusCount(ses, "total comp all");
  const ordCountThisMonth = await ordStatusCount(
    ses,
    "total comp between",
    dateGenUtc.thisMonthStart,
    dateGenUtc.thisMonthEnd
  );

  const ordCountLastMonth = await ordStatusCount(
    ses,
    "total comp between",
    dateGenUtc.lastMonthStart,
    dateGenUtc.lastMonthEnd
  );

  // need total count for this
  // todo avg per order rev this month

  // todo avg per order rev last month

  //   todo average order per day per month

  // todo finish
  return;
};

const ie_team = async (ses: tSesObj) => {
  const ordCountThisMonth = await ordStatusCount(
    ses,
    "total comp between",
    dateGenUtc.thisMonthStart,
    dateGenUtc.thisMonthEnd
  );
  const ordCountLastMonth = await ordStatusCount(
    ses,
    "total comp between",
    dateGenUtc.lastMonthStart,
    dateGenUtc.lastMonthEnd
  );
  const ordCountToday = await ordStatusCount(
    ses,
    "all",
    dateGenUtc.todayStart,
    dateGenUtc.todayEnd
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
    dateGenUtc.thisMonthStart,
    dateGenUtc.thisMonthEnd
  );

  const memInactive = await userCount(ses, "inactive members");

  const ordCountAll = await ordStatusCount(ses, "total comp all");
  const ordCountThisMonth = await ordStatusCount(
    ses,
    "total comp between",
    dateGenUtc.thisMonthStart,
    dateGenUtc.thisMonthEnd
  );

  const ordCountLastMonth = await ordStatusCount(
    ses,
    "total comp between",
    dateGenUtc.lastMonthStart,
    dateGenUtc.lastMonthEnd
  );
  const ordCountThisYear = await ordStatusCount(
    ses,
    "total comp between",
    dateGenUtc.thisYearStart,
    dateGenUtc.thisYearEnd
  );

  // client team is mostly same as above
  // todo finish
  return;
};

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
