"use client";

import { AnimatePresence } from "motion/react";
import { MenuIcon } from "lucide-react";
import { Button } from "@designr/ui/components/button";
import { useSidebar } from "./sidebar-provider";
import SidebarContent from "./sidebar-content";

type Props = {
    dashboardUrl: string
}
export default function Sidebar({ dashboardUrl }: Props) {
    const {
        isMobile,
        isMobileOpen,
        setIsMobileOpen,
    } = useSidebar();



    return (
        <>
            {isMobile && (
                <Button
                    onClick={() => setIsMobileOpen(true)}
                    variant="ghost"
                    size="icon"
                    className="fixed top-4 left-4 z-[2000]"
                >
                    <MenuIcon className="size-4" />
                </Button>
            )}

            <AnimatePresence>
                {(isMobile && isMobileOpen) || !isMobile ?
                    <SidebarContent
                        dashboardUrl={dashboardUrl}
                    /> : null}
            </AnimatePresence>

            {isMobile && isMobileOpen && (
                <div
                    className="fixed inset-0 z-[2000] bg-black/50"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
}
