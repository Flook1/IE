import z from "zod";

// general enums

/* ------------------------------- auth stuff ------------------------------- */
export const RuleGroup = z.enum(["page", "page-detail", "function"]);
export const RuleNames = z.enum([
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

/* -------------------------------- userStuff ------------------------------- */
export const Roles = z.enum([
  "ie_admin",
  "ie_user",
  "client_owner",
  "client_user",
  "editor_owner",
  "editor_user",
  "customer_owner",
  "editor_qc",
]);
export const ClientType = z.enum(["photographer", "standard"]);
export const BusType = z.enum(["ie", "client", "editor", "customer"]);

/* -------------------------------- Pay info -------------------------------- */
export const CurrCode = z.enum(["CAD", "USD", "EUR", "GBP", "AUD", "NZD"]);
export const PayType = z.enum(["advance", "monthly"]);
export const PayEvent = z.enum([
  "success",
  "checkout",
  "pending",
  "failure",
  "complete",
]);
export const PayAccTerm = z.enum(["credit", "debit"]);
export const PriceType = z.enum(["per image", "per floor", "flat rate"]);
export const DiscountType = z.enum(["percent", "fixed"]);

/* --------------------------------- invoice -------------------------------- */
export const InvType = z.enum(["sales", "purchase"]);
export const InvGstType = z.enum(["inc", "exc", "no gst"]);
export const InvCreationType = z.enum([
  "system",
  "ie team",
  "client",
  "editor",
  "other",
]);

/* ---------------------------------- Order --------------------------------- */
export const OrderStatus = z.enum([
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

/* -------------------------------- services -------------------------------- */
export const ServiceStatus = z.enum([
  "approved",
  "requested",
  "rejected",
  "cancelled",
]);

/* --------------------------------- content -------------------------------- */
export const ContentType = z.enum([
  "editing extras",
  "main images",
  "floor plans",
  "drone images",
  "virtual tours",
  "video content",
  "custom content",
]);

export const ContentUploadType = z.enum(["source", "output", "project"]);
export const ContentImgProcessStatus = z.enum([
  "uploaded",
  "processing",
  "finished",
]);

/* ---------------------------------- other --------------------------------- */
