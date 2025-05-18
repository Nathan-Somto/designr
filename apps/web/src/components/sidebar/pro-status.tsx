import { Button } from '@designr/ui/components/button';
import { Skeleton } from '@designr/ui/components/skeleton';
import Hint from '@designr/ui/components/hint';
import { CrownIcon } from 'lucide-react';
import React from 'react';
import { useSidebar } from './sidebar-provider';
import { cn } from '@designr/ui/lib/utils';

export default function ProStatus({ isPro = false }: { isPro?: boolean }) {
    const { isCollapsed } = useSidebar();
    if (isCollapsed) return (
        <Hint label={isPro ? "You’re Pro" : 'Upgrade to Pro'} side="right">
            <div className={cn("mx-auto w-[90%] mt-2 flex justify-center items-center p-2 rounded hover:bg-muted transition-colors", isPro && 'border-primary bg-white hover:bg-white border max-w-fit')}>
                <CrownIcon className={cn("size-4 fill-yellow-500 text-yellow-500")} />
            </div>
        </Hint>
    )
    if (isPro) {
        return (
            <div className="mt-5 mb-3">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-[95%] mx-auto flex cursor-default"
                >
                    <CrownIcon className="mr-1 size-4 fill-yellow-500 text-yellow-500" />
                    <span className="brightness-[.6]">You’re on Pro</span>
                </Button>
            </div>
        );
    }

    return (
        <div className="mt-5 mb-3">
            <Button
                variant="secondary"
                size="sm"
                className="w-[95%] mx-auto flex"
            >
                <CrownIcon className="mr-1 size-4 fill-yellow-500 text-yellow-500" />
                <span className="brightness-[.6]">
                    Upgrade to Pro
                </span>
            </Button>
        </div>
    );
}
export function ProStatusSkeleton() {
    const { isCollapsed } = useSidebar();

    if (isCollapsed) {
        return (
            <div
                className={cn(
                    'mx-auto w-[90%] mt-2 flex justify-center items-center p-2 rounded',
                    'bg-muted'
                )}
            >
                <Skeleton className="size-4 rounded-full" />
            </div>
        );
    }

    return (
        <div className="mt-5 mb-3 px-2">
            <Skeleton className="h-8 w-full rounded-md" />
        </div>
    );
}