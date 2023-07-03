import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const currDateObj = dayjs();

const dateNow = currDateObj


const thisMonthStart = currDateObj.tz("utc").startOf("M");
const thisMonthEnd = currDateObj.tz("utc").endOf("M");
const thisMonthDaysSoFar = currDateObj.tz("utc").daysInMonth();
const thisMonthDaysTotal = currDateObj.tz("utc").date();

const lastMonthStart = currDateObj
  .tz("utc")
  .subtract(1, "M")
  .startOf("M")
  ;
const lastMonthEnd = currDateObj
  .tz("utc")
  .date(1)
  .subtract(1, "d")
  .endOf("M")
  ;
const lastMonthDaysTotal = currDateObj
  .tz("utc")
  .subtract(1, "M")
  .daysInMonth()
  ;

const thisYearStart = currDateObj.tz("utc").startOf("y");
const thisYearEnd = currDateObj.tz("utc").endOf("y");

const lastYearStart = currDateObj
  .tz("utc")
  .subtract(1, "y")
  .startOf("y")
  ;
const lastYearEnd = currDateObj.tz("utc").subtract(1, "y").endOf("y");

const todayStart = currDateObj.tz("utc").startOf("d");
const todayEnd = currDateObj.tz("utc").endOf("d");

const allTimeStart = currDateObj.tz("utc").subtract(40, "y");

export const dateGenUtc = {
  currDateObj,
  dateNow,
  thisMonthStart,
  thisMonthEnd,
  thisMonthDaysSoFar,
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
  allTimeStart,
};
