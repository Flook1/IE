import { type tCurrCode, type tLocale } from "@/src/1/gen/utils/zEnums";
import { z } from "zod";

export const titleCase = (string: string) => {
  if (string == undefined) {
    return null;
  }

  const lowerList = string.toLowerCase().split(" ");
  for (let i = 0; i < lowerList.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    lowerList[i] =
      lowerList[i]!.charAt(0).toUpperCase() + lowerList[i]!.slice(1);
  }
  return lowerList.join(" ");
};

export const titleCaseBasic = (string: string) => {
  if (string == undefined) {
    return null;
  }

  const lower = string.toLowerCase();
  return string.charAt(0).toUpperCase() + lower.slice(1);
};

export const urlRemoveEnd = (url: string) => {
  return url.substring(0, url.lastIndexOf("/"));
};

export const uniqueString = (characterCount: number) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < characterCount; i++) {
    const randomIndex: number = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  return result;
};

export const zLocaleStyle = z.enum(["currency", "decimal", "percent"]);
export type tLocaleStyle = z.infer<typeof zLocaleStyle>;

export const zCurrDisplay = z.enum(["symbol", "code", "name"]);
export type tCurrDisplay = z.infer<typeof zCurrDisplay>;

export const formatCurr = (
  number: number,
  locale: tLocale,
  style: tLocaleStyle,
  curr: tCurrCode,
  currDisplay: tCurrDisplay,
  group?: boolean,
  minWholeNum?: number,
  minDecimalNum?: number,
  maxDecimalNum?: number
) => {
  const options = {
    ...(style ? { style } : {}),
    ...(style == "currency" ? { currency: curr } : {}),
    ...(style == "currency" ? { currencyDisplay: currDisplay } : {}),
    ...(style == "currency" && group ? { group } : {}),
    ...(minWholeNum ? { minimumIntegerDigits: minWholeNum } : {}),
    ...(minDecimalNum ? { minimumFractionDigits: minDecimalNum } : {}),
    ...(maxDecimalNum ? { maximumFractionDigits: maxDecimalNum } : {}),
  };

  const formatted = number.toLocaleString(locale, { ...options });

  // return { result, options };
  return {formatted, input: number};
};
