import { prisma } from "@/src/server/db";
import { z } from "zod";
import { type tSesJson } from "../../auth/utils-server/ses";
import { type tBusType, } from "@/src/utils/general/zEnums";
import dayjs from "dayjs";

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

const zUserGenType = z.enum([
  "total members",
  "new members",
  "inactive members",
]);
type tUserGenType = z.infer<typeof zUserGenType>;

const userCount = async (
  ses: tSesJson,
  checkType: tUserGenType,
  busType?:tBusType ,
  dateStart?: string,
  dateEnd?: string
) => {
  const currentDate = dayjs();

  const userCount = await prisma.user_main.count({
    where: {
        deleted_on: null,
        ...( ses.bus_type != "ie" ? {
            business_id: ses.bus_id
        } : {}),
        ...( checkType == "inactive members" ? {
            last_login_time: {
                lte: currentDate.subtract(7,'d').toISOString()
            }
        } : {}),
        ...(busType ? {
            rel_bus: {
                business_type: busType
            }
        } :{}),
        ...(dateStart ? {
            created_on: {
                gte: dateStart,
                lte: dateEnd
            }
        }:{})
    },
  });

  return userCount;
};

export { userCount };
