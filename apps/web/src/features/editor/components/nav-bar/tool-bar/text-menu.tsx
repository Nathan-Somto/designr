import { Button } from '@designr/ui/components/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@designr/ui/components/dropdown-menu'
import { text } from '../data'
import React from 'react'
import { TextConfig } from '@designr/use-editor'
import Hint from '@designr/ui/components/hint'
import { BaseEditorCompProps } from '#/features/editor/types'

export default function TextMenu({ editor }: BaseEditorCompProps) {
    const {
        Icon,
        action
    } = text
    const handleAction = (
        props: {
            config: Omit<TextConfig, 'value'>,
            value: string
        }
    ) => {
        editor?.addText({
            ...props.config,
            value: props.value
        })
    }
    return (
        <DropdownMenu>
            <Hint label={action}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant={'selection'}
                        className='font-medium'
                        size='shrink'
                    >
                        <Icon />
                    </Button>
                </DropdownMenuTrigger>
            </Hint>
            <DropdownMenuContent
                sideOffset={8}
                align='end'
                className='z-[65]'
            >
                {text.options.map(({
                    label,
                    config: { value, ...rest },
                }) => (
                    <DropdownMenuItem
                        asChild
                        key={label}
                        style={rest}
                        onClick={() => handleAction({ value, config: rest })}
                    >
                        <Button
                            variant={'selection'}
                            className='w-full justify-start text-xs font-medium'
                            style={{
                                ...rest
                            }}
                        >
                            {label}
                        </Button>
                    </DropdownMenuItem>
                ))}

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
