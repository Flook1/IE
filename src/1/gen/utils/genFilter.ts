import * as zEnum from "@/src/utils/general/zEnums";
import { z } from "zod";
// This is just for anything to do with filtering pagination and so on

export const zFilterGen = z.object({
  take: z.number(),
  page: z.number(),
  search: z.string().nullable(),
});
export type tFilterGen = z.infer<typeof zFilterGen>;
