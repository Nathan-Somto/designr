import React from 'react'
import { fill, opacity } from './data'
import { EditorInput } from '../ui/editor-input'
import EditorColorInput from '../ui/editor-color-input'
import { EditorGradient } from '@designr/use-editor'
import TransparencyButton from './transparency-button'
import { useEditorStore } from '../../hooks/useEditorStore'
export default function FillSettings() {
    const { editor } = useEditorStore();
    const [color, setColor] = React.useState<string | EditorGradient>(editor?.selectedObjects?.[0]?.fill ?? '#000')
    const [localOpacity, setLocalOpacity] = React.useState<number>((editor?.selectedObjects?.[0]?.opacity ?? 1) * 100)
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
                type={'int'}
                value={localOpacity}
                onChange={(_, newOpacity) => {
                    setLocalOpacity(newOpacity as number)
                    editor?.updateSelectedObjectProperty('opacity', (newOpacity as number) / 100)
                }}
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
