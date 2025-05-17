'use client';
import { Button } from '@designr/ui/components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@designr/ui/components/tabs'
import { LogInIcon, Settings2Icon, UserCircleIcon, Users2Icon } from 'lucide-react'
import React from 'react'
import AccountSettings from './account-settings';
import LoginSettings from './login-settings';
import { PreferencesSettings } from './preferences-settings';
import { authClient } from '@designr/auth/client';
import TeamSettings from './team-settings';

export default function SettingsClient() {
    const [tabValue, setTabValue] = React.useState('account')
    const { data, } = authClient.useSession();
    const session = data
    return (
        <Tabs
            defaultValue='account'
            orientation="vertical"
            //value={tabValue}
            onValueChange={(value) => setTabValue(value)}
            className="grid w-full lg:w-[calc(100%+32px)]  lg:grid-cols-[180px_1fr] ">
            <TabsList aria-orientation="vertical" className="lg:flex-col border-t lg:border-t-0 md:w-[90%] h-[80px] z-[30] lg no-scrollbar gap-x-1 lg:gap-x-0 lg:gap-y-1 lg:rounded-md  bg-transparent py-6 rounded-none bg-white lg:shadow-md w-[90vw] lg:w-[180px]  overflow-auto mx-auto lg:mx-0 lg:h-[calc(100vh-110px)] fixed lg:sticky bottom-0 lg:bottom-auto lg:top-[110px] justify-start ">
                <TabsTrigger asChild value="account" className="w-[90%]  max-lg:[&>span]:text-xs flex-col gap-x-0 gap-y-0.5 lg:!gap-2 lg:flex-row justify-start max-w-[180px] !shadow-none flex-shrink-0 min-w-[150px] mx-auto !rounded-md">
                    <Button variant={'selection'}
                        data-active={tabValue === 'account'}
                    >
                        <UserCircleIcon />
                        <span>Your Profile</span>
                    </Button>
                </TabsTrigger>
                <TabsTrigger asChild value="login" className="w-[90%] max-lg:[&>span]:text-xs flex-col gap-x-0 gap-y-0.5 lg:!gap-2 lg:flex-row justify-start max-w-[180px] !shadow-none flex-shrink-0 min-w-[150px] mx-auto !rounded-md">
                    <Button variant={'selection'}
                        data-active={tabValue === 'login'}
                    >
                        <LogInIcon />
                        <span>Login
                        </span>
                    </Button>
                </TabsTrigger>

                <TabsTrigger
                    asChild
                    value="preferences"
                    className="w-[90%] max-lg:[&>span]:text-xs flex-col gap-x-0 gap-y-0.5 lg:!gap-2 lg:flex-row justify-start max-w-[180px] !shadow-none flex-shrink-0 min-w-[150px] mx-auto !rounded-md"
                >
                    <Button
                        variant={'selection'}
                        data-active={tabValue === 'preferences'}
                    >
                        <Settings2Icon />
                        <span>Preferences</span>
                    </Button>
                </TabsTrigger>
                <TabsTrigger
                    value="team"
                    asChild
                    className="w-[90%] max-lg:[&>span]:text-xs flex-col gap-x-0 gap-y-0.5 lg:!gap-2 lg:flex-row justify-start max-w-[180px] !shadow-none flex-shrink-0 min-w-[150px] mx-auto !rounded-md"
                >
                    <Button
                        variant={'selection'}
                        data-active={tabValue === 'team'}
                    >
                        <Users2Icon />
                        <span>Your Team</span>
                    </Button>
                </TabsTrigger>
            </TabsList>

            <div className="px-6 pb-[90px] pt-3 lg:!py-3 ">
                <TabsContent value='account'>
                    <AccountSettings
                        session={session}
                    />
                </TabsContent>
                <TabsContent value='login'>
                    <LoginSettings />
                </TabsContent>
                <TabsContent value="preferences">
                    <PreferencesSettings />
                </TabsContent>
                <TabsContent value={'team'}>
                    <TeamSettings
                        session={session}
                    />
                </TabsContent>
            </div>
        </Tabs>
    )
}
