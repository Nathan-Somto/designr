import { SettingsProvider } from '#/features/settings/settings-provider';
import { getUserSettings } from '#/services/settings';
import React from 'react'

export default async function MainLayout({ children }: React.PropsWithChildren) {
    const settings = await getUserSettings();
    //console.log("the settings: ", settings);
    return (
        <SettingsProvider
            initialSettings={settings}
        >
            {
                children
            }
        </SettingsProvider>
    )
}
