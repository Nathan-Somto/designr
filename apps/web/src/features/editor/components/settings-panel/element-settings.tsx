import React from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuItem } from '@designr/ui/components/dropdown-menu'
import {
    EditorInput
} from '../ui/editor-input'
import {
    element as elementData
} from './data'
type Props = {
    isGroup?: boolean
    elements: string | string[]
}
export default function ElementSettings({
    isGroup,
    elements
}: Props) {
    return (
        <div className='mt-2' >
            {
                !isGroup && !Array.isArray(elements) ?
                    <h3
                        className='text-sm font-medium text-muted-foreground px-2 mb-2'
                    >{elements}</h3> :
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className='flex items-center gap-x-2 text-sm font-medium text-muted-foreground px-2 mb-2'>
                                <h3>Group({elements.length})</h3>
                                <ChevronDownIcon size={14} />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='z-[200000]'>
                            {
                                (elements as string[]).map((item, index) => {
                                    return (
                                        <DropdownMenuItem key={index} className='text-xs cursor-default font-medium'>
                                            {item}
                                        </DropdownMenuItem>
                                    )
                                })
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
            }
            <div
                className='grid w-full grid-cols-2 mt-2 gap-2 rounded-none'
            >
                {
                    elementData.inputs.map((item, index) => {
                        return (
                            <EditorInput
                                key={index}
                                value={item.config.value}
                                Icon={item.Icon}
                                action={item.action}
                                type={item.type}
                                property={item.config.property ?? ''}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}
