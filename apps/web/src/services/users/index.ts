'use server';
import { BadRequestError, UnauthorizedError } from "@designr/api-errors";
import { auth } from "@designr/auth";
import { db, eq, schema } from "@designr/db";
import { headers } from "next/headers";
import { ApiSuccessResponse } from "..";

const getCurrentUser = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session?.user)
        throw new UnauthorizedError("User is not authenticated!")
    return ({
        ...session.user,
        activeOrganizationId: session.session.activeOrganizationId
    });
}
const onboardUser: () => Promise<ApiSuccessResponse<{
    hasOnboarded: boolean;
}>> = async () => {
    const user = await getCurrentUser();
    if (user.hasOnboarded) throw new BadRequestError("User has already onboarded!");
    await db.update(schema.users).set({
        hasOnboarded: true
    }).where(eq(
        schema.users.id,
        user.id
    ));
    return {
        hasOnboarded: true,
        type: 'success'
    }
}
export {
    getCurrentUser,
    onboardUser
}