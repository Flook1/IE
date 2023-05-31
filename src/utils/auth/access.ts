import { prisma } from "@/src/server/db";
import { TRPCError } from "@trpc/server";

/* -------------------------------------------------------------------------- */

export const ruleAccess = async (rule: string, crud: string) => {
  if (rule === null || crud === null) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "incorrect values passed to ruleAccess function",
    });
  }
  // Lets get the rules that the current user has access too:
  // This should be from cookie
  let user_id = "something";

  const canAccess = await prisma.auth_rr_role_rule.findFirst({
    where: {
      rule_name: rule,
      ...(crud=="c" ? { c: true } : {}),
      ...(crud=="r" ? { c: true } : {}),
      ...(crud=="u" ? { c: true } : {}),
      ...(crud=="d" ? { c: true } : {}),
      ...(crud=="e" ? { c: true } : {}),
    },
    select: {
        rule_name: true,

    }
  });
};
