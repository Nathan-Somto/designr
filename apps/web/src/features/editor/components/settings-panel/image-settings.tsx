import React from 'react'
import EditorSelect from '../ui/editor-select'
import { filter } from './data'
import { FabricFilterType } from '@designr/use-editor'
import { useEditorStore } from '../../hooks/useEditorStore'
export default function ImageSettings() {
    const { editor } = useEditorStore();
    const [filterState, setFilterState] = React.useState(editor?.selectedObjects?.[0]?.filter ?? filter.config.value)
    return (
        <section id="image-settings">
            <div className='flex items-center gap-x-2 mb-2 text-muted-foreground'>
                <h3 className='text-xs font-medium'>Image</h3>
            </div>
            <div className='grid w-full grid-cols-2 gap-y-3 gap-x-3.5 rounded-none'>
                <EditorSelect
                    value={filterState}
                    onChange={(_, val) => {
                        setFilterState(val as FabricFilterType)
                        editor?.updateSelectedObjectProperty('filter', val as FabricFilterType)
                    }}
                    action={filter.action}
                    config={filter.config}
                    options={filter.options as string[]}
                    className='col-span-2'
                />
            </div>
        </section>
    )
}
