import {
  zInvGstType,
  type tInvGstType,
  type tCurrCode,
} from "@/src/utils/general/zEnums";
import { TRPCError } from "@trpc/server";

// net profit calculator

export const netProfitMargin = (gross: number, exp: number) => {
  const net = gross - exp;
  let margin = marginCalc(net, gross);
  if (isNaN(margin)) {
    margin = 0;
  }
  return { net, margin };
};

export const marginCalc = (net: number, gross: number) => {
  let  margin = (net / gross) * 100 ?? 0;

  if (isNaN(margin)) {
    margin = 0;
  }

  return margin;
};

export const diffCalc = (
  string: boolean,
  newValue: number | undefined,
  previousValue: number | undefined
) => {
  if (newValue == undefined || previousValue == undefined) return;

  let calc = ((newValue - previousValue) / previousValue) * 100;

  let difference: string | number = 0;

  if (isNaN(calc)) {
    calc = 0;
  }
  if (string == true) {
    difference = `${calc.toFixed(2)} %`;
  } else {
    // just provide number
    difference = calc;
  }

  return difference;
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
