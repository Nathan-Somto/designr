'use server';
import { getCurrentUser } from "../users";
import { db, eq } from "@designr/db";
import { schema } from "@designr/db";
import { UserSettings, userSettingsSchema } from "@designr/db/user-settings";
import { revalidatePath } from "next/cache";
import { cache } from "react";

const getUserSettings = cache(async () => {
    const user = await getCurrentUser();
    const settings = await db.select({
        settings: schema.userSettings.settings
    })
        .from(schema.userSettings)
        .where(eq(schema.userSettings.userId, user.id))
        .limit(1);
    return {
        settings: (settings[0].settings as unknown as UserSettings) ?? null,
        type: 'success' as const,
    }
})
const updateUserSettings = async (payload: UserSettings) => {
    const user = await getCurrentUser();
    const validated = userSettingsSchema.parse(payload);

    const existing = await db.select({ id: schema.userSettings.id }).from(schema.userSettings).where(
        eq(schema.userSettings.userId, user.id),
    );
    if (existing[0]?.id) {
        await db
            .update(schema.userSettings)
            .set({
                settings: JSON.stringify(validated),
            })
            .where(eq(schema.userSettings.userId, user.id));
    } else {
        await db.insert(schema.userSettings).values({
            userId: user.id,
            settings: JSON.stringify(validated),
        });
    }

    revalidatePath('/(main)', 'layout');
    return 'settings updated';
};
export {
    getUserSettings,
    updateUserSettings
}