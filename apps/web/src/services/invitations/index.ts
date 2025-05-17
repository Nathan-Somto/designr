'use server';
import { db, eq, desc, and } from '@designr/db';
import { getCurrentUser } from '../users';
import { schema } from '@designr/db';

export async function getInvitations(page = 1) {
    const user = await getCurrentUser();
    const limit = 20;
    const offset = (page - 1) * limit;

    const invites = await db
        .select({
            id: schema.invitation.id,
            organizationId: schema.invitation.organizationId,
            createdAt: schema.invitation.createdAt,
            orgName: schema.organizations.name,
            orgLogo: schema.organizations.logo,
        })
        .from(schema.invitation)
        .where(and(
            eq(schema.invitation.email, user.email),
            eq(schema.invitation.status, 'pending')
        ))
        .innerJoin(schema.organizations, eq(schema.organizations.id, schema.invitation.organizationId))
        .orderBy(desc(schema.invitation.createdAt))
        .limit(limit)
        .offset(offset);

    return invites;
}
