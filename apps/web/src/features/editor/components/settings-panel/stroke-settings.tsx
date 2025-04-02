import React from 'react'
import { stroke } from './data'
import EditorColorInput from '../ui/editor-color-input'
import { EditorInput } from '../ui/editor-input'
import EditorSelect from '../ui/editor-select'
import TransparencyButton from './transparency-button'
export default function StrokeSettings() {
    return (
        <div className='grid grid-cols-4 gap-2'>

            <EditorColorInput
                action={stroke.inputs[0].action}
                property={stroke.inputs[0].config.property as string}
                value={stroke.inputs[0].config.value as string}
                onChange={(_, newColor) => {
                    console.log(newColor)
                }}
                className='col-span-3'
            />
            <TransparencyButton
                currentColor={stroke.inputs[0].config.value as string}
                updateColor={() => { }}
                className='col-span-1'
            />
            <EditorSelect
                action={stroke.select.action}
                config={stroke.select.config}
                options={stroke.select.options as string[]}
                value={stroke.select.config.value}
                className='col-span-3'
            />
            <EditorInput
                Icon={stroke.inputs[1].Icon}
                action={stroke.inputs[1].action}
                property={stroke.inputs[1].config.property as string}
                type={stroke.inputs[1].type}
                value={stroke.inputs[1].config.value}
                className='col-span-1' />
        </div>
    )
}
