import { prisma } from "@/src/server/db";
import {
  zInvGstType,
  type tInvGstType,
  type tCurrCode,
} from "@/src/utils/general/zEnums";
import { TRPCError } from "@trpc/server";

// net profit calculator

export const netProfitMargin = (gross: number, exp: number) => {
  const net = gross - exp;
  const margin = marginCalc(net, gross)

  return { net, margin };
};

export const marginCalc = (net: number, gross: number) => {
  const  margin = ((net / gross) * 100) ?? 0;

  return margin
}

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

// tax stuff

export const gstCalc = (type: tInvGstType, net: number, rate: number) => {
  if (type == "no gst") {
    return;
  }

  // const taxRate = (1+(rate/100)) ?? 0
  const taxRate = rate / 100 ?? 0;
  let amountNoGst;
  let amountGst;

  // including:
  if (type == "inc") {
    amountNoGst = net / (1 + taxRate) ?? 0;
    amountGst = (net - amountNoGst).toFixed(2) ?? 0;
  }

  // excluding:
  if (type == "exc") {
    amountNoGst = net;
    amountGst = net * taxRate;
  }

  return { amountGst, amountNoGst };
};

// order stuff

