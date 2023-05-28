import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const testGenRouter = createTRPCRouter({
  errorRes: publicProcedure
    .query((everything) => {
      return {
        something: JSON.stringify(everything, null, ' '),
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return "string";
  }),
});
