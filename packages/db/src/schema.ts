import {
    pgTable, uuid, text, timestamp, boolean, json, integer,
    primaryKey, foreignKey,
    serial,
    pgEnum
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
//== USERS ===//
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    publicId: uuid("public_id").defaultRandom().unique().notNull(),
    clerkId: text("clerk_id").notNull().unique(),
    email: text("email").notNull(),
    createdAt: timestamp("created_at").defaultNow()
});
//== USER SETTINGS ===//
export const userSettings = pgTable("user_settings", {
    id: serial("id").primaryKey(),
    publicId: uuid("public_id").defaultRandom().unique().notNull(),
    userId: integer("user_id").references(() => users.id).notNull(),
    settings: json("settings"),
    createdAt: timestamp("created_at").defaultNow()
});
//== ORGANIZATIONS ====//
export const organizations = pgTable("organizations", {
    id: serial("id").primaryKey(),
    publicId: uuid("public_id").defaultRandom().unique().notNull(),
    clerkId: text("clerk_id").notNull().unique(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow()
});
//== PROJECTS ===// 
export const ProjectViewEnum = pgEnum('can_view', ['ORG', 'PUBLIC', 'SELF']);
export const ProjectEditEnum = pgEnum('can_edit', ['ORG', 'SELF']);
export const projects = pgTable("projects", {
    id: serial("id").primaryKey(),
    publicId: uuid("public_id").defaultRandom().unique().notNull(),
    name: text("name").notNull(),
    userId: integer("user_id").references(() => users.id),
    organizationId: integer("organization_id").references(() => organizations.id),
    isTemplate: boolean("is_template").default(false),
    isProTemplate: boolean("is_pro_template").default(false),
    category: text("category"),
    width: integer('width').notNull(),
    height: integer('height'),
    data: json('data').notNull(),
    showUserIdentity: boolean('show_user_identity').default(true),
    canView: ProjectViewEnum().default('SELF'),
    canEdit: ProjectEditEnum().default('SELF'),
    thumbnailUrl: text("thumbnail_url"),
    createdAt: timestamp("created_at").defaultNow()
});
//=== PROJECT LOCKS ===//
export const projectLocks = pgTable("project_locks", {
    id: serial("id").primaryKey(),
    publicId: uuid("public_id").defaultRandom().unique().notNull(),
    projectId: integer("project_id").references(() => projects.id).unique().notNull(),
    lockedBy: integer("user_id").references(() => users.id).notNull(),
    lockedAt: timestamp("locked_at").defaultNow()
});
//=== USER MEDIA ===//
const userMediaEnum = pgEnum('type', ['IMG', 'VIDEO'])
export const userMedia = pgTable("user_media", {
    id: serial("id").primaryKey(),
    publicId: uuid("public_id").defaultRandom().unique().notNull(),
    userId: integer("user_id").references(() => users.id).notNull(),
    url: text("url").notNull(),
    type: userMediaEnum().default('IMG'),
    createdAt: timestamp("created_at").defaultNow()
});
//== TEMPLATE FAVOURITES==//
export const templateFavourites = pgTable("template_favourites", {
    id: serial("id").primaryKey(),
    publicId: uuid("public_id").defaultRandom().unique().notNull(),
    userId: integer("user_id").references(() => users.id).notNull(),
    projectId: integer("project_id").references(() => projects.id).notNull(),
    createdAt: timestamp("created_at").defaultNow()
});
//== USER USAGE ===//
export const FeatureEnum = pgEnum('feature', ['TEXT_TO_DESIGN', 'IMG_GEN', 'IMG_TRANSFORMATION'])
export const featureUsage = pgTable("feature_usage", {
    id: serial("id").primaryKey(),
    publicId: uuid("public_id").defaultRandom().unique().notNull(),
    userId: integer("user_id").references(() => users.id).notNull(),
    feature: FeatureEnum().notNull(),
    count: integer("count").default(0),
    lastUsed: timestamp("last_used").defaultNow()
});
//== SUBCRIPTIONS ===//
export const PlanEnum = pgEnum('plan', ['FREE', 'PRO'])
export const subscriptions = pgTable("subscriptions", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() => users.id),
    plan: PlanEnum().notNull(),
    active: boolean("active").default(false),
    expiresAt: timestamp("expires_at"),
    metadata: json("metadata"),
});
//== RELATIONSHIPS ===//
// users → userSettings (1:1)
// users → projects (1:M)
// organizations → projects (1:M)
// projects → projectLocks (1:1)
// users → userMedia (1:M)
// users → templateFavourites (1:M)
// users → userUsage (1:M)
export const userRelations = relations(users, ({ one, many }) => ({
    settings: one(userSettings),
    projects: many(projects),
    media: many(userMedia),
    subscriptions: many(subscriptions),
    favourites: many(templateFavourites),
    locks: many(projectLocks),
    usage: many(featureUsage),
}));

export const orgRelations = relations(organizations, ({ many }) => ({
    projects: many(projects),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
    user: one(users, {
        fields: [userSettings.userId],
        references: [users.id],
    }),
}));

export const projectRelations = relations(projects, ({ one, many }) => ({
    user: one(users, {
        fields: [projects.userId],
        references: [users.id],
    }),
    organization: one(organizations, {
        fields: [projects.organizationId],
        references: [organizations.id],
    }),
    lock: one(projectLocks),
    favourites: many(templateFavourites),
}));

export const lockRelations = relations(projectLocks, ({ one }) => ({
    project: one(projects, {
        fields: [projectLocks.projectId],
        references: [projects.id],
    }),
    user: one(users, {
        fields: [projectLocks.lockedBy],
        references: [users.id],
    }),
}));

export const mediaRelations = relations(userMedia, ({ one }) => ({
    user: one(users, {
        fields: [userMedia.userId],
        references: [users.id],
    }),
}));

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
    user: one(users, {
        fields: [subscriptions.userId],
        references: [users.id],
    }),
}));

export const usageRelations = relations(featureUsage, ({ one }) => ({
    user: one(users, {
        fields: [featureUsage.userId],
        references: [users.id],
    }),
}));

export const templateFavouriteRelations = relations(templateFavourites, ({ one }) => ({
    user: one(users, {
        fields: [templateFavourites.userId],
        references: [users.id],
    }),
    template: one(projects, {
        fields: [templateFavourites.projectId],
        references: [projects.id],
    }),
}));
