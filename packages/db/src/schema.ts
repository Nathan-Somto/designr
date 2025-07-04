import {
    pgTable,
    uuid,
    text,
    timestamp,
    boolean,
    json,
    integer,
    pgEnum,
    date
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const baseSchemaProps = {
    id: uuid("public_id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp('updated_at')
}
//== USERS ===//
export const users = pgTable("users", {
    name: text('name').notNull(),
    email: text("email").notNull(),
    emailVerified: boolean('email_verified'),
    imageUrl: text('image_url'),
    hasOnboarded: boolean().default(false),
    ...baseSchemaProps
});
//== SESSION ===//
export const session = pgTable('session', {
    ...baseSchemaProps,
    userId: uuid('user_id').references(() => users.id),
    token: text('token'),
    expiresAt: timestamp('expires_at'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    activeOrganizationId: text('active_organization_id')
})
//== ACCOUNT ===//
export const account = pgTable('account', {
    ...baseSchemaProps,
    userId: uuid('user_id').references(() => users.id),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    accountTokenExpiresAt: timestamp('account_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    idToken: text('id_token'),
    password: text('password')
})
//== Verification ===//
export const verification = pgTable('verification', {
    ...baseSchemaProps,
    identifier: text('identifier'),
    value: text('value'),
    expiresAt: timestamp('expiresAt')
})
//== USER SETTINGS ===//
export const userSettings = pgTable("user_settings", {
    userId: uuid("user_id").references(() => users.id).notNull(),
    settings: json("settings"),
    ...baseSchemaProps
});
//== ORGANIZATIONS ====//
export const organizations = pgTable("organizations", {
    name: text("name").notNull(),
    slug: text('slug').notNull(),
    logo: text('logo'),
    metadata: text('metadata'),
    ...baseSchemaProps
});
//==MEMBER===//
export const members = pgTable('members', {
    userId: uuid('user_id').references(() => users.id),
    organizationId: uuid('organization_id').references(() => organizations.id),
    role: text('role'),
    email: text('email'),
    ...baseSchemaProps,
})
//==INVITATION===//
export const invitation = pgTable('invitation', {
    ...baseSchemaProps,
    email: text('email'),
    inviterId: uuid('inviter_id').references(() => users.id),
    role: text('role'),
    status: text('status'),
    expiresAt: timestamp('expires_at'),
    organizationId: uuid("organization_id").references(() => organizations.id)
})
//== PROJECTS ===// 
export const ProjectViewEnum = pgEnum('can_view', ['ORG', 'PUBLIC', 'SELF']);
export const ProjectEditEnum = pgEnum('can_edit', ['ORG', 'SELF']);
export const projects = pgTable("projects", {
    ...baseSchemaProps,
    name: text("name").notNull(),
    userId: uuid("user_id").references(() => users.id),
    organizationId: uuid("organization_id").references(() => organizations.id),
    isTemplate: boolean("is_template").default(false),
    isProTemplate: boolean("is_pro_template").default(false),
    category: text("category"),
    width: integer('width').notNull(),
    height: integer('height').notNull(),
    data: json('data').notNull(),
    showUserIdentity: boolean('show_user_identity').default(true),
    canView: ProjectViewEnum('can_view').default('SELF'),
    canEdit: ProjectEditEnum('can_edit').default('SELF'),
    thumbnailUrl: text("thumbnail_url"),
});
//=== PROJECT LOCKS ===//
export const projectLocks = pgTable("project_locks", {
    ...baseSchemaProps,
    projectId: uuid("project_id").references(() => projects.id).unique().notNull(),
    lockedBy: uuid("user_id").references(() => users.id).notNull(),
    lockedAt: timestamp("locked_at").defaultNow()
});
//=== USER MEDIA ===//
export const userMediaEnum = pgEnum('media_type', ['IMG', 'VIDEO'])
export const userMedia = pgTable("user_media", {
    userId: uuid("user_id").references(() => users.id).notNull(),
    url: text("url").notNull(),
    mediaType: userMediaEnum().default('IMG'),
    ...baseSchemaProps
});
//== TEMPLATE FAVOURITES==//
export const templateFavourites = pgTable("template_favourites", {
    userId: uuid("user_id").references(() => users.id).notNull(),
    projectId: uuid("project_id").references(() => projects.id).notNull(),
    ...baseSchemaProps
});
//== USER USAGE ===//
export const FeatureEnum = pgEnum('feature', ['TEXT_TO_DESIGN', 'IMG_GEN', 'IMG_TRANSFORMATION', 'ORGANIZATIONS'])
export const featureUsage = pgTable("feature_usage", {
    ...baseSchemaProps,
    userId: uuid("user_id").references(() => users.id).notNull(),
    feature: FeatureEnum('feature').notNull(),
    count: integer("count").default(0),
    lastUsed: timestamp("last_used").defaultNow()
});
//== SUBCRIPTIONS ===//
export const PlanEnum = pgEnum('plan', ['FREE', 'PRO'])
export const subscriptions = pgTable("subscriptions", {
    userId: uuid("user_id").references(() => users.id),
    plan: PlanEnum('plan').notNull(),
    active: boolean("active").default(false),
    expiresAt: timestamp("expires_at"),
    metadata: json("metadata"),
    ...baseSchemaProps
});
//=== RATE LIMITS ===//
export const rateLimits = pgTable("rate_limits", {
    userId: uuid("user_id").notNull(),
    service: text("service").notNull(),
    date: date("date").notNull(),
    count: integer("count").notNull().default(0),
    ...baseSchemaProps
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
    members: many(members),
    invitationsSent: many(invitation),
}));
export const invitationsRelations = relations(invitation, ({ one }) => ({
    invitedBy: one(users, {
        fields: [invitation.inviterId],
        references: [users.id],
    }),
    organization: one(organizations, {
        fields: [invitation.id],
        references: [organizations.id]
    })
}));
export const orgRelations = relations(organizations, ({ many }) => ({
    projects: many(projects),
    invitation: many(invitation),
    members: many(members)
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
