
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LINKS } from "#/constants/links";
import { auth } from "@designr/auth";

export default async function DashboardPageRedirect() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    //console.log("the session: ", session)
    if (!session) {
        throw redirect(LINKS.LOGIN);
    }
    if (!session.session.activeOrganizationId) {
        await auth.api.setActiveOrganization({
            headers: await headers(),
            body: {
                organizationId: session.user.id,
            },
        });
        throw redirect(`${LINKS.DASHBOARD}/personal/${session.user.id}`)
    }
    throw redirect(`${LINKS.DASHBOARD}/team/${session.session.activeOrganizationId}`)
}