import React from 'react'
import { LayoutGroup, motion } from 'motion/react'
import { useSidebar } from './sidebar-provider'
import Image from 'next/image'
import { Button } from '@designr/ui/components/button'
import { ChevronLeftIcon, HomeIcon, LayoutTemplateIcon, SettingsIcon } from 'lucide-react'
import { SidebarItem } from './sidebar-item'
import { cn } from '@designr/ui/lib/utils'
import ProStatus from './pro-status'
const AccountSwitcher = () => <div className="text-xs border-dashed border-destructive border mb-2 py-2 text-muted-foreground">Account Switcher</div>;


const items = [
    { icon: HomeIcon, label: "Home", href: '/dashboard' },
    { icon: LayoutTemplateIcon, label: "Community", href: '/community' },
    { icon: SettingsIcon, label: "Settings", href: '/settings' },
];
export default function SidebarContent() {
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
                duration: 0.35, ease: 'easeIn', /* layout: {
                    duration: 0.35,
                    ease: 'easeIn'
                } */
            }}
            className="fixed top-0 left-0 h-full bg-transparent z-40 flex flex-col"
            style={{ width: sidebarWidth }}
        >
            <div className={cn("flex items-center justify-between px-4 py-3 border-b", isCollapsed && 'flex-col-reverse gap-y-3')}>
                <div className="flex items-center">
                    <Image src="/logo.svg" alt="Designr Logo" className={cn("size-6 mr-2", isCollapsed && 'mr-0')} width={40} height={40} />
                    {!isCollapsed && <span className="text-xl font-bold text-primary">Designr</span>}
                </div>
                <Button
                    variant="ghost"
                    size='icon'
                    onClick={() => isMobile ? setIsMobileOpen(false) : setIsCollapsed(!isCollapsed)}
                >
                    <ChevronLeftIcon className={`size-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
                </Button>
            </div>
            <ProStatus isPro />
            <LayoutGroup>
                <div className="flex-1 overflow-y-auto space-y-2 mt-4">
                    {items.map((item, index) => (
                        <SidebarItem key={index} href={item.href} icon={item.icon} label={item.label} collapsed={isCollapsed} />
                    ))}
                </div>
            </LayoutGroup>

            <div className="mt-auto mb-4">
                <AccountSwitcher />
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
