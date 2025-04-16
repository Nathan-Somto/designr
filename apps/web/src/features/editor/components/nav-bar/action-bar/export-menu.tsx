import { Button } from '@designr/ui/components/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@designr/ui/components/dropdown-menu'
import { exportMenu } from '../data'
import React from 'react'
import { BaseEditorCompProps } from '#/features/editor/types'
type Action = typeof exportMenu.options[number]['action']
export default function ExportMenu({ editor }: BaseEditorCompProps) {
    const {
        label,
        Icon,
    } = exportMenu
    const handleExportAction = (action: Action) => {
        switch (action) {
            case 'JSON':
                //! export the canvas to json
                editor?.exportAsJSON();
                break;
            case 'PNG':
                //! export the canvas to png
                break;
            case 'SVG':
                //! export the canvas to svg
                break;
        }
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className='font-medium [&>svg]:!size-3.5 !h-8'
                >
                    <Icon />
                    {label}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                sideOffset={8}
                align='end'
                className='z-[70]'
            >
                {exportMenu.options.map(({
                    Icon,
                    action
                }) => (
                    <DropdownMenuItem
                        asChild
                        key={action}
                        onClick={() => handleExportAction(action)}
                    >
                        <Button
                            variant={'selection'}
                            className='w-full justify-start text-xs font-medium'
                        >
                            <Icon />
                            <span>
                                {action}
                            </span>
                        </Button>
                    </DropdownMenuItem>
                ))}

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
