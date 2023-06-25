import { sesQuickCheckThrow } from "@/src/1/auth/utils-server/ses";
import { createTRPCRouter, sesProcedure } from "~/server/api/trpc";

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
export const userBasicRouter = createTRPCRouter({
  currBasic: sesProcedure.query(async ({ ctx }) => {
    sesQuickCheckThrow(ctx.getSes.isSes);

    const currUserData = await ctx.prisma.user_main.findFirst({
      select: {
        user_id: true,
        email_id: true,
        business_id: true,
        name_first: true,
        name_last: true,
        max_jobs: true,
        email_verified: true,
        rel_role: {
          select: {
            id: true,
            role_name: true,
            role_info: true,
            business_type: true,
            rel_auth_rr_role_rule: {
              select: {
                rel_auth_rule: {
                  select: {
                    rule_name: true,
                    rule_info: true,
                    rule_group: true,
                  },
                },
                c: true,
                r: true,
                u: true,
                d: true,
                e: true,
              },
            },
          },
        },
      },
      where: {
        user_id: ctx.getSes.sesJson?.user.user_id,
        rel_role: {
          rel_auth_rr_role_rule: {
            some: {
              rel_auth_rule: {
                rule_group: { equals: "function" },
              },
            },
          },
        },
      },
    });

    let name_user = "john"

    if (currUserData?.name_first != null && currUserData?.name_last != null) {
       name_user = `${currUserData?.name_first} ${currUserData?.name_last}`;
    }

    return {name_user, ...currUserData };
  }),
});
