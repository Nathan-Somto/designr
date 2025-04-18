import React from 'react'
import {
    EditorInput
} from '../ui/editor-input'
import {
    transform as transformData
} from './data'
import Hint from '@designr/ui/components/hint'
import { HelpCircleIcon } from 'lucide-react'
import { BaseEditorCompProps, EditorInputValue } from '../../types'
import { SelectedObject } from '@designr/use-editor'
export default function TransformSettings({ editor }: BaseEditorCompProps) {
    const [transformState, setTransformState] = React.useState<
        Record<"scaleX" | "scaleY" | "skewX" | "skewY", SelectedObject["scaleX" | "scaleY" | "skewX" | "skewY"]>
    >({
        scaleX: editor?.selectedObjects?.[0]?.scaleX ?? 0,
        scaleY: editor?.selectedObjects?.[0]?.scaleY ?? 0,
        skewX: editor?.selectedObjects?.[0]?.skewX ?? 0,
        skewY: editor?.selectedObjects?.[0]?.skewY ?? 0
    })
    React.useEffect(() => {
        const selectedObject = editor?.selectedObjects?.[0]?.object;
        if (selectedObject) {
            setTransformState(prev => ({
                ...prev,
                scaleX: selectedObject.scaleX,
                scaleY: selectedObject.scaleY,
                skewX: selectedObject.skewX,
                skewY: selectedObject.skewY
            }))
        }
    }, [editor?.selectedObjects])
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
                                value={item.config.property ? transformState[item.config.property]?.toFixed(2) : 0}
                                Icon={item.Icon}
                                action={item.action}
                                type={item.type as Exclude<EditorInputValue, 'color'>}
                                property={item.config.property ?? ''}
                                onChange={(key, value) => {
                                    setTransformState(prev => ({
                                        ...prev,
                                        [key]: value
                                    }))
                                    editor?.updateSelectedObjectProperty(key as "scaleX" | "scaleY" | "skewX" | "skewY", value as number)
                                }}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}
