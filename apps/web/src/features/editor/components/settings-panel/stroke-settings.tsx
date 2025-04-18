import React from 'react'
import { stroke } from './data'
import EditorColorInput from '../ui/editor-color-input'
import { EditorInput } from '../ui/editor-input'
import EditorSelect from '../ui/editor-select'
import TransparencyButton from './transparency-button'
import { BaseEditorCompProps, EditorInputValue } from '../../types'
export default function StrokeSettings({
    editor
}: BaseEditorCompProps) {
    const [strokeState, setStrokeState] = React.useState({
        strokeColor: editor?.selectedObjects?.[0]?.strokeColor ?? '#000',
        strokeWidth: editor?.selectedObjects?.[0]?.strokeWidth ?? 1,
        borderStyle: editor?.selectedObjects?.[0]?.borderStyle ?? 'solid'
    })
    const updateStrokeState = (key: keyof typeof strokeState, value: typeof strokeState[keyof typeof strokeState]) => {
        setStrokeState(prev => ({
            ...prev,
            [key]: value
        }))
        editor?.updateSelectedObjectProperty(key, value);
    }
    return (
        <div className='grid grid-cols-4 gap-2'>

            <EditorColorInput
                action={stroke.inputs[0].action}
                property={stroke.inputs[0].config.property as string}
                value={strokeState.strokeColor}
                onChange={(_, newColor) => {
                    updateStrokeState('strokeColor', newColor as string)
                }}
                className='col-span-3'
            />
            <TransparencyButton
                currentColor={strokeState.strokeColor}
                updateColor={(color) => {
                    updateStrokeState('strokeColor', color as string)
                }}
                className='col-span-1'
            />
            <EditorSelect
                action={stroke.select.action}
                config={stroke.select.config}
                options={stroke.select.options as string[]}
                value={strokeState.borderStyle}
                onChange={(_, newStyle) => {
                    updateStrokeState('borderStyle', newStyle)
                }}
                className='col-span-3'
            />
            <EditorInput
                Icon={stroke.inputs[1].Icon}
                action={stroke.inputs[1].action}
                property={stroke.inputs[1].config.property as string}
                type={stroke.inputs[1].type as Exclude<EditorInputValue, 'color'>}
                value={strokeState.strokeWidth}
                onChange={(_, newWidth) => {
                    updateStrokeState('strokeWidth', newWidth)
                }}
                className='col-span-1 !px-1 ml-auto' />
        </div>
    )
}
