import React from 'react'

import { Input } from "./input";
import { SearchIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    showIcon?: boolean;
    inputClassName?: string;
}

export function SearchBar({ className, inputClassName, showIcon = true, ...props }: SearchBarProps) {
    return (
        <div className={cn("relative flex items-center", className)}>
            {showIcon && (
                <SearchIcon className="absolute left-3 text-gray-400 size-5" />
            )}
            <Input
                type="text"
                className={cn(
                    "w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500",
                    showIcon && "pl-10",
                    inputClassName
                )}
                {...props}
            />
        </div>
    );
}
