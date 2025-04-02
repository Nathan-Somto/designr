import React from 'react'
import { EditorInput } from '../ui/editor-input'
import EditorColorInput from '../ui/editor-color-input'
import { effects } from './data'
import { v4 } from 'uuid'
export default function EffectsSettings() {
    return (
        <div className='grid grid-cols-2 gap-2'>
            {
                effects.inputs.map(({ type, ...input }) => {
                    if (type === 'color') return <EditorColorInput
                        key={v4()}
                        action={input.action}
                        onChange={(_, newColor) => {
                            console.log(newColor)
                        }}
                        property={input.config.property as string}
                        value={input.config.value as string}
                    />;
                    return (
                        <EditorInput
                            key={v4()}
                            {...input}
                            type={type}
                            //@ts-ignore
                            config={input.config}
                            value={input.config.value}
                        />
                    )
                })
            }
        </div>
    )
}
