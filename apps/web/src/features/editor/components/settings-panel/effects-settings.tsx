import React from 'react'
import { EditorInput } from '../ui/editor-input'
import EditorColorInput from '../ui/editor-color-input'
import { effects } from './data'
import { v4 } from 'uuid'
import { SelectedObject } from '@designr/use-editor'
import { useEditorStore } from '../../hooks/useEditorStore'
type EffectsType = "shadow.color" | "shadow.blur" | "shadow.offsetX" | "shadow.offsetY";
export default function EffectsSettings() {
    const {
        editor
    } = useEditorStore();
    const [effectsState, setEffectsState] = React.useState<Record<
        EffectsType,
        SelectedObject[EffectsType]
    >>({
        "shadow.blur": editor?.selectedObjects?.[0]?.['shadow.blur'] ?? 0,
        "shadow.color": editor?.selectedObjects?.[0]?.['shadow.color'] ?? '#000',
        "shadow.offsetX": editor?.selectedObjects?.[0]?.['shadow.offsetX'] ?? 0,
        "shadow.offsetY": editor?.selectedObjects?.[0]?.['shadow.offsetY'] ?? 0
    })
    const updateEffectState = (key: EffectsType, value: SelectedObject[EffectsType]) => {
        setEffectsState(prev => ({
            ...prev,
            [key]: value
        }))
        editor?.updateSelectedObjectProperty(key, value)
    }
    return (
        <div className='grid grid-cols-2 gap-2'>
            {
                effects.inputs.map(({ type, ...input }) => {
                    if (type === 'color') return <EditorColorInput
                        key={v4()}
                        action={input.action}
                        onChange={(_, newColor) => {
                            updateEffectState('shadow.color', newColor as string)
                        }}
                        property={input.config.property as string}
                        value={effectsState['shadow.color'] as string}
                    //supportsGradient
                    />;
                    return (
                        <EditorInput
                            key={v4()}
                            type={type}
                            value={effectsState[input.config.property as EffectsType]}
                            Icon={input.Icon}
                            action={input.action}
                            property={input.config.property as EffectsType}
                            onChange={(property, value) => {
                                updateEffectState(property as EffectsType, value)
                            }}
                        />
                    )
                })
            }
        </div>
    )
}
