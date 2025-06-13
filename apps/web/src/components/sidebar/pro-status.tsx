import { Button } from '@designr/ui/components/button';
import { Skeleton } from '@designr/ui/components/skeleton';
import Hint from '@designr/ui/components/hint';
import { CrownIcon } from 'lucide-react';
import React from 'react';
import { useSidebar } from './sidebar-provider';
import { cn } from '@designr/ui/lib/utils';
import { useRouter } from 'next/navigation';
import { LINKS } from '#/constants/links';

export function ProButton() {
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
    )
}


export function UpgradeToProButton(props: {
    type?: 'default'
} | {
    type?: 'overlay';
    show?: boolean;
}) {
    const router = useRouter();

    if (props.type === 'default' || props.type === undefined) {
        return (
            <div className="mt-5 mb-3">
                <Button
                    variant="secondary"
                    onClick={() => router.push(LINKS.SUBSCRIPTIONS)}
                    size="sm"
                    className="w-[95%] mx-auto flex"
                >
                    <CrownIcon className="mr-1 size-4 fill-yellow-500 text-yellow-500" />
                    <span className="brightness-[.6]">Upgrade to Pro</span>
                </Button>
            </div>
        );
    }

    if (props.type === 'overlay' && !props?.show) return null;

    return (
        <div
            className={cn(
                'absolute inset-0 z-50 flex items-center justify-center rounded-xl backdrop-blur-md bg-white/10 border border-white/20',
                'cursor-pointer'
            )}
            onClick={() => router.push(LINKS.SUBSCRIPTIONS)}
        >
            <div className="flex items-center space-x-2 text-sm text-white font-semibold">
                <CrownIcon className="size-4 fill-yellow-400 text-yellow-400" />
                <span>Upgrade to Pro</span>
            </div>
        </div>
    );
}

export function ProOnlyMessageWall() {
    return (
        <div className="absolute size-full inset-0 bg-white/10 backdrop-blur-md z-50 flex items-center justify-center">
            <div className='flex flex-col justify-center text-center items-center p-4 gap-y-2'>
                <h2 className='text-3xl  font-semibold mb-2'>
                    <CrownIcon className="size-8 inline-flex mr-1.5 fill-yellow-500 text-yellow-500 mb-4" />
                    <span>Pro Feature</span>
                </h2>
                <p className='text-sm text-muted-foreground  mx-auto text-balance w-[95%] leading-5'>
                    This feature is only available for Pro users. Please upgrade your account to access it.
                </p>
                <UpgradeToProButton />
            </div>
        </div>
    );
}
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
        return <ProButton />;
    }

    return <UpgradeToProButton />;
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