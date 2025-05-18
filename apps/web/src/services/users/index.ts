'use server';

import { auth } from "@designr/auth";
import { headers } from "next/headers";

const getCurrentUser = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session?.user)
        throw new Error("User is not authenticated!")
    return ({
        ...session.user,
        activeOrganizationId: session.session.activeOrganizationId
    });
}
export {
    getCurrentUser
}