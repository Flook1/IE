import z from "zod";

// general enums

/* ------------------------------- auth stuff ------------------------------- */
export const zRuleGroup = z.enum(["page", "page-detail", "function"]);
export type  tRuleGroup = z.infer<typeof zRuleGroup>
export const zCrud = z.enum(["c", "r", "u", "d", "e" ]);
export type  tCrud = z.infer<typeof zCrud>


export const zRuleNames = z.enum([
  "new order",
  "dashboard",
  "projects",
  "order details",
  "invoice details",
  "delivery",
  "support",
  "profile",
  "approve editor services",
  "approve editor user services",
  "add adjustment invoice",
  "edit price",
  "user details",
  "business details",
  "project details",
  "user overview",
  "business overview",
  "project overview",
  "revert order state",
  "service categories",
  "service types",
  "services",
  "client services",
  "orders",
  "quality control",
  "invoices",
  "discounts",
  "wallet details",
  "job posts",
  "editor user services",
  "editor bus services",
  "business info",
  "users",
  "portfolio",
  "roles",
]);
export type  tRuleNames = z.infer<typeof zRuleNames>

/* -------------------------------- userStuff ------------------------------- */

export const zUserType = z.enum([
  "ie owner",
  "ie team",
  "client owner",
  "client manager",
  "client team",
  "editor owner",
  "editor manager",
  "editor team",
]);
export type  tUserType = z.infer<typeof zUserType>


export const zRoles = z.enum([
  "ie_admin",
  "ie_user",
  "client_owner",
  "client_user",
  "editor_owner",
  "editor_user",
  "customer_owner",
  "editor_qc",
]);
export type  tRoles = z.infer<typeof zRoles>

export const zClientType = z.enum(["photographer", "standard"]);
export type  tClientType = z.infer<typeof zClientType>

export const zBusType = z.enum(["ie", "client", "editor", "customer"]);
export type  tBusType = z.infer<typeof zBusType>


/* -------------------------------- Pay info -------------------------------- */
export const zCurrCode = z.enum(["CAD", "USD", "EUR", "GBP", "AUD", "NZD"]);
export type  tCurrCode = z.infer<typeof zCurrCode>

export const zPayType = z.enum(["advance", "monthly"]);
export type  tPayType = z.infer<typeof zPayType>

export const zPayEvent = z.enum([
  "success",
  "checkout",
  "pending",
  "failure",
  "complete",
]);
export type  tPayEvent = z.infer<typeof zPayEvent>

export const zPayAccTerm = z.enum(["credit", "debit"]);
export type  tPayAccTerm = z.infer<typeof zPayAccTerm>

export const zPriceType = z.enum(["per image", "per floor", "flat rate"]);
export type  tPriceType = z.infer<typeof zPriceType>

export const zDiscountType = z.enum(["percent", "fixed"]);
export type  tDiscountType = z.infer<typeof zDiscountType>

// todo should add these to database
export const zLocale = z.enum(["en-AU", "en-US","en-CA", "en-GB", "th-TH", "en-IN"]);
export type  tLocale = z.infer<typeof zLocale>



/* --------------------------------- invoice -------------------------------- */
export const zInvType = z.enum(["sales", "purchase"]);
export type  tInvType = z.infer<typeof zInvType>

export const zInvGstType = z.enum(["inc", "exc", "no gst"]);
export type  tInvGstType = z.infer<typeof zInvGstType>

export const zInvCreationType = z.enum([
  "system",
  "ie team",
  "client",
  "editor",
  "other",
]);
export type  tInvCreationType = z.infer<typeof zInvCreationType>


/* ---------------------------------- Order --------------------------------- */
export const zOrderStatus = z.enum([
  "draft",
  "checkout",
  "payment successful",
  "payment failed",
  "zipping",
  "requested",
  "processing",
  "quality control",
  "completed",
  "adjustment",
  "settled",
  "cancelled",
]);
export type  tOrderStatus = z.infer<typeof zOrderStatus>


/* -------------------------------- services -------------------------------- */
export const zServiceStatus = z.enum([
  "approved",
  "requested",
  "rejected",
  "cancelled",
]);
export type  tServiceStatus = z.infer<typeof zServiceStatus>


/* --------------------------------- content -------------------------------- */
export const zContentType = z.enum([
  "editing extras",
  "main images",
  "floor plans",
  "drone images",
  "virtual tours",
  "video content",
  "custom content",
]);
export type  tContentType = z.infer<typeof zContentType>


export const zContentUploadType = z.enum(["source", "output", "project"]);
export type  tContentUploadType = z.infer<typeof zContentUploadType>

export const zContentImgProcessStatus = z.enum([
  "uploaded",
  "processing",
  "finished",
]);
export type  tContentImgProcessStatus = z.infer<typeof zContentImgProcessStatus>


/* ---------------------------------- other --------------------------------- */
// api error handling
export const zApiErrorHandle = z.enum(["none", "throw", "redirect"]);
export type  tApiErrorHandle = z.infer<typeof zApiErrorHandle>