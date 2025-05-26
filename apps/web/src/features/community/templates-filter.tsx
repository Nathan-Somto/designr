'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { dimensionsList } from "./data";
import Hint from "@designr/ui/components/hint";
import { useProjects } from "#/hooks/useProjects";
import { cn } from "@designr/ui/lib/utils";

type DimensionItem = {
    label: string;
    value: string | null;
    icon: React.ElementType;
    iconColor?: string;
};

type Props = {
    items?: DimensionItem[];
    onSelect?: (item: DimensionItem | null) => void;
    orientation?: 'horizontal' | 'vertical'
};

const parentVariants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const childVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
};

export function TemplatesFilterBase({
    items = dimensionsList,
    onSelect,
    orientation = 'horizontal',
}: Props) {
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (item: DimensionItem) => {
        setSelected(item.value);
        onSelect?.(item.value === null ? null : item);
    };

    return (
        <motion.div
            variants={parentVariants}
            initial="initial"
            animate="animate"
            className={cn(
                "flex mt-3 gap-4 py-4 px-2 w-full",
                orientation === "vertical"
                    ? "flex-col overflow-y-auto no-scrollbar"
                    : "flex-row overflow-x-auto no-scrollbar"
            )}
        >
            {items.map((item, index) => {
                const Icon = item.icon;
                const isSelected = selected === item.value;

                return (
                    <Hint key={index} label={item.value ?? 'Any Dimension'}>
                        <motion.div
                            variants={childVariants}
                            onClick={() => handleSelect(item)}
                            className={cn(
                                "border-muted min-w-fit rounded-lg border cursor-pointer py-2 px-3 transition-colors",
                                isSelected
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "border-border hover:bg-primary/10 hover:text-primary"
                            )}
                        >
                            <div className="flex items-center gap-x-2.5">
                                <Icon
                                    className={cn(
                                        "size-5 flex-shrink-0",
                                        item.iconColor ?? "text-muted-foreground"
                                    )}
                                />
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                        </motion.div>
                    </Hint>
                );
            })}
        </motion.div>
    );
}

export function TemplatesFilter({ onSelect, ...props }: Props) {
    const { filterByFn, clearFilter } = useProjects();

    const handleSelect = (item: DimensionItem | null) => {
        if (item === null) {
            clearFilter('community');
        } else {
            filterByFn('community', (d) => d.dimensions === item.value);
        }
    };

    return <TemplatesFilterBase {...props} onSelect={handleSelect} />;
};
