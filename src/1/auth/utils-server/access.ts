import { prisma } from "@/src/server/db";
import { TRPCError } from "@trpc/server";
import type * as zEnum from "../../../utils/general/zEnums";

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

export const ruleAccess = async (rule: Rule, crud: Crud) => {
  if (rule === null || crud === null) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "incorrect values passed to ruleAccess function",
    });
  }
  // Lets get the rules that the current user has access too:
  // This should be from cookie
  //i dont think id is needed
  // const  user_id = "qfbu8n";

  const role_id = 1;

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

export const actionAccess = () => {
  // i dont know if this will be needed
  // todo

  return "something";
};

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
// order access

export const orderAccess = async (order_id: string) => {
  // todo

  // get from session
  const curr_user_id = "something";
  const curr_user_type = "editor manager";
  const bus_type = "ie";
  const bus_id = "something";

  // this checks if user has access to the order
  // todo

  const qOrd = await prisma.order_main.findMany({
    where: {
      id: order_id,
      rel_OrderState: {
        deleted_on: null,
      },
      // editor
      AND: [
        {
          editor_business_id: bus_id,
        },

        // need condition to run below
        {
          // editor manager
          ...(curr_user_type == 'editor manager' && {
            OR: [
            {
              editor_user_id: curr_user_id,
            },
            {
              editor_qc_id: curr_user_id,
            },
            {
              rel_editorUser: {
                rel_childOf: {
                  some: {
                    parent_user_id: curr_user_id,
                  },
                },
              },
            },
          ],
        })
      }

        // editor user


      ],
      // client
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
};
