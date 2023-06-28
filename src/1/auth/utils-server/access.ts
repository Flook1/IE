import { prisma } from "@/src/server/db";
import { TRPCError } from "@trpc/server";
import type * as zEnum from "../../../utils/general/zEnums";
import { type tSesObj } from "./ses";
import { z } from "zod";

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
// Rule checks

type Crud = "c" | "r" | "u" | "d" | "e";
type Rule =
  | "support"
  | "job posts"
  | "revert order state"
  | "users"
  | "edit price"
  | "client services"
  | "services"
  | "add adjustment invoice"
  | "approve editor services"
  | "invoices"
  | "portfolio"
  | "business info"
  | "editor user services"
  | "wallet details"
  | "discounts"
  | "roles"
  | "dashboard"
  | "order details"
  | "new order"
  | "project details"
  | "orders"
  | "invoice details"
  | "quality control"
  | "service categories"
  | "business details"
  | "delivery"
  | "business overview"
  | "approve editor user services"
  | "project overview"
  | "user overview"
  | "profile"
  | "editor bus services"
  | "user details"
  | "projects"
  | "service types";

export const ruleAccess = async (ses: tSesObj, rule: Rule, crud: Crud) => {
  if (rule === null || crud === null) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "incorrect values passed to ruleAccess function",
    });
  }

  // const  user_id = "qfbu8n";
  // const role_id = 1;

  const role_id = ses.user.role_id;

  try {
    const canAccess = await prisma.auth_rr_role_rule.findFirst({
      where: {
        rule_name: rule,
        role_id: role_id,
        ...(crud == "c" ? { c: true } : {}),
        ...(crud == "r" ? { r: true } : {}),
        ...(crud == "u" ? { u: true } : {}),
        ...(crud == "d" ? { d: true } : {}),
        ...(crud == "e" ? { e: true } : {}),
      },
      select: {
        rule_name: true,
      },
    });

    return canAccess;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Prisma auth access rule query failed",
      cause: error,
    });
  }
};

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
// Action checks

export const zActionType = z.enum([
  "editor bus service",
  "editor user service",
]);
export type tActionType = z.infer<typeof zActionType>;
export const actionAccess = async (
  ses: tSesObj,
  type: tActionType,
  editId: string,
  userId: string
) => {
  // i dont know if this will be needed
  let approveId;
  if (type == "editor user service") {
    approveId = await prisma.editor_user_service.findFirst({
      select: {
        id: true,
      },
      where: {
        service_id: parseInt(editId),
        ...(type == "editor user service"
          ? {
              rel_editorUser: {
                user_id: { equals: userId },
              },
            }
          : {}),
        ...(ses.userType == "client manager"
          ? {
              OR: {
                rel_editorUser: {
                  user_id: {
                    equals: userId,
                  },
                },
              },
            }
          : {}),
      },
    });
  }

  if (type == "editor bus service") {
    approveId = await prisma.editor_bus_service.findFirst({
      select: {
        id: true,
      },
      where: {
        id: { equals: parseInt(editId) },
        business_id: { equals: ses.bus_id },
      },
    });
  }

  return approveId;
};

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

export const orderAccess = async (ses: tSesObj, order_id: string) => {
  const curr_user_id = ses.user.user_id;
  const curr_user_type = ses.userType;
  const bus_type = ses.bus_type;
  const bus_id = ses.bus_id;

  // --test

  const qOrd = await prisma.order_main.findMany({
    where: {
      id: order_id,
      rel_OrderState: {
        deleted_on: null,
      },
      ...(ses.bus_type == "editor"
        ? {
            AND: [
              {
                editor_business_id: bus_id,
              },

              // editor manager
              {
                ...(curr_user_type == "editor manager"
                  ? {
                      OR: [
                        {
                          editor_user_id: curr_user_id,
                        },
                        {
                          editor_qc_id: curr_user_id,
                        },
                        {
                          //todo dont think condition below will work as i intended
                          rel_editorUser: {
                            rel_childOf: {
                              some: {
                                parent_user_id: curr_user_id,
                              },
                            },
                          },
                        },
                      ],
                    }
                  : {}),
              },

              // editor user
              {
                ...(curr_user_type == "editor team"
                  ? {
                      OR: [
                        {
                          editor_user_id: curr_user_id,
                        },
                        {
                          editor_qc_id: curr_user_id,
                        },
                        {
                          AND: [
                            {
                              rel_OrderState: {
                                state_name: "quality control",
                              },
                              editor_qc_id: curr_user_id,
                            },
                          ],
                        },
                      ],
                    }
                  : {}),
              },
            ],
          }
        : {}),

      // client
      ...(ses.bus_type == "client"
        ? {
            AND: [
              {
                client_business_id: bus_id,
              },
              {
                client_user_id: curr_user_id,
              },
              // todo need to add manager check,
            ],
          }
        : {}),
    },
    select: {
      id: true,
      editor_qc_id: true,
      rel_OrderState: {
        select: {
          id: true,
          state_name: true,
        },
      },
      rel_editorUser: {
        select: {
          user_id: true,
          rel_childOf: {
            select: {
              parent_user_id: true,
            },
          },
        },
      },
      rel_clientUser: {
        select: {
          user_id: true,
          rel_childOf: {
            select: {
              parent_user_id: true,
            },
          },
        },
      },
    },
  });

  return qOrd;
};
