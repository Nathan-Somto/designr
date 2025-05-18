import Sidebar from '#/components/sidebar'
import SidebarProvider from '#/components/sidebar/sidebar-provider'
import React from 'react'
import AppContent from '#/components/app/app-content'
import AppHeader from '#/components/app/app-header'
import { auth } from '@designr/auth'
import { headers } from 'next/headers'
import { LINKS } from '#/constants/links'
import { ProjectsProvider } from '#/hooks/useProjects'

export default async function AppLayout({ children }: React.PropsWithChildren) {
    const organization = await auth.api.getFullOrganization({
        headers: await headers(),

    })
    const getDashboardUrl = () => {
        if (!organization?.name || !organization?.id) {
            return LINKS.DASHBOARD;
        }

        const orgType = organization.name === 'Personal' ? 'personal' : 'team';
        return `${LINKS.DASHBOARD}/${orgType}/${organization.id}`;
    };

    return (
        <SidebarProvider>
            <main id="app__layout"
                className='md:pt-[12px] grid place-items-center pb-5 h-[100vh] bg-primary/10 overflow-hidden w-[100vw]'
            >
                <Sidebar
                    dashboardUrl={getDashboardUrl()}
                />
                <ProjectsProvider>
                    <AppContent>
                        <AppHeader
                            organization={organization}
                        />
                        {children}
                    </AppContent>
                </ProjectsProvider>
            </main>
        </SidebarProvider>
    )
}
