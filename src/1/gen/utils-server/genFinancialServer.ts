import { prisma } from "@/src/server/db";
import {
  type tCurrCode,
} from "@/src/1/gen/utils/zEnums";
import { TRPCError } from "@trpc/server";



// latest Rate
export const currToUsdLatest = async (curr: tCurrCode) => {
  const currId = await prisma.country.findFirst({
    select: {
      id: true,
    },
    where: {
      currency_code: curr,
    },
  });

  if (currId == null) {
    // do something
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "couldn't find currency",
    });
  }

  const rate = await prisma.currency_rates.findFirst({
    select: {
      rate_per_usd: true,
    },
    where: {
      currency_id: currId.id,
    },
  });

  return rate;
};

