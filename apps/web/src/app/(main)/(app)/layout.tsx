import Sidebar from '#/components/sidebar'
import SidebarProvider from '#/components/sidebar/sidebar-provider'
import React from 'react'
import AppContent from '#/components/app/app-content'

export default function AppLayout({ children }: React.PropsWithChildren) {
    return (
        <SidebarProvider>
            <main id="app__layout"
                className='md:pt-[12px] grid place-items-center pb-5 h-[100vh] bg-primary/10 overflow-hidden w-[100vw]'
            >
                <Sidebar />
                <AppContent>
                    {children}
                </AppContent>
            </main>
        </SidebarProvider>
    )
}
