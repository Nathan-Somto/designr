'use client'

import { useSidebar } from "#/components/sidebar/sidebar-provider"
import { ScrollArea } from "@designr/ui/components/scroll-area"

export default function AppContent({ children }: React.PropsWithChildren) {
    const {
        fullSidebarWidth,
        smallSidebarWidth,
        isCollapsed,
        isMobile
    } = useSidebar()
    return (
        <ScrollArea
            style={{
                marginLeft: isMobile ? 0 : isCollapsed ? smallSidebarWidth + 10 : fullSidebarWidth + 10,
                width: isMobile ? '100%' : `calc(100vw - ${(isCollapsed ? smallSidebarWidth : fullSidebarWidth) + 10}px)`
            }}
            className='bg-white  min-h-[250px] h-screen md:h-[calc(100vh-80px)] px-8 md:rounded-[12px] shadow-sm overlfow-y-auto'
        >
            {children}
        </ScrollArea>
    )
}
