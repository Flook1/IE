import { isEnv } from "@/src/1/auth/utils-server/isEnv";
import {
  countries,
  currencies,
  serviceAddon,
  serviceCategories,
  serviceTypes,
} from "@/src/utils/com-queries/common-queries";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
});
