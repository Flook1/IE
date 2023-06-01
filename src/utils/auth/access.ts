import { prisma } from "@/src/server/db";
import { TRPCError } from "@trpc/server";

/* -------------------------------------------------------------------------- */

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
    });
  }
};
