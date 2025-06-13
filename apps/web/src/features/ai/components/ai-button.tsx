'use client';
import React from 'react'
import { SparklesIcon } from 'lucide-react'
import { Button } from '@designr/ui/components/button'
import { cn } from '@designr/ui/lib/utils';
import Hint from '@designr/ui/components/hint';
import dynamic from 'next/dynamic';
import { useEditorStore } from '#/features/editor/hooks/useEditorStore';
const AiDialog = dynamic(() => import('./ai-dialog'));
type Props = {
    /** used to position the ai button within the editor */
    className?: string
}
export default function AiButton({
    className = "",
}: Props) {
    const [open, setOpen] = React.useState(false);
    const {
        editor
    } = useEditorStore();
    return (
        <>
            <Hint
                label='Get inspired with Designr AI.'
                align='center'
                alignOffset={10}
            >
                <Button
                    onClick={() => setOpen(true)}
                    variant="outline"
                    className={cn(
                        'relative border-transparent rounded-full size-10 flex items-center justify-center',
                        className
                    )}
                >
                    <div className="absolute -inset-1 rounded-full z-[-1] animate-pulse-glow bg-[#d5caff] opacity-40 group-hover:opacity-60 transition-opacity" />
                    <SparklesIcon className="size-5 text-[#5b4dc5] fill-[#5b4dc5]" />
                </Button>
            </Hint>
            <AiDialog
                onOpenChange={setOpen}
                openProp={open}
                onUse={async (payload) => {
                    switch (payload.type) {
                        case 'text_to_design':
                            await editor?.loadFromJson(payload.content)
                            break;
                        case 'generate_image':
                            editor?.addImage(payload.content)
                            break;
                        default:
                            console.warn('Unknown AI payload type:', payload.type);
                            break;
                    }
                }}
            />
        </>
    )
}
