import { cn } from '@designr/ui/lib/utils'
import { EyeOpenIcon } from '@designr/ui/react-icons'
import { EditorGradient } from '@designr/use-editor'
import { colord } from 'colord'
import { EyeClosedIcon } from 'lucide-react'
import React from 'react'
type Props = {
    currentColor: string | EditorGradient
    // eslint-disable-next-line no-unused-vars
    updateColor: (color: string | EditorGradient) => void
    className?: string
}
export default function TransparencyButton({ currentColor, updateColor, className }: Props) {
    const isTransparent = typeof currentColor === 'string' ? colord(currentColor).alpha() === 0 : false
    const toggleTransparency = () => {
        if (typeof currentColor !== 'string') return;
        if (!isTransparent) {
            // set the color to a transparent color
            updateColor(colord(currentColor).alpha(0).toHex())
            return;
        }
        updateColor(colord(currentColor).alpha(1).toHex())
    }
    return (
        <button
            id="transparency-button"
            aria-label='Toggle Transparency'
            aria-pressed={isTransparent}
            onClick={toggleTransparency}
            className={cn('flex items-center max-w-fit  min-w-fit justify-center transition-opacity duration-200 text-muted-foreground hover:bg-muted px-4 ml-auto py-1 text-xs', className)}
        >
            {isTransparent ? <EyeClosedIcon height={16} width={16} /> : <EyeOpenIcon height={16} width={16} />}
        </button>
    )
}
