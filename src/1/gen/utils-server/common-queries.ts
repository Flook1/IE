import { type ctxMain } from "@/src/server/api/trpc";
import { prisma } from "@/src/server/db";

export const countries = async (opts: ctxMain) => {
  const countryAll = await prisma.country.findMany({
    select: {
      id: true,
      country_name: true,
      region: true,
      has_price: true,
    },
  });

  return countryAll;
};

export const currencies = async (opts: ctxMain) => {
  const currAll = await prisma.country.findMany({
    where: {
      has_price: true,
    },
    select: {
      id: true,
      currency_code: true,
      currency_name: true,
      currency_symbol: true,
      region: true,
    },
  });

  return currAll;
};

/* -------------------------------------------------------------------------- */
// Service Stuff
export const serviceCategories = async (opts: ctxMain) => {
  const serCatAll = await prisma.service_category.findMany({
    where: {
      deleted_on: null,
    },
    select: {
      id: true,
      service_category_code: true,
      service_category_name: true,
    },
  });
  return serCatAll;
};

export const serviceTypes = async (opts: ctxMain) => {
  const serTypeAll = await prisma.service_type.findMany({
    where: {
      deleted_on: null,
    },
    select: {
      id: true,
      service_category_id: true,
      service_type_code: true,
      service_type_name: true,
    },
  });
  return serTypeAll;
};

export const serviceAddon = async (opts: ctxMain) => {
  const serAddonAll = await prisma.service_addon.findMany({
    where: {
      deleted_on: null,
    },
    select: {
      id: true,
      addon_service_id: true,
      rel_serviceAddon: {
        select: {
          id: true,
          is_addon: true,
        },
      },
      rel_parentService: {
        select: {
          id: true,
        },
      },
    },
  });
  return serAddonAll;
};
/* -------------------------------------------------------------------------- */

export const currBusBasic = async (opts: ctxMain, busId: string) => {
  // we will assume the id is checked already
  const currBus = await prisma.business.findFirst({
    where: {
      id: busId,
    },
    select: {
      id: true,
      business_name: true,
      business_type: true,
      display_name: true,
      owner_user_id: true,
      client_type: true,
      payment_type: true,
      max_jobs_per_editor: true,
    },
  });
  return currBus;
};

