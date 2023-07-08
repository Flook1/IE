import { objErrSes } from "@/src/1/auth/login/types";
import { isEnv } from "@/src/1/auth/utils-server/isEnv";
import { menuContent } from "@/src/1/gen/utils-server/menuGen";
import { prisma } from "@/src/server/db";
import {
  countries,
  currencies,
  serviceAddon,
  serviceCategories,
  serviceTypes,
} from "@/src/1/gen/utils-server/common-queries";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  sesProcedure,
} from "~/server/api/trpc";

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
export const genMainRouter = createTRPCRouter({
  isEnv: publicProcedure
    .input(
      z.object({
        envSel: z.enum(["my", "node"]),
        envType: z.enum(["development", "staging", "production", "test"]),
      })
    )
    .query(({ ctx, input }) => {
      const allowed = isEnv(input.envSel, input.envType, false);

      return { isAllowed: allowed };
    }),
  basicContent: publicProcedure.query(async ({ ctx }) => {
    const currAll = await currencies(ctx);
    const countriesAll = await countries(ctx);
    const serviceCatAll = await serviceCategories(ctx);
    const serviceTypesAll = await serviceTypes(ctx);
    const serviceAddonAll = await serviceAddon(ctx);

    return {
      currAll,
      serviceCatAll,
      serviceTypesAll,
      serviceAddonAll,
      countriesAll,
    };
  }),
  menuContent: sesProcedure.query(async ({ ctx }) => {
    if (!ctx.getSes.isSes && true) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: objErrSes.SesNotValid,
      });
    }

    const userId = ctx.getSes.sesJson?.user.user_id;

    if (!userId) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "no user id" });
    }
    console.log(`userid: ${userId}`);

    const menuList = await menuContent(ctx, userId);

    return { menuList };
  }),
});
