CREATE TYPE "public"."feature" AS ENUM('TEXT_TO_DESIGN', 'IMG_GEN', 'IMG_TRANSFORMATION', 'ORGANIZATIONS');--> statement-breakpoint
CREATE TYPE "public"."plan" AS ENUM('FREE', 'PRO');--> statement-breakpoint
CREATE TYPE "public"."can_edit" AS ENUM('ORG', 'SELF');--> statement-breakpoint
CREATE TYPE "public"."can_view" AS ENUM('ORG', 'PUBLIC', 'SELF');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('IMG', 'VIDEO');--> statement-breakpoint
CREATE TABLE "account" (
	"public_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"user_id" uuid,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"account_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"id_token" text,
	"password" text
);
--> statement-breakpoint
CREATE TABLE "feature_usage" (
	"public_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"user_id" uuid NOT NULL,
	"feature" "feature" NOT NULL,
	"count" integer DEFAULT 0,
	"last_used" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"public_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"email" text,
	"inviter_id" uuid,
	"role" text,
	"status" text,
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "members" (
	"user_id" uuid,
	"organization_id" uuid,
	"role" text,
	"email" text,
	"public_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"metadata" text,
	"public_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_locks" (
	"public_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"locked_at" timestamp DEFAULT now(),
	CONSTRAINT "project_locks_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"public_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"name" text NOT NULL,
	"user_id" uuid,
	"organization_id" uuid,
	"is_template" boolean DEFAULT false,
	"is_pro_template" boolean DEFAULT false,
	"category" text,
	"width" uuid NOT NULL,
	"height" uuid,
	"data" json NOT NULL,
	"show_user_identity" boolean DEFAULT true,
	"canView" "can_view" DEFAULT 'SELF',
	"canEdit" "can_edit" DEFAULT 'SELF',
	"thumbnail_url" text
);
--> statement-breakpoint
CREATE TABLE "session" (
	"public_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"user_id" uuid,
	"token" text,
	"expires_at" timestamp,
	"ip_address" text,
	"user_agent" text,
	"active_organization_id" text
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"user_id" uuid,
	"plan" "plan" NOT NULL,
	"active" boolean DEFAULT false,
	"expires_at" timestamp,
	"metadata" json,
	"public_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "template_favourites" (
	"user_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"public_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_media" (
	"user_id" uuid NOT NULL,
	"url" text NOT NULL,
	"mediaType" "media_type" DEFAULT 'IMG',
	"public_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"user_id" uuid NOT NULL,
	"settings" json,
	"public_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean,
	"image_url" text,
	"public_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"public_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"identifier" text,
	"value" text,
	"expiresAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_users_public_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("public_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feature_usage" ADD CONSTRAINT "feature_usage_user_id_users_public_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("public_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_members_public_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."members"("public_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_users_public_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("public_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_organization_id_organizations_public_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("public_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_locks" ADD CONSTRAINT "project_locks_project_id_projects_public_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("public_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_locks" ADD CONSTRAINT "project_locks_user_id_users_public_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("public_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_public_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("public_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_id_organizations_public_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("public_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_users_public_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("public_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_public_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("public_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_favourites" ADD CONSTRAINT "template_favourites_user_id_users_public_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("public_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_favourites" ADD CONSTRAINT "template_favourites_project_id_projects_public_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("public_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_media" ADD CONSTRAINT "user_media_user_id_users_public_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("public_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_public_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("public_id") ON DELETE no action ON UPDATE no action;