'use client';

import { motion } from 'framer-motion';
import { Button } from '@designr/ui/components/button';
import React, { useState } from 'react';
import { cn } from '@designr/ui/lib/utils';
import { ArrowRightIcon } from 'lucide-react';
import { MagicWandIcon } from '@designr/ui/react-icons';
import { useCreateProjectDialog } from './hooks/use-project-create-dialog';

type TimeState = 'morning' | 'afternoon' | 'evening';

const getTimeState = (): TimeState => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'evening';
};

const gradientMap: Record<TimeState, string> = {
    morning: 'from-[#aee2ff] via-[#d5caff] to-[#b892ff]',
    afternoon: 'from-[#9ccafe] via-[#a58fff] to-[#895af6]',
    evening: 'from-[#2b2c48] via-[#5b4dc5] to-[#201134]',
};

const messageMap: Record<TimeState, { heading: string; sub: string }> = {
    morning: {
        heading: 'Good morning, Creator!',
        sub: 'Sketch out your next big idea with fresh eyes.',
    },
    afternoon: {
        heading: 'Good afternoon, Designer!',
        sub: 'Let’s turn your vision into beautiful pixels.',
    },
    evening: {
        heading: 'Good evening, Artist.',
        sub: 'Perfect time to refine or dream something bold.',
    },
};

export default function DashboardBanner() {
    const [showDialog, setShowDialog] = useState(false);
    const timeState = getTimeState();
    const gradient = gradientMap[timeState];
    const { heading, sub } = messageMap[timeState];
    const {
        dialog
    } = useCreateProjectDialog({
        open: showDialog,
        onOpenChange: setShowDialog,
        defaultHeight: window.innerHeight,
        defaultWidth: window.innerWidth,
    })
    const onCreateClick = () => {
        setShowDialog(true);
    }
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65 }}
                className={cn(
                    'rounded-xl p-6 mt-3 flex items-center gap-x-10 h-[180px] text-white shadow-lg relative overflow-hidden',
                    'bg-gradient-to-r',
                    gradient
                )}
            >
                <div className="relative hidden size-28 lg:flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-white/50 animate-pulse" />
                    <div className="relative z-10 rounded-full size-20 flex items-center justify-center bg-white">
                        <MagicWandIcon
                            className={cn(
                                "!h-20 !w-10",
                                timeState === "morning" && "text-[#d5caff] fill-[#d5caff]",
                                timeState === "afternoon" && "text-[#a58fff] fill-[#a58fff]",
                                timeState === "evening" && "text-[#5b4dc5] fill-[#5b4dc5]"
                            )}
                        />
                    </div>
                </div>

                <div className="relative z-10 text-left">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow">
                        {heading}
                    </h1>
                    <p className="text-sm block !ml-0 md:text-base mb-4 text-white/90">
                        {sub}
                    </p>
                    <Button
                        size="sm"
                        className='flex'
                        variant="secondary"
                        onClick={onCreateClick}
                    >
                        <span className='brightness-[.6] font-medium'>Start Designing</span> <ArrowRightIcon />
                    </Button>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.15, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="absolute bottom-0 z-[20] right-0 w-40 h-40 md:w-60 md:h-60 bg-white rounded-full blur-[45px] pointer-events-none"
                />
            </motion.div>
            {dialog}
        </>
    );
}
