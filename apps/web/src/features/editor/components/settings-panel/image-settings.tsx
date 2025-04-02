import React from 'react'
import EditorSelect from '../ui/editor-select'
import { filter } from './data'
export default function ImageSettings() {
    return (
        <section id="image-settings">
            <div className='flex items-center gap-x-2 mb-2 text-muted-foreground'>
                <h3 className='text-xs font-medium'>Image</h3>
            </div>
            <div className='grid w-full grid-cols-2 gap-y-3 gap-x-3.5 rounded-none'>
                <EditorSelect
                    value={filter.config.value}
                    action={filter.action}
                    config={filter.config}
                    options={filter.options as string[]}
                    className='col-span-2'
                />
            </div>
        </section>
    )
}
