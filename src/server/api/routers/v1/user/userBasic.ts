import {
  sesQuickCheckThrow,
  type tSesFull,
} from "@/src/1/auth/utils-server/ses";
import { zFilterGen } from "@/src/1/gen/utils/genFilter";
import { userList } from "@/src/1/user/utils-server/genUser";
import { z } from "zod";
import { createTRPCRouter, type ctxSes, sesProcedure } from "~/server/api/trpc";

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
              where: {
                rel_auth_rule: {
                  rule_group: {
                    equals: "function",
                  },
                },
              },
              select: {
                rel_auth_rule: {
                  select: {
                    rule_name: true,
                    rule_info: true,
                    rule_group: true,
                  },
                },
                // question What are all these letters for?
                // answer create, read, update, delete, export
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

    let name_user = "john";

    if (currUserData?.name_first != null && currUserData?.name_last != null) {
      name_user = `${currUserData?.name_first} ${currUserData?.name_last}`;
    }

    const userContent = {
      name_user,
      ...currUserData,
    };

    // Client Specific Stuff
    // Get client specific services
    let sesClientType;
    if (ctx.getSes.sesJson !== undefined) {
      sesClientType = ctx.getSes.sesJson.user.rel_bus.client_type;
    } else {
      sesClientType = null;
    }

    let serviceAccess;

    if (ctx.getSes.sesJson?.bus_id && ctx.getSes.sesJson.bus_type == "client") {
      // get ids first for sepcific service
      const serviceAccessSpecific = await ctx.prisma.service_access.findMany({
        where: {
          business_id: { equals: ctx.getSes.sesJson?.bus_id },
          deleted_on: { equals: null },
          rel_service: {
            client_access: { equals: null },
          },
        },
        select: {
          service_id: true,
        },
      });

      // get all services for client type mixed with the list above
      serviceAccess = await ctx.prisma.service_main.findMany({
        select: {
          id: true,
          client_access: true,
          service_code: true,
          service_name: true,
          rel_service_category: {
            select: {
              service_category_name: true,
            },
          },
          client_type: true,
          description: true,
          instructions: true,
          default_due_time: true,
          is_addon: true,
          rel_service_price: {
            select: {
              id: true,
              price_type: true,
              gross_price: true,
              tax_rate: true,
              retail_price: true,
              service_id: true,
              service_type_id: true,
            },
          },
        },
        where: {
          is_addon: { equals: false },
          client_type: { equals: sesClientType! },
          deleted_on: { equals: null },
          OR: {
            id: { in: serviceAccessSpecific.map((item) => item.service_id) },
            client_access: { equals: "All" },
          },
        },
      });
    } else {
      // we are just going to get all services
      serviceAccess = await ctx.prisma.service_main.findMany({
        select: {
          id: true,
          client_access: true,
          service_code: true,
          service_name: true,
          rel_service_category: {
            select: {
              service_category_name: true,
            },
          },
          client_type: true,
          description: true,
          instructions: true,
          default_due_time: true,
          is_addon: true,
          rel_service_price: {
            select: {
              id: true,
              price_type: true,
              gross_price: true,
              tax_rate: true,
              retail_price: true,
              service_id: true,
              service_type_id: true,
            },
          },
        },
        where: {
          deleted_on: { equals: null },
          ...(sesClientType != null
            ? { client_type: { equals: sesClientType } }
            : {}),
        },
      });
    }

    /* ---------------------------------------------------------------------- */
    // ie stuff
    // get all bus
    let qBusAll;
    if (ctx.getSes.sesJson?.bus_type == "ie") {
      qBusAll = await ctx.prisma.business.findMany({
        select: {
          id: true,
          display_name: true,
          business_name: true,
          business_type: true,
          owner_user_id: true,
          payment_type: true,
          client_type: true,
          max_jobs_per_editor: true,
          updated_on: true,
          rel_curr: {
            select: {
              currency_code: true,
              currency_symbol: true,
              currency_name: true,
            },
          },
        },
        where: {
          deleted_on: { equals: null },
        },
        orderBy: {
          updated_on: "desc",
        },
        take: 25,
      });
    }

    // get proj for ie or client
    let qProjAll;
    if (
      ctx.getSes.sesJson?.bus_type == "ie" ||
      ctx.getSes.sesJson?.bus_type == "client"
    ) {
      qProjAll = await ctx.prisma.project.findMany({
        select: {
          id: true,
          project_name: true,
          project_address: true,
          updated_on: true,
        },
        where: {
          ...(ctx.getSes.sesJson.bus_type == "client"
            ? { business_id: ctx.getSes.sesJson.user.business_id }
            : {}),
          deleted_on: { equals: null },
        },
        orderBy: {
          updated_on: "desc",
        },
        take: 25,
      });
    }

    return { userContent, serviceAccess, qBusAll, qProjAll };
  }),
  userList: sesProcedure.input(zFilterGen).query(async ({ ctx, input }) => {
    const list = await userList(
      ctx,
      ctx.getSes,
      input.take,
      input.page,
      input.search
    );

    return list;
  }),
});
