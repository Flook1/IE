import { prisma } from "@/src/server/db";
import { type tSesObj } from "../auth/utils-server/ses";
import dayjs from "dayjs";
import { zOrderStatus } from "@/src/utils/general/zEnums";
import { z } from "zod";

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

const zOrdCountType = z.enum(["overdue", "processing", "almost overdue", "total"]);
type tOrdCountType = z.infer<typeof zOrdCountType>;

const ordStatusCount = async (ses: tSesObj, checkType: tOrdCountType) => {
  const currentDate = dayjs();

  let statusArray: Array<string> = [""];
  if (checkType == "overdue") {
    statusArray = [
      zOrderStatus.Enum.processing,
      zOrderStatus.Enum["quality control"],
    ];
  } else if (checkType == "processing") {
    statusArray = [zOrderStatus.Enum.processing];
  }

// todo almost overdue settings
// todo total


  const ordCount = await prisma.order_main.count({
    where: {
      rel_OrderState: {
        state_name: { in: statusArray },
      },
      ...(checkType == "overdue"
        ? {
            date_due_on: {
              lte: currentDate.toString(),
            },
          }
        : {}),
      deleted_on: { equals: null },
    },
  });

  return ordCount;
};

//todo order counts for timeframe
// this month
// last month












export { ordStatusCount as ordCount };
