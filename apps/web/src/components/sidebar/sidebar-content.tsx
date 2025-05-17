import React from 'react'
import { LayoutGroup, motion } from 'motion/react'
import { useSidebar } from './sidebar-provider'
import Image from 'next/image'
import { Button } from '@designr/ui/components/button'
import { ChevronLeftIcon, HomeIcon, LayoutTemplateIcon, SettingsIcon, StarIcon } from 'lucide-react'
import { SidebarItem } from './sidebar-item'
import { cn } from '@designr/ui/lib/utils'
import ProStatus from './pro-status'
import { LINKS } from '#/constants/links'



const items = [
    { icon: HomeIcon, label: "Home", href: (value: string) => value, shortPath: LINKS.DASHBOARD },
    { icon: LayoutTemplateIcon, label: "Community", href: LINKS.COMMUNITY },
    { icon: StarIcon, label: 'Favourites', href: LINKS.FAVOURITES },
    { icon: SettingsIcon, label: "Settings", href: LINKS.SETTINGS },
];
export default function SidebarContent({ dashboardUrl }: { dashboardUrl: string }) {
    const {
        isMobile,
        sidebarWidth,
        isCollapsed,
        setIsMobileOpen,
        setIsCollapsed
    } = useSidebar()
    return (

        <motion.aside
            initial={!isMobile ? { x: "-100%" } : undefined}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            layout
            key="sidebar-content"
            transition={{
                duration: 0.35,
                ease: 'easeIn',
            }}
            className={cn("fixed top-0 left-0 h-full bg-transparent z-[2100] flex flex-col", isMobile && 'bg-violet-100')}
            style={{ width: sidebarWidth }}
        >
            <div className={cn("flex items-center justify-between px-4 py-3 border-b", isCollapsed && 'flex-col-reverse gap-y-3')}>
                <div className="flex items-center">
                    <Image src="/logo.svg" alt="Designr Logo" className={cn("size-6 mr-2", isCollapsed && 'mr-0')} width={40} height={40} />
                    {!isCollapsed && <span className="text-xl font-bold text-primary">Designr</span>}
                </div>
                {
                    !isMobile && (
                        <Button
                            variant="ghost"
                            size='icon'
                            onClick={() => isMobile ? setIsMobileOpen(false) : setIsCollapsed(!isCollapsed)}
                        >
                            <ChevronLeftIcon className={`size-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
                        </Button>
                    )
                }
            </div>
            <ProStatus isPro />
            <LayoutGroup>
                <div className="flex-1 overflow-y-auto space-y-2 mt-4">
                    {items.map((item, index) => (
                        <SidebarItem
                            key={index}
                            href={typeof item.href === 'function' ? item.href(dashboardUrl) : item.href}
                            icon={item.icon}
                            label={item.label}
                            collapsed={isCollapsed}
                            shortPath={item?.shortPath}
                        />
                    ))}
                </div>
            </LayoutGroup>

            <div className="mt-auto mb-4 px-3">
                {
                    !isCollapsed && (
                        <footer className='text-xs text-muted-foreground mt-3'>
                            <p>Created by - <a href='www.github.com/Nathan-Somto' className='underline text-primary brightness-[.6]' target='_blank'>Nathan Somto</a></p>
                            <p>Version - <code>1.0.0</code></p>
                        </footer>
                    )
                }

            </div>
        </motion.aside>
    )
}
