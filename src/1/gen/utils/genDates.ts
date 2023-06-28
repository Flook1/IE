import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const currDateObj = dayjs();

const dateNow = currDateObj.toString()

const thisMonthStart = currDateObj.tz("utc").startOf("M").toString();
const thisMonthEnd = currDateObj.tz("utc").endOf("M").toString();
const thisMonthDaysSoFar = currDateObj.tz("utc").daysInMonth().toString();
const thisMonthDaysTotal = currDateObj.tz("utc").date().toString();

const lastMonthStart = currDateObj
  .tz("utc")
  .subtract(1, "M")
  .startOf("M")
  .toString();
const lastMonthEnd = currDateObj
  .tz("utc")
  .date(1)
  .subtract(1, "d")
  .endOf("M")
  .toString();
const lastMonthDaysTotal = currDateObj
  .tz("utc")
  .subtract(1, "M")
  .daysInMonth()
  .toString();

const thisYearStart = currDateObj.tz("utc").startOf("y").toString();
const thisYearEnd = currDateObj.tz("utc").endOf("y").toString();

const lastYearStart = currDateObj
  .tz("utc")
  .subtract(1, "y")
  .startOf("y")
  .toString();
const lastYearEnd = currDateObj.tz("utc").subtract(1, "y").endOf("y").toString();

const todayStart = currDateObj.tz("utc").startOf("d").toString();
const todayEnd = currDateObj.tz("utc").endOf("d").toString();

const allTime = currDateObj.tz("utc").subtract(30, "y").toString();

export const dateGenUtc = {
  currDateObj,
  dateNow,
  thisMonthStart,
  thisMonthEnd,
  thisMonthDaysTotal,
  lastMonthStart,
  lastMonthEnd,
  lastMonthDaysTotal,
  thisYearStart,
  thisYearEnd,
  lastYearStart,
  lastYearEnd,
  todayStart,
  todayEnd,
  allTime,
};
