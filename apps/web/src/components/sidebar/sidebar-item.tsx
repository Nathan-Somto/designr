import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSidebar } from "./sidebar-provider";
import Hint from "@designr/ui/components/hint";

export function SidebarItem({
    icon: Icon,
    label,
    collapsed,
    href
}: {
    icon: LucideIcon;
    label: string;
    collapsed: boolean;
    href: string;
}) {
    const pathname = usePathname();
    const { smallSidebarWidth, isCollapsed } = useSidebar();

    const content = (
        <motion.a
            href={href}
            initial={!isCollapsed ? { opacity: 0, x: -10 } : undefined}
            animate={{ opacity: 1, x: 0 }}
            layout
            transition={{
                duration: 0.2,
                layout: { duration: 0.3, delay: 0.25 },
            }}
            data-active={pathname.includes(href)}
            style={{
                width: isCollapsed ? smallSidebarWidth - 10 : '95%',
            }}
            className="flex text-primary data-[active=true]:bg-muted mx-auto items-center gap-2 py-2 px-4 hover:bg-muted rounded cursor-pointer"
        >
            <motion.div layout layoutId={href}>
                <Icon className="size-4 brightness-[.6]" />
            </motion.div>

            {!collapsed && (
                <motion.span
                    transition={{ duration: 0.2, delay: 0.35 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-medium brightness-[.6]"
                >
                    {label}
                </motion.span>
            )}
        </motion.a>
    );

    return isCollapsed ? (
        <Hint label={label} side="right">
            {content}
        </Hint>
    ) : (
        content
    );
}
