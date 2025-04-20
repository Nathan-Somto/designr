import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins"
export const {
    changeEmail,
    changePassword,
    signIn,
    signOut,
    signUp,
    updateUser,
    useSession
} = createAuthClient({
    plugins: [
        organizationClient()
    ]
})