'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { dimensionsList } from "./data";
import Hint from "@designr/ui/components/hint";

type DimensionItem = {
    label: string;
    value: string;
    icon: React.ElementType;
    iconColor?: string;
};

type Props = {
    items?: DimensionItem[];
    onSelect?: (item: DimensionItem) => void;
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

export function TemplatesFilter({ items = dimensionsList, onSelect }: Props) {
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (item: DimensionItem) => {
        setSelected(item.value);
        onSelect?.(item);
    };

    return (
        <motion.div
            variants={parentVariants}
            initial="initial"
            animate="animate"
            className="flex mt-3 overflow-x-auto no-scrollbar gap-4 py-4 px-2 w-full"
        >
            {items.map((item, index) => {
                const Icon = item.icon;
                const isSelected = selected === item.value;

                return (
                    <Hint
                        key={index}
                        label={item.value}
                    >
                        <motion.div
                            variants={childVariants}
                            onClick={() => handleSelect(item)}
                            className={`border-muted min-w-fit rounded-lg border cursor-pointer py-2 px-3 transition-colors
              ${isSelected ? 'bg-primary/10 border-primary text-primary' : 'border-border hover:bg-primary/10 hover:text-primary'}
            `}
                        >
                            <div className="flex items-center gap-x-2.5">
                                <Icon className={`size-5 flex-shrink-0 ${item.iconColor ?? "text-muted-foreground"}`} />
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                        </motion.div>
                    </Hint>
                );
            })}
        </motion.div>
    );
};
