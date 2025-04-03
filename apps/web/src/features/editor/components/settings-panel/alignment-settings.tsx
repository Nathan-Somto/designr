import React from 'react'
import { alignment } from './data'
import { Alignment } from '@designr/use-editor'
import EditorButtonSelect from '../ui/editor-button-select'
import { BaseEditorCompProps } from '../../types'
export default function AlignmentSettings({ editor }: BaseEditorCompProps) {
    const [selectedValue, setSelectedValue] = React.useState<Alignment>(editor?.selectedObjects?.[0]?.align ?? 'none')
    return (
        <div className='grid w-full grid-cols-6 gap-2 rounded-none'>
            {
                alignment.options.map((item, index) => {
                    return (
                        <EditorButtonSelect
                            key={index}
                            selectedValue={selectedValue}
                            value={item.config.value}
                            Icon={item.Icon}
                            action={item.action}
                            onChange={(_, value) => {
                                editor?.updateSelectedObjectProperty('align', value as Alignment)
                                setSelectedValue(value as Alignment)
                            }}
                            property={item.config.property}
                            className='size-8'
                        />
                    )
                })
            }
        </div>
    )
}
