'use client'
import React from 'react'
import { cn } from '@designr/ui/lib/utils'
import { Button } from '@designr/ui/components/button'

type SuggestionGridProps = {
    data: string[]
    onSelect?: (suggestion: string) => void
    className?: string,
    isPending: boolean
}

export default function SuggestionGrid({
    data,
    onSelect,
    className,
    isPending
}: SuggestionGridProps) {
    return (
        <div
            style={{
                height: 'calc(90vh - 220px)'
            }}
            className='max-w-[calc(100%-200px)] flex-col h-[calc(90vh-160px)] flex-1 flex items-center justify-center mx-auto'>
            <h2 className='text-2xl text-center font-medium mb-5'>
                Hi what can I help you with?
            </h2>
            <div className={cn('grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4', className)}>
                {data.slice(0, 3).map((text, idx) => (
                    <Button
                        key={idx}
                        variant="ghost"
                        onClick={() => onSelect?.(text)}
                        className={cn("text-left bg-muted h-auto !text-muted-foreground text-sm hover:opacity-50  font-normal whitespace-normal shadow-sm !rounded-md transition-shadow", isPending && 'opacity-50 pointer-events-none')}
                    >
                        {text}
                    </Button>
                ))}
            </div>
        </div>
    )
}
