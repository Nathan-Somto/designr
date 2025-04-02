import React from 'react'
import {
    EditorInput
} from '../ui/editor-input'
import {
    transform as transformData
} from './data'
import Hint from '@designr/ui/components/hint'
import { HelpCircleIcon } from 'lucide-react'
export default function TransformSettings() {
    return (
        <div>
            <div
                className='flex items-center gap-x-2 mb-3 text-muted-foreground'>
                <h3
                    className='text-xs font-medium'
                >Advanced Transform</h3>
                <Hint
                    label={`Advanced Transform allows you to apply custom transformations\nto the selected element. such as scale, rotate and skew.`}
                    className='ml-2 z-[500000]'>
                    <HelpCircleIcon size={16} className='cursor-pointer hover:scale-105 hover:border-foreground/20 rounded-full border border-transparent' />
                </Hint>
            </div>
            <div
                className='grid w-full grid-cols-2 mt-2 gap-2 rounded-none'
            >
                {
                    transformData.inputs.map((item, index) => {
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
