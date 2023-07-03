import { sesQuickCheckThrow } from "@/src/1/auth/utils-server/ses";
import { dateGenUtc } from "@/src/1/gen/utils/genDates";
import { dashFunc } from "@/src/1/report/DashReport";
import { ordRev } from "@/src/1/report/genOrder";
import { z } from "zod";
import { createTRPCRouter, sesProcedure } from "~/server/api/trpc";

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
export const genDashRouter = createTRPCRouter({
  dashContent: sesProcedure.query(async ({ ctx }) => {
    sesQuickCheckThrow(ctx.getSes.isSes);

    // dash function
    const dashStats = await dashFunc(ctx.getSes.sesJson!)


    return dashStats;
  }),
});
