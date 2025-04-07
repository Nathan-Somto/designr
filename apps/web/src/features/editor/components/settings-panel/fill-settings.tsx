import React from 'react'
import { fill, opacity } from './data'
import { EditorInput } from '../ui/editor-input'
import EditorColorInput from '../ui/editor-color-input'
import { EditorGradient } from '@designr/use-editor'
import TransparencyButton from './transparency-button'
import { BaseEditorCompProps } from '../../types'
export default function FillSettings({ editor }: BaseEditorCompProps) {
    const [color, setColor] = React.useState<string | EditorGradient>(editor?.selectedObjects?.[0]?.fill ?? '#000')
    return (
        <div className='grid grid-cols-7 gap-x-2 items-center'>
            <EditorColorInput
                action={fill.action}
                property={fill.config.property as string}
                value={color}
                supportsGradient
                onChange={(_, newColor) => {
                    editor?.updateSelectedObjectProperty('fill', newColor);
                    setColor(newColor)
                }}
                className='col-span-3'
            />
            <EditorInput
                Icon={opacity.Icon}
                action={opacity.action}
                property={opacity.config.property as string}
                type={opacity.type}
                value={opacity.config.value}
                className="col-span-2"
            />

            <TransparencyButton
                currentColor={color}
                updateColor={(color) => {
                    editor?.updateSelectedObjectProperty('fill', color)
                    setColor(color)
                }}
                className='col-span-2'
            />
        </div>
    )
}
