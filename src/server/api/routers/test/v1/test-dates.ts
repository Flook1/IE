import { env } from "@/src/env.mjs";
import { ruleAccess } from "@/src/utils/auth/access";
import { isDev, isProd } from "@/src/utils/auth/isEnv";
import { getUserAuthFull } from "@/src/utils/user/getUserAuthFull";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";


dayjs.extend(utc);
dayjs.extend(timezone);

export const testDateRouter = createTRPCRouter({
  dateBasic: publicProcedure.query( () => {
    isDev("my");


    const dateNowSet = dayjs();
    const isUtcStart = dateNowSet.isUTC()
    const isUtcAfter = dateNowSet.tz('utc').isUTC()
    const dateNowIso = dateNowSet.tz('utc').format();
    // const dateNowIso = dateNowSet.tz().format();
    const dateNowDD = dateNowSet.format('DD/MM/YYYY');
    const day = dateNowSet.day()
    const addDay = dateNowSet.add(15, 'day').format()
    return {
      isUtcStart,
      isUtcAfter,
      dateNowIso,
      dateNowDD,
      day,
      addDay,
    };
  }),
});
