import { SettingsProvider } from '#/features/settings/settings-provider';
import { getUserSettings } from '#/services/settings';
import { promiseCatch } from '#/utils/promise-catch';
import { userSettingsDefaults } from '@designr/db/user-settings';
import React from 'react'

export default async function MainLayout({ children }: React.PropsWithChildren) {
    const res = await promiseCatch(getUserSettings());
    if (res?.type === 'error' && res.statusCode === 401) {
        return <div
            className='flex items-center justify-center h-screen w-screen text-destructive text-3xl font-semibold bg-destructive/10'>
            Unauthorized</div>

    }
    return (
        <SettingsProvider
            initialSettings={res?.type === 'success' ? res.settings : userSettingsDefaults}
        >
            {
                children
            }
        </SettingsProvider>
    )
}
