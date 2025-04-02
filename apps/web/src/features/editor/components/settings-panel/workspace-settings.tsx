import React from 'react'
import { workspace } from './data'
import { EditorInput } from '../ui/editor-input'
import EditorSelect from '../ui/editor-select'
import EditorColorInput from '../ui/editor-color-input'
import { EditorGradient } from '@designr/use-editor'
import { GridIcon } from 'lucide-react'

export default function WorkspaceSettings() {
    const [color, setColor] = React.useState<string | EditorGradient>('#000000')
    return (
        <div>
            <h3
                className='text-xs px-2 font-medium text-muted-foreground mb-4'>File size</h3>
            {/* Width and height inputs */}
            <div className='grid grid-cols-2 gap-2 mb-3.5'>
                {
                    workspace.inputs.slice(0, 2).map(({ type, ...input }, index) => {
                        if (type === 'color') return null;
                        return (
                            <EditorInput
                                key={index}
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
            {/* Custom dimension inputs */}
            <EditorSelect
                Icon={workspace.selects.Icon}
                action={workspace.selects.action}
                config={workspace.selects.config}
                options={workspace.selects.options}
                value={'525x300'}
            />
            <div className='h-[0.25px] mt-7 mb-5 bg-background' />
            {/* Color input */}
            <div>
                <h3 className='text-xs text-muted-foreground font-medium mb-2 px-2'>Background Color</h3>
            </div>
            <EditorColorInput
                action='Background Color'
                value={color}
                property='background'
                supportsGradient
                onChange={(_, newColor) => {
                    setColor(newColor)
                }}
            />
            {/* what else can come here */}
            <div className='h-[0.25px] mt-2 mb-6 bg-background' />
            <div>
                <h3 className='text-xs text-muted-foreground font-medium mb-3 px-2'>Grid Lines</h3>
            </div>
            <div
                className='grid grid-cols-2 gap-2 mb-2'
            >
                <EditorSelect
                    action="Grid Overlay"
                    Icon={() => <GridIcon size={18} />}
                    options={['On', 'Off']}
                    value={'Off'}
                    config={{ property: 'grid', value: 'Off' }}
                    className='col-span-2 mb-2'
                />
                {
                    workspace.inputs.slice(2, 4).map(({ type, ...input }, index) => {
                        if (type === 'color') return null;
                        return (
                            <EditorInput
                                key={index}
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
        </div>
    )
}
