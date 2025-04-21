import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins"
import { type ErrorContext } from 'better-auth/react';
export const authClient = createAuthClient({
    baseURL: 'http://localhost:3002',
    plugins: [
        organizationClient()
    ]
})
export type ActiveOrganization = typeof authClient.$Infer.ActiveOrganization;
export type Invitation = typeof authClient.$Infer.Invitation;
export { type ErrorContext }