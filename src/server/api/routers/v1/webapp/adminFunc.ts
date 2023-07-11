import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  sesProcedure,
} from "~/server/api/trpc";
import { sesGet, sesCheck, sesDelCookie } from "@/src/1/auth/utils-server/ses";
import { prisma } from "@/src/server/db";
import { objUrl } from "@/src/1/gen/types/urls";
import { TRPCError } from "@trpc/server";

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
export const adminFuncRouter = createTRPCRouter({
  updateUrl: sesProcedure.mutation(async ({ ctx, input }) => {


    const sesSuccess = await sesCheck(ctx, true, true);

    if (ctx.getSes.sesJson?.user.rel_role.role_name !== "ie_admin"){
      throw new TRPCError({code:"FORBIDDEN", message:"only admin can use this api"})
    }

    const dash = objUrl.v1.report
    await updateUrlRow(dash.dash.ruleName, dash.dash.url);

    const bus = objUrl.v1.bus
    await updateUrlRow(bus.busList.ruleName, bus.busList.url);
    await updateUrlRow(bus.busOver.ruleName, bus.busOver.url);
    await updateUrlRow(bus.busProfile.ruleName, bus.busProfile.url);

    const inv = objUrl.v1.invoice
    await updateUrlRow(inv.discount.ruleName, inv.discount.url);
    await updateUrlRow(inv.inv.ruleName, inv.inv.url);
    await updateUrlRow(inv.invList.ruleName, inv.invList.url);


    const jobApp = objUrl.v1.jobApp
    await updateUrlRow(jobApp.edBusService.ruleName, jobApp.edBusService.url);
    await updateUrlRow(jobApp.edUserService.ruleName, jobApp.edUserService.url);
    await updateUrlRow(jobApp.jobPosts.ruleName, jobApp.jobPosts.url);

    const ord = objUrl.v1.orders
    await updateUrlRow(ord.orderCreate.ruleName, ord.orderCreate.url);
    await updateUrlRow(ord.orderDetail.ruleName, ord.orderDetail.url);
    await updateUrlRow(ord.orderList.ruleName, ord.orderList.url);
    await updateUrlRow(ord.qc.ruleName, ord.qc.url);


    const proj = objUrl.v1.project
    await updateUrlRow(proj.projDets.ruleName, proj.projDets.url);
    await updateUrlRow(proj.projList.ruleName, proj.projList.url);
    await updateUrlRow(proj.projOver.ruleName, proj.projOver.url);

    const ser = objUrl.v1.services
    await updateUrlRow(ser.servicesCategory.list.ruleName, ser.servicesCategory.list.url);
    await updateUrlRow(ser.servicesMain.list.ruleName, ser.servicesMain.list.url);
    await updateUrlRow(ser.servicesType.list.ruleName, ser.servicesType.list.url);

    const userObj = objUrl.v1.user
    await updateUrlRow(userObj.list.ruleName, userObj.list.url);
    await updateUrlRow(userObj.overview.ruleName, userObj.overview.url);
    await updateUrlRow(userObj.profile.ruleName, userObj.profile.url);
    await updateUrlRow(userObj.details.ruleName, userObj.details.url);
    await updateUrlRow(userObj.roles.ruleName, userObj.roles.url);

    const wallet = objUrl.v1.wallet
    await updateUrlRow(wallet.details.ruleName, wallet.details.url);

    const webapp = objUrl.v1.webapp
    // await updateUrlRow(webapp.adminFunc.ruleName, webapp.adminFunc.url);
    await updateUrlRow(webapp.portfolio.ruleName, webapp.portfolio.url);


    return;
  }),
});

const updateUrlRow = async (ruleName: string, url: string) => {
  let success = false;
  const input = { ruleName, url };

  if (ruleName == null || url == null) {
    success = false;
    return {success, input};
  }

  const updateRow = await prisma.auth_rule.update({
    data: {
      page_url: url,
    },
    where: {
      // id: urlId,
      rule_name: ruleName
    },
  });

  // return { success, input ,updateRow };
  return
};
