--Create Functions
CREATE OR REPLACE FUNCTION public.func_last_post(text, character)
 RETURNS integer
 LANGUAGE sql
 IMMUTABLE
AS $function$ select length($1)- length(regexp_replace($1, '.*' || $2,'')); $function$
;

-- Create Functions
CREATE OR REPLACE FUNCTION public.func_un_eight()
 RETURNS character
 LANGUAGE plpgsql
AS $function$ declare _serial char(8); _i int; _chars char(36) = 'abcdefghijklmnopqrstuvwxyz0123456789'; begin _serial = ''; for _i in 1 .. 8 loop _serial = _serial || substr(_chars, int4(floor(random() * length(_chars))), 1); end loop; return lower(_serial); end; $function$
;

-- Create Functions
CREATE OR REPLACE FUNCTION public.func_un_ten()
 RETURNS character
 LANGUAGE plpgsql
AS $function$ declare _serial char(10); _i int; _chars char(36) = 'abcdefghijklmnopqrstuvwxyz0123456789'; begin _serial = ''; for _i in 1 .. 10 loop _serial = _serial || substr(_chars, int4(floor(random() * length(_chars))), 1); end loop; return lower(_serial); end; $function$
;

-- CreateEnum
CREATE TYPE "e_event_payment" AS ENUM ('success', 'checkout', 'pending', 'failure', 'complete');

-- CreateEnum
CREATE TYPE "e_payment_acc_term" AS ENUM ('credit', 'debit');

-- CreateEnum
CREATE TYPE "e_state_editor_service" AS ENUM ('requested', 'approved', 'rejected', 'cancelled');

-- CreateEnum
CREATE TYPE "e_status_image_processing" AS ENUM ('uploaded', 'processing', 'finished');

-- CreateEnum
CREATE TYPE "e_type_business" AS ENUM ('ie', 'client', 'editor', 'customer');

-- CreateEnum
CREATE TYPE "e_type_client" AS ENUM ('standard', 'photographer');

-- CreateEnum
CREATE TYPE "e_type_content" AS ENUM ('editing extras', 'main images', 'floor plans', 'drone images', 'virtual tours', 'video content', 'custom content');

-- CreateEnum
CREATE TYPE "e_type_discount" AS ENUM ('percent', 'fixed');

-- CreateEnum
CREATE TYPE "e_type_file_content" AS ENUM ('source', 'output', 'project');

-- CreateEnum
CREATE TYPE "e_type_gst" AS ENUM ('inc', 'exc', 'no gst');

-- CreateEnum
CREATE TYPE "e_type_invoice" AS ENUM ('sales', 'purchase');

-- CreateEnum
CREATE TYPE "e_type_invoice_creation" AS ENUM ('system', 'ie team', 'client', 'editor', 'other');

-- CreateEnum
CREATE TYPE "e_type_payment" AS ENUM ('advance', 'monthly');

-- CreateEnum
CREATE TYPE "e_type_price" AS ENUM ('per image', 'per floor', 'flat rate');

-- CreateEnum
CREATE TYPE "e_type_rule_group" AS ENUM ('page', 'page-detail', 'function');

-- CreateTable
CREATE TABLE "address" (
    "id" SERIAL NOT NULL,
    "line1" VARCHAR(100) NOT NULL,
    "line2" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "postcode" VARCHAR(10),
    "country_id" INTEGER NOT NULL,
    "latitude" DECIMAL(16,12) NOT NULL,
    "longitude" DECIMAL(16,12) NOT NULL,
    "business_id" VARCHAR(8),
    "user_id" VARCHAR(8),
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_business_rule" (
    "id" SERIAL NOT NULL,
    "business_id" VARCHAR(8),
    "rule_name" VARCHAR(48) NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_business_rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_role" (
    "id" SERIAL NOT NULL,
    "role_name" VARCHAR(32) NOT NULL,
    "role_info" VARCHAR(500),
    "default_page" VARCHAR(100),
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "business_type" "e_type_business",
    "business_id" VARCHAR(8),
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_rr_role_rule" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "rule_name" VARCHAR(100) NOT NULL,
    "c" BOOLEAN NOT NULL DEFAULT false,
    "r" BOOLEAN NOT NULL DEFAULT false,
    "u" BOOLEAN NOT NULL DEFAULT false,
    "d" BOOLEAN NOT NULL DEFAULT false,
    "e" BOOLEAN NOT NULL DEFAULT false,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_role_rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_rule" (
    "id" SERIAL NOT NULL,
    "rule_name" VARCHAR(48) NOT NULL,
    "display_name" VARCHAR(100),
    "rule_info" VARCHAR(500),
    "rule_group" "e_type_rule_group",
    "page_url" VARCHAR(100),
    "icon" VARCHAR(50),
    "menu_group" VARCHAR(50),
    "group_icon" VARCHAR(50),
    "access_types" VARCHAR(9) NOT NULL,
    "sort_order" INTEGER,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business" (
    "id" VARCHAR(90) NOT NULL DEFAULT func_un_eight(),
    "business_type" "e_type_business" NOT NULL,
    "business_name" VARCHAR(96) NOT NULL,
    "display_name" VARCHAR(96) NOT NULL,
    "owner_user_id" VARCHAR(90) NOT NULL,
    "client_type" "e_type_client",
    "payment_type" "e_type_payment",
    "balance" DECIMAL(90,2) DEFAULT 0,
    "last_transaction_id" VARCHAR(100),
    "stripe_code" VARCHAR(100),
    "gov_id" VARCHAR(48),
    "max_jobs_per_editor" INTEGER,
    "logo" VARCHAR(100),
    "phone_no" VARCHAR(13),
    "website" VARCHAR(253),
    "addr_line1" VARCHAR(48),
    "addr_line2" VARCHAR(48),
    "city" VARCHAR(48),
    "postcode" VARCHAR(10),
    "country_id" INTEGER NOT NULL,
    "currency_id" INTEGER NOT NULL,
    "legal_privacy_agreed_on" TIMESTAMP(3),
    "legal_terms_agreed_on" TIMESTAMP(3),
    "updated_by" VARCHAR(90),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(90),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(90),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_legacy" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_customer" (
    "id" BIGSERIAL NOT NULL,
    "client_business_id" VARCHAR(8) NOT NULL,
    "customer_business_id" VARCHAR(8) NOT NULL,
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_preference" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(8) NOT NULL,
    "service_category_id" INTEGER NOT NULL,
    "preference" TEXT,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_legacy" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "client_preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_service" (
    "id" SERIAL NOT NULL,
    "service_category_id" INTEGER NOT NULL,
    "service_name" VARCHAR(48) NOT NULL,
    "description" TEXT NOT NULL,
    "preview_image" VARCHAR(200) NOT NULL,
    "business_id" VARCHAR(8) NOT NULL,
    "notes" TEXT,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_file" (
    "id" BIGSERIAL NOT NULL,
    "order_id" VARCHAR(8) NOT NULL,
    "content_type" "e_type_file_content" NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_type" VARCHAR(75) NOT NULL,
    "file_mime" VARCHAR(75),
    "file_size" BIGINT,
    "file_path" TEXT NOT NULL,
    "revised_file_id" BIGINT,
    "processing_status" "e_status_image_processing" NOT NULL DEFAULT 'uploaded'::e_status_image_processing,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_legacy" BOOLEAN NOT NULL DEFAULT false,
    "file_cdn" TEXT,
    "upload_id" VARCHAR(10) DEFAULT func_un_ten(),

    CONSTRAINT "content_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_folder" (
    "id" BIGSERIAL NOT NULL,
    "order_id" VARCHAR(8) NOT NULL,
    "content_type" "e_type_file_content" NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_qty" SMALLINT,
    "file_size" SMALLINT,
    "file_path" TEXT NOT NULL,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_legacy" BOOLEAN NOT NULL DEFAULT false,
    "file_cdn" TEXT,
    "upload_id" VARCHAR(10) DEFAULT func_un_ten(),

    CONSTRAINT "content_folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_folder_file" (
    "id" BIGSERIAL NOT NULL,
    "file_id" BIGINT NOT NULL,
    "folder_id" BIGINT NOT NULL,
    "content_type" "e_type_file_content" NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_legacy" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "content_folder_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_folder_folder" (
    "id" BIGSERIAL NOT NULL,
    "parent_folder_id" BIGINT NOT NULL,
    "child_folder_id" BIGINT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_legacy" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "content_folder_folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country" (
    "id" SERIAL NOT NULL,
    "country_name" VARCHAR(100) NOT NULL,
    "capital_city" VARCHAR(100),
    "iso2" VARCHAR(2) NOT NULL,
    "iso3" VARCHAR(3) NOT NULL,
    "isd_code" VARCHAR(8),
    "currency_code" VARCHAR(3) NOT NULL,
    "currency_name" VARCHAR(100) NOT NULL,
    "currency_symbol" VARCHAR(10),
    "has_price" BOOLEAN NOT NULL DEFAULT false,
    "region" VARCHAR(100),

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currency_rates" (
    "id" BIGSERIAL NOT NULL,
    "currency_id" INTEGER NOT NULL,
    "rate_per_usd" DECIMAL(12,6) NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "currency_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(8) NOT NULL,
    "delivery_name" VARCHAR(100) NOT NULL,
    "delivery_address" VARCHAR(200) NOT NULL,
    "quantity" SMALLINT NOT NULL,
    "notes" TEXT,
    "order_state_id" SMALLINT NOT NULL,
    "project_id" VARCHAR(8),
    "is_auto_delivery" BOOLEAN NOT NULL DEFAULT false,
    "delivery_email" VARCHAR(200),
    "is_delivered" BOOLEAN NOT NULL DEFAULT false,
    "invoice_id" VARCHAR(8),
    "z_cloud_link_url" VARCHAR(200),
    "z_completed_file_path" TEXT,
    "z_completed_zip_file_path" TEXT,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_type_content" (
    "id" SERIAL NOT NULL,
    "delivery_id" INTEGER NOT NULL,
    "content_type" "e_type_content" NOT NULL,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMPTZ(6),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "delivery_type_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount" (
    "id" SERIAL NOT NULL,
    "discount_name" VARCHAR(100) NOT NULL,
    "discount_type" "e_type_discount" NOT NULL DEFAULT 'percent'::e_type_discount,
    "discount_value" JSONB,
    "discount_percent" DECIMAL(4,2),
    "description" TEXT,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "legacy_discount_id" VARCHAR(10),

    CONSTRAINT "discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_level" (
    "id" SERIAL NOT NULL,
    "discount_id" INTEGER,
    "service_id" INTEGER,
    "client_business_id" VARCHAR(255),
    "client_type" "e_type_client",
    "created_by" VARCHAR(255),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_legacy" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "discount_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "editor_bus_service" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER NOT NULL,
    "service_type_id" INTEGER,
    "parent_service_id" INTEGER,
    "business_id" VARCHAR(8) NOT NULL,
    "price" DECIMAL(8,2) NOT NULL,
    "state" "e_state_editor_service" NOT NULL DEFAULT 'requested'::e_state_editor_service,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_legacy" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "editor_bus_service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "editor_user_service" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER NOT NULL,
    "service_type_id" INTEGER,
    "parent_service_id" INTEGER,
    "user_id" VARCHAR(8) NOT NULL,
    "price" DECIMAL(8,2) NOT NULL,
    "state" "e_state_editor_service" NOT NULL DEFAULT 'requested'::e_state_editor_service,
    "get_email_alert" BOOLEAN NOT NULL DEFAULT false,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_legacy" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "editor_user_service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice" (
    "id" VARCHAR(8) NOT NULL DEFAULT func_un_eight(),
    "seller_business_id" VARCHAR(8) NOT NULL,
    "seller_user_id" VARCHAR(8),
    "buyer_business_id" VARCHAR(8) NOT NULL,
    "buyer_user_id" VARCHAR(8),
    "currency_id" SMALLINT NOT NULL,
    "tax_gst_type" "e_type_gst" DEFAULT 'no gst'::e_type_gst,
    "gross_amount" DECIMAL(8,2) NOT NULL,
    "discount" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "net_amount" DECIMAL(8,2) NOT NULL,
    "usd_net_amount" DECIMAL(10,6) NOT NULL,
    "usd_rate" DECIMAL(10,6) NOT NULL,
    "date_due" VARCHAR(255),
    "date_follow_up" DATE,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "payment_intent" VARCHAR(100),
    "payment_term" "e_type_payment",
    "description" TEXT,
    "notes" TEXT,
    "invoice_type" "e_type_invoice" NOT NULL,
    "invoice_creation_method" "e_type_invoice_creation" NOT NULL DEFAULT 'system'::e_type_invoice_creation,
    "w_legacy_invoice_id" VARCHAR(24),
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_item" (
    "id" SERIAL NOT NULL,
    "invoice_id" VARCHAR(8) NOT NULL,
    "order_id" VARCHAR(8),
    "gross_amount" DECIMAL(8,2) NOT NULL,
    "discount" DECIMAL(8,2) NOT NULL,
    "tax_amount" DECIMAL(8,2) NOT NULL,
    "net_amount" DECIMAL(8,2) NOT NULL,
    "usd_net_amount" DECIMAL(10,6) NOT NULL,
    "usd_rate" DECIMAL(10,6) NOT NULL,
    "description" TEXT NOT NULL,
    "img_qty" SMALLINT NOT NULL,
    "img_per_rate" DECIMAL(8,2) NOT NULL,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_receipt" (
    "id" SERIAL NOT NULL,
    "invoice_id" VARCHAR(8) NOT NULL,
    "receipt_id" VARCHAR(8) NOT NULL,
    "amount_applied" DECIMAL(8,2) NOT NULL,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_token" (
    "id" BIGSERIAL NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "invoice_id" VARCHAR(8) NOT NULL,
    "expiry_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_api" (
    "id" BIGSERIAL NOT NULL,
    "request_url" TEXT,
    "server_action" TEXT NOT NULL,
    "input_params" JSONB,
    "output_params" JSONB,
    "ipaddress" INET,
    "remarks" TEXT,
    "errors" TEXT,
    "called_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL,
    "date_completed_on" TIMESTAMP(3),
    "http_code" INTEGER,
    "session_id" VARCHAR(100),
    "log_id" VARCHAR(20),

    CONSTRAINT "log_api_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_type" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "log_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_detail" (
    "id" BIGSERIAL NOT NULL,
    "order_id" VARCHAR(8) NOT NULL,
    "service_id" SMALLINT NOT NULL,
    "service_type_id" SMALLINT,
    "quantity" SMALLINT NOT NULL,
    "quantity_processed" SMALLINT,
    "currency_id" SMALLINT NOT NULL,
    "tax_gst_type" "e_type_gst" DEFAULT 'no gst'::e_type_gst,
    "price_per_unit" DECIMAL(8,2) NOT NULL,
    "discount_id" INTEGER,
    "discount_amount" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "gross_amount" DECIMAL(8,2) NOT NULL,
    "tax_rate" DECIMAL(8,2),
    "tax_amount" DECIMAL(8,2),
    "net_amount" DECIMAL(8,2) NOT NULL,
    "usd_rate" DECIMAL(10,6) NOT NULL,
    "usd_net_amount" DECIMAL(10,6) NOT NULL,
    "editor_bus_rate" DECIMAL(8,2),
    "editor_bus_total" DECIMAL(8,2),
    "editor_user_rate" DECIMAL(8,2),
    "editor_user_total" DECIMAL(8,2),
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_legacy" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "order_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_invoice" (
    "id" SERIAL NOT NULL,
    "order_id" VARCHAR(8) NOT NULL,
    "invoice_id" VARCHAR(8) NOT NULL,
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_legacy" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "order_invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_log" (
    "id" BIGSERIAL NOT NULL,
    "order_id" VARCHAR(8) NOT NULL,
    "state_id" INTEGER,
    "event" VARCHAR(48),
    "notes" TEXT,
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "log_type_id" INTEGER,

    CONSTRAINT "order_log_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_log_payment" (
    "id" BIGSERIAL NOT NULL,
    "order_id" VARCHAR(8),
    "invoice_id" VARCHAR(8),
    "event_id" VARCHAR(100) NOT NULL,
    "order_event" "e_event_payment" NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_log_payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_main" (
    "id" VARCHAR(8) NOT NULL DEFAULT func_un_eight(),
    "service_code" VARCHAR(6) NOT NULL,
    "state_id" SMALLINT NOT NULL,
    "order_name" VARCHAR(255) NOT NULL,
    "project_id" VARCHAR(8),
    "client_business_id" VARCHAR(8),
    "date_due_on" TIMESTAMP(3),
    "date_completed_on" TIMESTAMP(3),
    "order_start_wait" SMALLINT NOT NULL DEFAULT 0,
    "order_wait_time" TIMESTAMP(3),
    "editor_business_id" VARCHAR(8),
    "editor_user_id" VARCHAR(8),
    "editor_qc_id" VARCHAR(8),
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "payment_intent" VARCHAR(100),
    "payment_term" "e_type_payment" NOT NULL,
    "z_file_source_zip_path" TEXT,
    "z_file_output_zip_path" TEXT,
    "z_file_project_zip_path" TEXT,
    "notes" TEXT,
    "has_sales_inv" BOOLEAN NOT NULL DEFAULT false,
    "has_purchase_inv" BOOLEAN NOT NULL DEFAULT false,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_legacy" BOOLEAN NOT NULL DEFAULT false,
    "client_user_id" VARCHAR(8),

    CONSTRAINT "order_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_state" (
    "id" SERIAL NOT NULL,
    "state_name" VARCHAR(32) NOT NULL,
    "state_color" VARCHAR(24),
    "description" TEXT,
    "sort_order" INTEGER,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" VARCHAR(8) NOT NULL DEFAULT func_un_eight(),
    "project_name" VARCHAR(100),
    "project_address" VARCHAR(200),
    "business_id" VARCHAR(8) NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipt" (
    "id" VARCHAR(8) NOT NULL DEFAULT func_un_eight(),
    "payment_date" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(8,2) NOT NULL,
    "usd_rate" DECIMAL(10,6) NOT NULL,
    "payment_ref" VARCHAR(48) NOT NULL,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_access" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER NOT NULL,
    "service_type_id" INTEGER,
    "parent_service_id" INTEGER,
    "business_id" VARCHAR(8) NOT NULL,
    "state" "e_state_editor_service" NOT NULL DEFAULT 'requested'::e_state_editor_service,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_legacy" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "service_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_addon" (
    "id" SERIAL NOT NULL,
    "parent_service_id" INTEGER NOT NULL,
    "addon_service_id" INTEGER NOT NULL,
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_addon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_category" (
    "id" SERIAL NOT NULL,
    "service_category_code" VARCHAR(6) NOT NULL,
    "service_category_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "preview_image" VARCHAR(200),
    "sort_order" INTEGER,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_main" (
    "id" SERIAL NOT NULL,
    "service_code" VARCHAR(6) NOT NULL,
    "service_name" VARCHAR(100) NOT NULL,
    "service_category_id" INTEGER NOT NULL,
    "description" TEXT,
    "client_access" VARCHAR(6),
    "client_type" "e_type_client" NOT NULL,
    "default_due_time" INTEGER NOT NULL,
    "is_addon" BOOLEAN NOT NULL DEFAULT false,
    "icon" VARCHAR(48),
    "preview_image" VARCHAR(200),
    "project_files_required" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" DECIMAL(4,2),
    "notes" TEXT,
    "instructions" TEXT,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_legacy" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "service_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_price" (
    "service_id" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "service_type_id" INTEGER,
    "price_type" "e_type_price" NOT NULL,
    "gross_price" JSONB NOT NULL,
    "tax_rate" JSONB NOT NULL,
    "retail_price" JSONB NOT NULL,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_legacy" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "service_price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_type" (
    "id" SERIAL NOT NULL,
    "service_type_code" VARCHAR(6) NOT NULL,
    "service_type_name" VARCHAR(100) NOT NULL,
    "service_category_id" INTEGER NOT NULL,
    "description" TEXT,
    "preview_image" VARCHAR(200),
    "sort_order" INTEGER,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMPTZ(6),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMPTZ(6),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "sid" VARCHAR(255) NOT NULL,
    "sess" JSON NOT NULL,
    "expired" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "user_main" (
    "user_id" VARCHAR(8) NOT NULL DEFAULT func_un_eight(),
    "name_first" VARCHAR(100) NOT NULL,
    "name_last" VARCHAR(100),
    "email_id" VARCHAR(200) NOT NULL,
    "role_id" INTEGER NOT NULL,
    "business_id" VARCHAR(8),
    "title" VARCHAR(200),
    "phone_no" VARCHAR(15),
    "pass" VARCHAR(256),
    "pass_reset_token" UUID,
    "pass_reset_token_expiry" TIMESTAMP(3),
    "last_login_ip" INET,
    "last_login_time" TIMESTAMP(3),
    "profile_image" VARCHAR(100),
    "max_jobs" INTEGER,
    "stripe_code" VARCHAR(100),
    "addr_line1" VARCHAR(100),
    "addr_line2" VARCHAR(100),
    "city" VARCHAR(48),
    "postcode" VARCHAR(10),
    "country_id" INTEGER,
    "updated_by" VARCHAR(8),
    "updated_on" TIMESTAMP(3),
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_legacy" BOOLEAN NOT NULL DEFAULT false,
    "email_verified" TIMESTAMP(6),
    "email_token" VARCHAR(200),

    CONSTRAINT "user_main_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_parent_child" (
    "id" SERIAL NOT NULL,
    "parent_user_id" VARCHAR(8) NOT NULL,
    "child_user_id" VARCHAR(8) NOT NULL,
    "deleted_by" VARCHAR(8),
    "deleted_on" TIMESTAMP(3),
    "created_by" VARCHAR(8),
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_parent_child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "w_knex_migration" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "batch" INTEGER,
    "migration_time" TIMESTAMPTZ(6),

    CONSTRAINT "w_knex_migration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "w_knex_migration_lock" (
    "index" SERIAL NOT NULL,
    "is_locked" INTEGER,

    CONSTRAINT "w_knex_migration_lock_pkey" PRIMARY KEY ("index")
);

-- CreateTable
CREATE TABLE "wallet_balance" (
    "id" VARCHAR(255) NOT NULL DEFAULT func_un_eight(),
    "transaction_id" VARCHAR(255),
    "payment_intent" VARCHAR(255),
    "description" VARCHAR(255),
    "invoice_id" VARCHAR(255),
    "amount" DECIMAL(8,2),
    "state" "e_event_payment",
    "business_id" VARCHAR(255),
    "updated_by" VARCHAR(255),
    "updated_on" TIMESTAMP(3),
    "created_by" VARCHAR(255),
    "created_on" TIMESTAMP(3),

    CONSTRAINT "wallet_balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wappler_migrations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "batch" INTEGER,
    "migration_time" TIMESTAMPTZ(6),

    CONSTRAINT "wappler_migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wappler_migrations_lock" (
    "index" SERIAL NOT NULL,
    "is_locked" INTEGER,

    CONSTRAINT "wappler_migrations_lock_pkey" PRIMARY KEY ("index")
);

-- CreateTable
CREATE TABLE "zz_temp_interim_userdet_client_service" (
    "user_id" VARCHAR(8),
    "business_id" VARCHAR(8),
    "serviceaccess" VARCHAR(128),
    "service_id" SMALLINT
);

-- CreateTable
CREATE TABLE "zz_temp_invoice_order_mapping" (
    "invoice_id" VARCHAR(8),
    "relcomporders" TEXT
);

-- CreateTable
CREATE TABLE "zz_temp_order_output_file" (
    "zzz_order_id" VARCHAR(32),
    "order_id" VARCHAR(8),
    "files_source" TEXT,
    "thumb_source" TEXT
);

-- CreateTable
CREATE TABLE "zz_temp_order_project_file" (
    "zzz_order_id" VARCHAR(32),
    "order_id" VARCHAR(8),
    "files_project" TEXT
);

-- CreateTable
CREATE TABLE "zz_temp_order_source_file" (
    "zzz_order_id" VARCHAR(32),
    "order_id" VARCHAR(8),
    "file_source" TEXT
);

-- CreateTable
CREATE TABLE "zz_temp_order_zipped_completed" (
    "zzz_order_id" VARCHAR(32),
    "order_id" VARCHAR(8),
    "zipcompleted" TEXT
);

-- CreateTable
CREATE TABLE "zz_temp_order_zipped_project" (
    "zzz_order_id" VARCHAR(32),
    "order_id" VARCHAR(8),
    "zipproject" TEXT
);

-- CreateTable
CREATE TABLE "zz_temp_order_zipped_source" (
    "zzz_order_id" VARCHAR(32),
    "order_id" VARCHAR(8),
    "zipsource" TEXT,
    "order_state_id" SMALLINT
);

-- CreateTable
CREATE TABLE "zz_temp_project_order" (
    "zzz_project_id" VARCHAR(32),
    "project_id" VARCHAR(8),
    "zzz_order_id" VARCHAR(100)
);

-- CreateTable
CREATE TABLE "zz_temp_user_parent_child" (
    "parent_user_id" VARCHAR(32),
    "m_owner_id" VARCHAR(8),
    "child_user_id" VARCHAR(32)
);

-- CreateTable
CREATE TABLE "zzz_business" (
    "Address" TEXT,
    "BusinessName" TEXT,
    "BusType" TEXT,
    "Currency" TEXT,
    "Email" TEXT,
    "GovID" TEXT,
    "IDBusiness" TEXT,
    "JobsPerEditor" INTEGER,
    "Legal_PrivacyAgreed" TIMESTAMP(6),
    "Legal_TermsAgreed" TIMESTAMP(6),
    "Logo" TEXT,
    "MessagingApp" TEXT,
    "PaymentDetails" TEXT,
    "PhoneText" TEXT,
    "RelOwnerDets" TEXT,
    "RelTeamUserDets" TEXT,
    "Status" TEXT,
    "Website" TEXT,
    "z_deprec_Currency" TEXT,
    "z_deprec_Phone" TEXT,
    "z_deprec_Status" TEXT,
    "z_deprec_Type" TEXT,
    "zz_depre_BusinessNumber" TEXT,
    "zz_depre_stripe_seller_id_bus" TEXT,
    "zz_deprec_RelOwnerDets" TEXT,
    "zz_deprec_Set_RelHideEditingPricing_UserDets" TEXT,
    "zz_deprec_Set_RelTeamPayEditingUserDets" TEXT,
    "Creation_Date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "Modified_Date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "Slug" TEXT,
    "Creator" TEXT,
    "unique_id" TEXT,
    "is_deleted" BOOLEAN DEFAULT false,
    "business_id" VARCHAR(8)
);

-- CreateTable
CREATE TABLE "zzz_customer" (
    "BusinessName" TEXT,
    "Copy_First_Last" TEXT,
    "DateEmailSignUp" TIMESTAMP(6),
    "IDCustomer" TEXT,
    "IEServiceAccess" TEXT,
    "ImageRatio" TEXT,
    "PeNotesPrivate" TEXT,
    "RelCustUserDets" TEXT,
    "RelLogo" TEXT,
    "RelPEBus" TEXT,
    "RelPeUserDets" TEXT,
    "RelWatermark" TEXT,
    "Creation_Date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "Modified_Date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "Slug" TEXT,
    "Creator" TEXT,
    "unique_id" TEXT,
    "is_deleted" BOOLEAN DEFAULT false
);

-- CreateTable
CREATE TABLE "zzz_discount" (
    "Description" TEXT,
    "DiscountType" TEXT,
    "DisPercentage" DECIMAL(12,4),
    "DisRate_AUD" DECIMAL(12,4),
    "DisRate_CAD" DECIMAL(12,4),
    "DisRate_EUR" DECIMAL(12,4),
    "DisRate_GBP" DECIMAL(12,4),
    "DisRate_NZD" DECIMAL(12,4),
    "DisRate_USD" DECIMAL(12,4),
    "EntityType" TEXT,
    "ExpirationDate" TIMESTAMP(6),
    "IDDiscount" TEXT,
    "RelReferral" TEXT,
    "RelRefUserDets" TEXT,
    "RelRoleUser" TEXT,
    "RelServiceList" TEXT,
    "RelUserUserDets" TEXT,
    "zz_deprec_ClientRoles" TEXT,
    "Creation_Date" TIMESTAMP(6),
    "Modified_Date" TIMESTAMP(6),
    "Slug" TEXT,
    "Creator" TEXT,
    "unique_id" TEXT,
    "is_deleted" BOOLEAN DEFAULT false,
    "discount_id" SERIAL NOT NULL
);

-- CreateTable
CREATE TABLE "zzz_invoice" (
    "CreatedBySoftware" TEXT,
    "Currency" TEXT,
    "EmailFollowDate" TEXT,
    "IE_Cost" TEXT,
    "IE_Rev" DECIMAL(12,4),
    "IE_Rev_USD_Equiv" DECIMAL(12,4),
    "Inv_Amount" DECIMAL(12,4),
    "Inv_Date_Due" TIMESTAMP(6),
    "Inv_Date_Paid" TIMESTAMP(6),
    "Inv_Description" TEXT,
    "Inv_Discount_Amount" DECIMAL(12,4),
    "Inv_GST_Amount" DECIMAL(12,4),
    "Inv_GST_IncExc" TEXT,
    "Inv_GST_Rate" BIGINT,
    "Inv_GST_Type" TEXT,
    "Inv_ID_Invoice" TEXT,
    "Inv_Month_Year" TEXT,
    "Inv_Note" TEXT,
    "Inv_Receipt_Link_Info" TEXT,
    "Inv_Status" TEXT,
    "Inv_Status_Note" TEXT,
    "InvType" TEXT,
    "OthStripeUse" TEXT,
    "Pay_Air_Id_Intent" TEXT,
    "Pay_Stripe_SessionIds" TEXT,
    "QRCode" TEXT,
    "Rating_Avg" TEXT,
    "RelBookingList" TEXT,
    "RelCompOrders" TEXT,
    "RelCreatorBus" TEXT,
    "RelCreatorDets" TEXT,
    "RelDiscounts" TEXT,
    "RelEEBus" TEXT,
    "RelEEUserDets" TEXT,
    "RelERBus" TEXT,
    "RelERUserDets" TEXT,
    "RelLineItem" TEXT,
    "TestTest" TEXT,
    "z_deprec_Inv_Inv_Frequency" TEXT,
    "z_deprec_Inv_Inv_Type" TEXT,
    "z_derpec_Inv_GST_IncExc" TEXT,
    "zz_depre_Inv_Note_Payment" TEXT,
    "zz_depre_Inv_Web_Url" TEXT,
    "zz_deprec_Inv_Currency" TEXT,
    "zz_deprec_Inv_Status" TEXT,
    "zz_deprec_RelEEUserDets" TEXT,
    "zz_deprec_RelERUserDets" TEXT,
    "Creation_Date" TIMESTAMP(6),
    "Modified_Date" TIMESTAMP(6),
    "Slug" TEXT,
    "Creator" TEXT,
    "unique_id" TEXT,
    "is_deleted" BOOLEAN DEFAULT false,
    "invoice_id" VARCHAR(8)
);

-- CreateTable
CREATE TABLE "zzz_job_app" (
    "EditorCost" DECIMAL(12,4),
    "RelEditorUserDets" TEXT,
    "RelServiceList" TEXT,
    "StatusJob" TEXT,
    "zz_depre_ServiceCode" TEXT,
    "zz_depre_ServiceType" TEXT,
    "zz_depre_Turnaround" BIGINT,
    "zz_deprec_Status" TEXT,
    "Creation_Date" TIMESTAMP(6),
    "Modified_Date" TIMESTAMP(6),
    "Slug" TEXT,
    "Creator" TEXT,
    "unique_id" TEXT,
    "is_deleted" BOOLEAN DEFAULT false
);

-- CreateTable
CREATE TABLE "zzz_logo" (
    "BusinessName" TEXT,
    "Generic" TEXT,
    "IDLogo" TEXT,
    "LogoUrl" TEXT,
    "RelCustomers" TEXT,
    "RelPEBus" TEXT,
    "RelPEUserDets" TEXT,
    "Type" TEXT,
    "Creation_Date" TIMESTAMP(6),
    "Modified_Date" TIMESTAMP(6),
    "Slug" TEXT,
    "Creator" TEXT,
    "unique_id" TEXT,
    "is_deleted" BOOLEAN DEFAULT false
);

-- CreateTable
CREATE TABLE "zzz_order" (
    "CloudLink" TEXT,
    "Currency" TEXT,
    "DateCloudWait" TIMESTAMP(6),
    "DateCompleted" TIMESTAMP(6),
    "DateDue" TIMESTAMP(6),
    "DatesCompUpload" TEXT,
    "DateStatusLastChange" TIMESTAMP(6),
    "EditorBusRate" DECIMAL(12,4),
    "EditorBusTotal" DECIMAL(12,4),
    "EditorImgCount" TEXT,
    "EditorRate" DECIMAL(12,4),
    "EditorTotal" DECIMAL(12,4),
    "EmailCompLog" TEXT,
    "FilesCompleted" TEXT,
    "FilesPreCompleted" TEXT,
    "FilesProject" TEXT,
    "FilesSource" TEXT,
    "FLMeasurement" TEXT,
    "FLSiteplanAddon" TEXT,
    "FLStyle" TEXT,
    "IDOrder" TEXT,
    "IEDiscountAmount" DECIMAL(12,4),
    "IERate" DECIMAL(12,4),
    "IESubTotal" DECIMAL(12,4),
    "IETotalSale" DECIMAL(12,4),
    "IEUSDEquiv" DECIMAL(12,4),
    "LowRateContact" TEXT,
    "NoOf" BIGINT,
    "Notes" TEXT,
    "OrderTitle" TEXT,
    "QCProcessing" TEXT,
    "QCRelUserDets" TEXT,
    "Rating" TEXT,
    "RelClientUserDets" TEXT,
    "RelDiscount" TEXT,
    "RelEditorBus" TEXT,
    "RelEditorUserDets" TEXT,
    "RelInvoice" TEXT,
    "RelPEBus" TEXT,
    "RelProject" TEXT,
    "RelServiceList" TEXT,
    "StatusOrder" TEXT,
    "StatusPayment" TEXT,
    "ZipCompleted" TEXT,
    "ZipProject" TEXT,
    "ZipSource" TEXT,
    "zz_depre_ServiceCode" TEXT,
    "zz_depre_ServiceType" TEXT,
    "zz_deprec_Currency" TEXT,
    "zz_deprec_RelClientUserDets" TEXT,
    "zz_deprec_RelEditorUserDets" TEXT,
    "zz_deprec_StatusOrder" TEXT,
    "zz_deprec_StatusPayment" TEXT,
    "Creation_Date" TIMESTAMP(6),
    "Modified_Date" TIMESTAMP(6),
    "Slug" TEXT,
    "Creator" TEXT,
    "unique_id" TEXT,
    "is_deleted" BOOLEAN DEFAULT false,
    "order_id" VARCHAR(8)
);

-- CreateTable
CREATE TABLE "zzz_preference" (
    "Preference" TEXT,
    "RelUserDets" TEXT,
    "ServiceCategory" TEXT,
    "ServiceCodes" TEXT,
    "zz_deprec_RelPEUserDets" TEXT,
    "Creation_Date" TIMESTAMPTZ(6),
    "Modified_Date" TIMESTAMPTZ(6),
    "Slug" TEXT,
    "Creator" TEXT,
    "unique_id" TEXT,
    "is_deleted" BOOLEAN DEFAULT false
);

-- CreateTable
CREATE TABLE "zzz_project" (
    "Address" TEXT,
    "IDProject" TEXT,
    "Name" TEXT,
    "RelBookings" TEXT,
    "RelBus" TEXT,
    "RelClientUserDets" TEXT,
    "RelDelivery" TEXT,
    "RelInvoices" TEXT,
    "RelOrders" TEXT,
    "RelPropertySite" TEXT,
    "zz_derpec_RelClientUserDets" TEXT,
    "Creation_Date" DATE,
    "Modified_Date" DATE,
    "Slug" TEXT,
    "Creator" TEXT,
    "unique_id" TEXT,
    "project_id" VARCHAR(8)
);

-- CreateTable
CREATE TABLE "zzz_service_list" (
    "AlertEditorRelUserDets" TEXT,
    "Category" TEXT,
    "ClientAccess" TEXT,
    "ClientRole" TEXT,
    "CurAUD" DECIMAL(12,4),
    "CurCAD" DECIMAL(12,4),
    "CurEUR" DECIMAL(12,4),
    "CurGBP" DECIMAL(12,4),
    "CurNZD" DECIMAL(12,4),
    "CurUSD" DECIMAL(12,4),
    "Description" TEXT,
    "IconFeather" TEXT,
    "IEInternalNotes" TEXT,
    "Instructions" TEXT,
    "OrderToList" DECIMAL(12,4),
    "QuantityType" TEXT,
    "RelServiceList" TEXT,
    "ServiceCode" TEXT,
    "ServiceStatus" TEXT,
    "ServiceType" TEXT,
    "ServiceTypeSubSub" TEXT,
    "Thumb" TEXT,
    "Turnaround_hr" BIGINT,
    "z_deprec_Category" TEXT,
    "z_deprec_ClientType" TEXT,
    "z_deprec_ServiceTypeSub" TEXT,
    "Creation_Date" TIMESTAMP(6),
    "Modified_Date" TIMESTAMP(6),
    "Slug" TEXT,
    "Creator" TEXT,
    "unique_id" TEXT,
    "is_deleted" BOOLEAN DEFAULT false,
    "service_id" SMALLSERIAL NOT NULL
);

-- CreateTable
CREATE TABLE "zzz_user" (
    "Cover_photo" TEXT,
    "Date_agreed_to_terms_and_privacy_docs" TIMESTAMP(6),
    "Date_signup_completed" TIMESTAMP(6),
    "b_First" TEXT,
    "First_Last" TEXT,
    "Inactive" TEXT,
    "b_Last" TEXT,
    "Last_login" TIMESTAMP(6),
    "Pending_email_verification" TEXT,
    "RateEmailVerLast" TIMESTAMP(6),
    "RatePasswordCount" TEXT,
    "RatePasswordLast" TEXT,
    "RateResetEmailLast" TEXT,
    "RelUserDetails" TEXT,
    "b_Role" TEXT,
    "Signup_method" TEXT,
    "Signup_step" BIGINT,
    "SignUpNote" TEXT,
    "SignUpNoteID" TEXT,
    "z_depre_Profile_picture" TEXT,
    "Creation_Date" TIMESTAMP(6),
    "Modified_Date" TIMESTAMP(6),
    "Slug" TEXT,
    "email" TEXT,
    "b_null" TEXT,
    "unique_id" TEXT,
    "is_deleted" BOOLEAN DEFAULT false
);

-- CreateTable
CREATE TABLE "zzz_user_dets" (
    "Address" TEXT,
    "CopyEmail" TEXT,
    "CopyFirstLast" TEXT,
    "Currency" TEXT,
    "ID_User" TEXT,
    "IeAccess" TEXT,
    "Main_Profile" TEXT,
    "Max_Jobs" INTEGER,
    "Path_Google_Cal" TEXT,
    "Path_Google_Cal_Id" TEXT,
    "Path_Google_CalColorEvent" TEXT,
    "Path_Quickbooks" TEXT,
    "Path_Xero" TEXT,
    "Pay_Air_Cust_Id" TEXT,
    "Pay_stripe_ie_indiv_cust" TEXT,
    "Pay_stripe_indivi_seller" TEXT,
    "Payment_Info" TEXT,
    "PaymentType" TEXT,
    "PhoneText" TEXT,
    "RelBus" TEXT,
    "RelCustomer" TEXT,
    "RelDataUsed" TEXT,
    "RelEmailNotifcation" TEXT,
    "RelEnLocation" TEXT,
    "RelPEWorkAreas" TEXT,
    "RelReffered" TEXT,
    "RelServiceListAccess" TEXT,
    "RelStaffPermissions" TEXT,
    "RelUser" TEXT,
    "b_Role" TEXT,
    "RoleBus" TEXT,
    "SignUp_By_Who" TEXT,
    "SignUp_Note" TEXT,
    "SignUp_Type" TEXT,
    "WebsiteDefault" TEXT,
    "z_deprec_Currency" TEXT,
    "z_deprec_Phone" TEXT,
    "z_deprec_Role" TEXT,
    "z_deprec_RoleBus" TEXT,
    "Creation_Date" TIMESTAMP(6),
    "Modified_Date" TIMESTAMP(6),
    "Slug" TEXT,
    "Creator" TEXT,
    "unique_id" TEXT,
    "is_deleted" BOOLEAN DEFAULT false,
    "user_id" VARCHAR(8)
);

-- CreateIndex
CREATE INDEX "ix_auth_business_rule_business_id" ON "auth_business_rule"("business_id");

-- CreateIndex
CREATE INDEX "ix_auth_business_rule_rule_name" ON "auth_business_rule"("rule_name");

-- CreateIndex
CREATE INDEX "ix_auth_role_business_id" ON "auth_role"("business_id");

-- CreateIndex
CREATE INDEX "ix_auth_role_is_system" ON "auth_role"("is_system");

-- CreateIndex
CREATE INDEX "ix_auth_role_type_business" ON "auth_role"("business_type");

-- CreateIndex
CREATE INDEX "ix_auth_role_rule_id" ON "auth_rr_role_rule"("role_id");

-- CreateIndex
CREATE INDEX "ix_auth_role_rule_name" ON "auth_rr_role_rule"("rule_name");

-- CreateIndex
CREATE UNIQUE INDEX "auth_rule_rule_name_unique" ON "auth_rule"("rule_name");

-- CreateIndex
CREATE UNIQUE INDEX "auth_rule_page_url_unique" ON "auth_rule"("page_url");

-- CreateIndex
CREATE UNIQUE INDEX "auth_rule_sort_order_unique" ON "auth_rule"("sort_order");

-- CreateIndex
CREATE INDEX "ix_auth_rule_name" ON "auth_rule"("rule_name");

-- CreateIndex
CREATE INDEX "ix_auth_rule_page_url" ON "auth_rule"("page_url");

-- CreateIndex
CREATE UNIQUE INDEX "business_id_unique" ON "business"("id");

-- CreateIndex
CREATE UNIQUE INDEX "business_business_name_unique" ON "business"("business_name");

-- CreateIndex
CREATE UNIQUE INDEX "business_owner_user_id_unique" ON "business"("owner_user_id");

-- CreateIndex
CREATE INDEX "ix_business_business_name" ON "business"("business_name");

-- CreateIndex
CREATE INDEX "ix_business_business_type" ON "business"("business_type");

-- CreateIndex
CREATE INDEX "ix_business_client_type" ON "business"("client_type");

-- CreateIndex
CREATE INDEX "ix_business_country_id" ON "business"("country_id");

-- CreateIndex
CREATE INDEX "ix_business_currency_id" ON "business"("currency_id");

-- CreateIndex
CREATE INDEX "ix_business_payment_type" ON "business"("payment_type");

-- CreateIndex
CREATE INDEX "ix_file_order_id" ON "content_file"("order_id");

-- CreateIndex
CREATE INDEX "ix_folder_order_id" ON "content_folder"("order_id");

-- CreateIndex
CREATE INDEX "ix_folder_file_file_content" ON "content_folder_file"("file_id");

-- CreateIndex
CREATE INDEX "ix_folder_file_folder_content" ON "content_folder_file"("folder_id");

-- CreateIndex
CREATE INDEX "ix_folder_folder_child" ON "content_folder_folder"("child_folder_id");

-- CreateIndex
CREATE INDEX "ix_folder_folder_parent" ON "content_folder_folder"("parent_folder_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_folder_folder_parent_folder_id_child_folder_id_unique" ON "content_folder_folder"("parent_folder_id", "child_folder_id");

-- CreateIndex
CREATE UNIQUE INDEX "country_country_name_unique" ON "country"("country_name");

-- CreateIndex
CREATE UNIQUE INDEX "country_iso2_unique" ON "country"("iso2");

-- CreateIndex
CREATE UNIQUE INDEX "country_iso3_unique" ON "country"("iso3");

-- CreateIndex
CREATE INDEX "ix_t_currency_rates_currency_id" ON "currency_rates"("currency_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_id_unique" ON "invoice"("id");

-- CreateIndex
CREATE INDEX "ix_invoice_buyer_business_id" ON "invoice"("buyer_business_id");

-- CreateIndex
CREATE INDEX "ix_invoice_buyer_user_id" ON "invoice"("buyer_user_id");

-- CreateIndex
CREATE INDEX "ix_invoice_invoice_date" ON "invoice"("created_on");

-- CreateIndex
CREATE INDEX "ix_invoice_seller_business_id" ON "invoice"("seller_business_id");

-- CreateIndex
CREATE INDEX "ix_invoice_seller_user_id" ON "invoice"("seller_user_id");

-- CreateIndex
CREATE INDEX "ix_invoice_receipt_invoices_id" ON "invoice_receipt"("invoice_id");

-- CreateIndex
CREATE INDEX "ix_invoice_receipt_receipt_id" ON "invoice_receipt"("receipt_id");

-- CreateIndex
CREATE INDEX "ix_t_log_called_by" ON "log_api"("called_by");

-- CreateIndex
CREATE INDEX "ix_t_log_completed_on" ON "log_api"("date_completed_on");

-- CreateIndex
CREATE INDEX "ix_t_log_created_on" ON "log_api"("created_on");

-- CreateIndex
CREATE INDEX "ix_t_log_input_params" ON "log_api"("input_params");

-- CreateIndex
CREATE INDEX "ix_t_log_server_action" ON "log_api"("server_action");

-- CreateIndex
CREATE INDEX "ix_order_detail_currency_id" ON "order_detail"("currency_id");

-- CreateIndex
CREATE INDEX "ix_order_detail_order_id" ON "order_detail"("order_id");

-- CreateIndex
CREATE INDEX "ix_order_detail_service_id" ON "order_detail"("service_id");

-- CreateIndex
CREATE INDEX "ix_order_detail_service_type_id" ON "order_detail"("service_type_id");

-- CreateIndex
CREATE INDEX "ix_order_log_state_order_id" ON "order_log"("order_id");

-- CreateIndex
CREATE INDEX "ix_order_log_state_state_id" ON "order_log"("state_id");

-- CreateIndex
CREATE INDEX "ix_order_payment_log_invoice_id" ON "order_log_payment"("invoice_id");

-- CreateIndex
CREATE INDEX "ix_order_payment_log_order_id" ON "order_log_payment"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_main_id_unique" ON "order_main"("id");

-- CreateIndex
CREATE INDEX "ix_orders_assigned_to_editor" ON "order_main"("editor_user_id");

-- CreateIndex
CREATE INDEX "ix_orders_client_business_id" ON "order_main"("client_business_id");

-- CreateIndex
CREATE INDEX "ix_orders_completed_on" ON "order_main"("date_completed_on");

-- CreateIndex
CREATE INDEX "ix_orders_due_on" ON "order_main"("date_due_on");

-- CreateIndex
CREATE INDEX "ix_orders_editor_business_id" ON "order_main"("editor_business_id");

-- CreateIndex
CREATE INDEX "ix_orders_is_paid" ON "order_main"("is_paid");

-- CreateIndex
CREATE INDEX "ix_orders_order_name" ON "order_main"("order_name");

-- CreateIndex
CREATE INDEX "ix_orders_project_id" ON "order_main"("project_id");

-- CreateIndex
CREATE INDEX "ix_orders_state_id" ON "order_main"("state_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_id_unique" ON "project"("id");

-- CreateIndex
CREATE UNIQUE INDEX "receipt_id_unique" ON "receipt"("id");

-- CreateIndex
CREATE UNIQUE INDEX "service_addon_parent_service_id_addon_service_id_unique" ON "service_addon"("parent_service_id", "addon_service_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_category_service_category_code_unique" ON "service_category"("service_category_code");

-- CreateIndex
CREATE UNIQUE INDEX "service_category_sort_order_unique" ON "service_category"("sort_order");

-- CreateIndex
CREATE INDEX "ix_service_category_service_category_code" ON "service_category"("service_category_code");

-- CreateIndex
CREATE INDEX "ix_service_category_service_category_name" ON "service_category"("service_category_name");

-- CreateIndex
CREATE INDEX "ix_service_category_sort_order" ON "service_category"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "service_main_service_code_unique" ON "service_main"("service_code");

-- CreateIndex
CREATE UNIQUE INDEX "service_main_sort_order_unique" ON "service_main"("sort_order");

-- CreateIndex
CREATE INDEX "ix_service_client_type" ON "service_main"("client_type");

-- CreateIndex
CREATE INDEX "ix_service_is_addon" ON "service_main"("is_addon");

-- CreateIndex
CREATE INDEX "ix_service_service_category_id" ON "service_main"("service_category_id");

-- CreateIndex
CREATE INDEX "ix_service_service_code" ON "service_main"("service_code");

-- CreateIndex
CREATE INDEX "ix_service_service_name" ON "service_main"("service_name");

-- CreateIndex
CREATE INDEX "ix_service_sort_order" ON "service_main"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "service_type_service_type_code_unique" ON "service_type"("service_type_code");

-- CreateIndex
CREATE UNIQUE INDEX "service_type_sort_order_unique" ON "service_type"("sort_order");

-- CreateIndex
CREATE INDEX "ix_service_type_service_type_code" ON "service_type"("service_type_code");

-- CreateIndex
CREATE INDEX "ix_service_type_service_type_name" ON "service_type"("service_type_name");

-- CreateIndex
CREATE INDEX "ix_service_type_sort_order" ON "service_type"("sort_order");

-- CreateIndex
CREATE INDEX "sessions_expired_index" ON "sessions"("expired");

-- CreateIndex
CREATE UNIQUE INDEX "user_main_user_id_unique" ON "user_main"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_main_email_id_unique" ON "user_main"("email_id");

-- CreateIndex
CREATE INDEX "ix_user_business_id" ON "user_main"("business_id");

-- CreateIndex
CREATE INDEX "ix_user_country_id" ON "user_main"("country_id");

-- CreateIndex
CREATE INDEX "ix_user_email_id" ON "user_main"("email_id");

-- CreateIndex
CREATE INDEX "ix_user_first_name" ON "user_main"("name_first");

-- CreateIndex
CREATE INDEX "ix_user_last_name" ON "user_main"("name_last");

-- CreateIndex
CREATE INDEX "ix_user_stripe_code" ON "user_main"("stripe_code");

-- CreateIndex
CREATE UNIQUE INDEX "user_parent_child_parent_user_id_child_user_id_unique" ON "user_parent_child"("parent_user_id", "child_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "zzz_order_order_id_key" ON "zzz_order"("order_id");

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "fk_con_business_id" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "fk_con_country_id" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "fk_con_user_id" FOREIGN KEY ("user_id") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_business_rule" ADD CONSTRAINT "fk_con_business_id" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_business_rule" ADD CONSTRAINT "fk_con_rule_name" FOREIGN KEY ("rule_name") REFERENCES "auth_rule"("rule_name") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_role" ADD CONSTRAINT "fk_con_business_id" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_role" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_role" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_role" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_rr_role_rule" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_rr_role_rule" ADD CONSTRAINT "fk_con_role_id" FOREIGN KEY ("role_id") REFERENCES "auth_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_rr_role_rule" ADD CONSTRAINT "fk_con_rule_name" FOREIGN KEY ("rule_name") REFERENCES "auth_rule"("rule_name") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_rr_role_rule" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_rule" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_rule" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_rule" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "fk_con_country_id" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "fk_con_currency_id" FOREIGN KEY ("currency_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "fk_con_owner_user_id" FOREIGN KEY ("owner_user_id") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "client_customer" ADD CONSTRAINT "fk_con_client_business_id" FOREIGN KEY ("client_business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "client_customer" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "client_customer" ADD CONSTRAINT "fk_con_customer_business_id" FOREIGN KEY ("customer_business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "client_preference" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "client_preference" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "client_preference" ADD CONSTRAINT "fk_con_service_category_id" FOREIGN KEY ("service_category_id") REFERENCES "service_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "client_preference" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "client_preference" ADD CONSTRAINT "fk_con_user_id" FOREIGN KEY ("user_id") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "client_service" ADD CONSTRAINT "fk_con_business_id" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "client_service" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "client_service" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "client_service" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content_file" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content_file" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content_file" ADD CONSTRAINT "fk_con_order_id" FOREIGN KEY ("order_id") REFERENCES "order_main"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content_file" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content_folder" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content_folder" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content_folder" ADD CONSTRAINT "fk_con_order_id" FOREIGN KEY ("order_id") REFERENCES "order_main"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content_folder" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content_folder_file" ADD CONSTRAINT "fk_con_file_id" FOREIGN KEY ("file_id") REFERENCES "content_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content_folder_file" ADD CONSTRAINT "fk_con_folder_id" FOREIGN KEY ("folder_id") REFERENCES "content_folder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content_folder_folder" ADD CONSTRAINT "fk_con_child_folder_id" FOREIGN KEY ("child_folder_id") REFERENCES "content_folder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content_folder_folder" ADD CONSTRAINT "fk_con_parent_folder_id" FOREIGN KEY ("parent_folder_id") REFERENCES "content_folder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "currency_rates" ADD CONSTRAINT "fk_con_currency_id" FOREIGN KEY ("currency_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery" ADD CONSTRAINT "fk_con_invoice_id" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery" ADD CONSTRAINT "fk_con_order_state_id" FOREIGN KEY ("order_state_id") REFERENCES "order_state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery" ADD CONSTRAINT "fk_con_project_id" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery" ADD CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery_type_content" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery_type_content" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery_type_content" ADD CONSTRAINT "fk_con_delivery_id" FOREIGN KEY ("delivery_id") REFERENCES "delivery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery_type_content" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "discount" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "discount" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "discount" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "discount_level" ADD CONSTRAINT "fk_con_client_business_id" FOREIGN KEY ("client_business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "discount_level" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "discount_level" ADD CONSTRAINT "fk_con_discount_id" FOREIGN KEY ("discount_id") REFERENCES "discount"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "discount_level" ADD CONSTRAINT "fk_con_service_id" FOREIGN KEY ("service_id") REFERENCES "service_main"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "editor_bus_service" ADD CONSTRAINT "fk_con_business_id" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "editor_bus_service" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "editor_bus_service" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "editor_bus_service" ADD CONSTRAINT "fk_con_parent_service_id" FOREIGN KEY ("parent_service_id") REFERENCES "service_main"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "editor_bus_service" ADD CONSTRAINT "fk_con_service_id" FOREIGN KEY ("service_id") REFERENCES "service_main"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "editor_bus_service" ADD CONSTRAINT "fk_con_service_type_id" FOREIGN KEY ("service_type_id") REFERENCES "service_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "editor_bus_service" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "editor_user_service" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "editor_user_service" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "editor_user_service" ADD CONSTRAINT "fk_con_parent_service_id" FOREIGN KEY ("parent_service_id") REFERENCES "service_main"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "editor_user_service" ADD CONSTRAINT "fk_con_service_id" FOREIGN KEY ("service_id") REFERENCES "service_main"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "editor_user_service" ADD CONSTRAINT "fk_con_service_type_id" FOREIGN KEY ("service_type_id") REFERENCES "service_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "editor_user_service" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "editor_user_service" ADD CONSTRAINT "fk_con_user_id" FOREIGN KEY ("user_id") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "fk_con_buyer_business_id" FOREIGN KEY ("buyer_business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "fk_con_buyer_user_id" FOREIGN KEY ("buyer_user_id") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "fk_con_currency_id" FOREIGN KEY ("currency_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "fk_con_seller_business_id" FOREIGN KEY ("seller_business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "fk_con_seller_user_id" FOREIGN KEY ("seller_user_id") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_item" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_item" ADD CONSTRAINT "fk_con_invoice_id" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_item" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_item" ADD CONSTRAINT "invoice_item_order_id_foreign" FOREIGN KEY ("order_id") REFERENCES "order_main"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_receipt" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_receipt" ADD CONSTRAINT "fk_con_invoice_id" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_receipt" ADD CONSTRAINT "fk_con_receipt_id" FOREIGN KEY ("receipt_id") REFERENCES "receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_receipt" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_token" ADD CONSTRAINT "fk_con_invoice_id" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "log_api" ADD CONSTRAINT "fk_con_called_by" FOREIGN KEY ("called_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_detail" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_detail" ADD CONSTRAINT "fk_con_currency_id" FOREIGN KEY ("currency_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_detail" ADD CONSTRAINT "fk_con_discount_id" FOREIGN KEY ("discount_id") REFERENCES "discount"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_detail" ADD CONSTRAINT "fk_con_order_id" FOREIGN KEY ("order_id") REFERENCES "order_main"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_detail" ADD CONSTRAINT "fk_con_service_id" FOREIGN KEY ("service_id") REFERENCES "service_main"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_detail" ADD CONSTRAINT "fk_con_service_type_id" FOREIGN KEY ("service_type_id") REFERENCES "service_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_detail" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_invoice" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_invoice" ADD CONSTRAINT "fk_con_invoice_id" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_invoice" ADD CONSTRAINT "fk_con_order_id" FOREIGN KEY ("order_id") REFERENCES "order_main"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_log" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_log" ADD CONSTRAINT "fk_con_log_type_id" FOREIGN KEY ("log_type_id") REFERENCES "log_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_main" ADD CONSTRAINT "fk_con_assigned_to_client" FOREIGN KEY ("client_user_id") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_main" ADD CONSTRAINT "fk_con_assigned_to_editor" FOREIGN KEY ("editor_user_id") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_main" ADD CONSTRAINT "fk_con_client_business_id" FOREIGN KEY ("client_business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_main" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_main" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_main" ADD CONSTRAINT "fk_con_editor_business_id" FOREIGN KEY ("editor_business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_main" ADD CONSTRAINT "fk_con_project_id" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_main" ADD CONSTRAINT "fk_con_qc_editor" FOREIGN KEY ("editor_qc_id") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_main" ADD CONSTRAINT "fk_con_service_code" FOREIGN KEY ("service_code") REFERENCES "service_main"("service_code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_main" ADD CONSTRAINT "fk_con_state_id" FOREIGN KEY ("state_id") REFERENCES "order_state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_main" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_state" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_state" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_state" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "fk_con_business_id" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "receipt" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "receipt" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "receipt" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_access" ADD CONSTRAINT "fk_con_business_id" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_access" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_access" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_access" ADD CONSTRAINT "fk_con_parent_service_id" FOREIGN KEY ("parent_service_id") REFERENCES "service_main"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_access" ADD CONSTRAINT "fk_con_service_id" FOREIGN KEY ("service_id") REFERENCES "service_main"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_access" ADD CONSTRAINT "fk_con_service_type_id" FOREIGN KEY ("service_type_id") REFERENCES "service_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_access" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_addon" ADD CONSTRAINT "fk_con_addon_service_id" FOREIGN KEY ("addon_service_id") REFERENCES "service_main"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_addon" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_addon" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_addon" ADD CONSTRAINT "fk_con_parent_service_id" FOREIGN KEY ("parent_service_id") REFERENCES "service_main"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_category" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_category" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_category" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_main" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_main" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_main" ADD CONSTRAINT "fk_con_service_category_id" FOREIGN KEY ("service_category_id") REFERENCES "service_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_main" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_price" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_price" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_price" ADD CONSTRAINT "fk_con_service_id" FOREIGN KEY ("service_id") REFERENCES "service_main"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_price" ADD CONSTRAINT "fk_con_service_type_id" FOREIGN KEY ("service_type_id") REFERENCES "service_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_price" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_type" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_type" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_type" ADD CONSTRAINT "fk_con_service_category_id" FOREIGN KEY ("service_category_id") REFERENCES "service_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_type" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_main" ADD CONSTRAINT "fk_con_business_id" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_main" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_main" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_main" ADD CONSTRAINT "fk_con_role_id" FOREIGN KEY ("role_id") REFERENCES "auth_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_main" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_parent_child" ADD CONSTRAINT "fk_con_child_user_id" FOREIGN KEY ("child_user_id") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_parent_child" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_parent_child" ADD CONSTRAINT "fk_con_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_parent_child" ADD CONSTRAINT "fk_con_parent_user_id" FOREIGN KEY ("parent_user_id") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wallet_balance" ADD CONSTRAINT "fk_con_created_by" FOREIGN KEY ("created_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wallet_balance" ADD CONSTRAINT "fk_con_invoice_id" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wallet_balance" ADD CONSTRAINT "fk_con_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user_main"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wallet_balance" ADD CONSTRAINT "wallet_balance_business_id_foreign" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

