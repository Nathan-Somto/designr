/* eslint-disable no-unused-vars */
'use client'
import { useMediaQuery } from '#/hooks/useMediaQuery';
import * as React from 'react'
const SidebarContext = React.createContext<SidebarValues | null>(null)

interface Props {
    children: React.ReactNode
    smallSidebarWidth?: number
    fullSidebarWidth?: number
}
interface SidebarValues {

    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    isMobile: boolean;
    isMobileOpen: boolean;
    setIsMobileOpen: (value: boolean) => void;
    smallSidebarWidth: number;
    fullSidebarWidth: number;
    sidebarWidth: number

}
export default function SidebarProvider({
    children,
    smallSidebarWidth = 64,
    fullSidebarWidth = 230
}: Props) {
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const sidebarWidth = isCollapsed ? smallSidebarWidth : fullSidebarWidth
    const value: SidebarValues = {
        isCollapsed,
        setIsCollapsed,
        isMobile,
        isMobileOpen,
        setIsMobileOpen,
        smallSidebarWidth,
        fullSidebarWidth,
        sidebarWidth
    }
    return (
        <SidebarContext.Provider
            value={value}
        >
            {
                children
            }
        </SidebarContext.Provider>
    )
}
export const useSidebar = () => {
    const values = React.useContext(SidebarContext);
    if (!values) {
        throw new Error("useSidebar must be used in a sidebar provider")
    }
    return values
}