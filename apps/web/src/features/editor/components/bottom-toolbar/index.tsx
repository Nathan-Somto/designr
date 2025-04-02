import { Button } from '@designr/ui/components/button'
import { Menubar, MenubarMenu, MenubarSeparator } from '@designr/ui/components/menubar'
import { ZoomInIcon, ZoomOutIcon } from 'lucide-react'
import React from 'react'
import { zoomValues } from './data'
import EditorSelect from '../ui/editor-select'
import { ZoomValue } from '@designr/use-editor'
import { BaseEditorCompProps } from '../../types'

export default function BottomToolbar({ editor }: BaseEditorCompProps) {
    return (
        <section
            className='fixed px-6 bottom-[20px] text-muted-foreground right-0 z-[50] w-fit h-fit'
        >
            <Menubar>
                <MenubarMenu
                >
                    <Button variant={'ghost'} size='shrink'
                        onClick={() => editor?.zoomChange('+')}
                    >
                        <ZoomInIcon size={18} />
                    </Button>
                    <Button variant={'ghost'} size='shrink'
                        onClick={() => editor?.zoomChange('-')}
                    >
                        <ZoomOutIcon />
                    </Button>
                    <Button
                        variant={'ghost'}
                        className='text-xs font-medium'
                        size='shrink'
                        onClick={() => editor?.setZoomLevel({ value: '100%' })}
                    >
                        Reset
                    </Button>
                    <MenubarSeparator />
                    <EditorSelect
                        action='100%'
                        config={{ property: 'zoom', value: '100%' }}
                        options={zoomValues}
                        value={editor?.zoomValue}
                        onChange={(_, value) => {
                            editor?.setZoomLevel({
                                value: value as ZoomValue
                            })
                        }}
                    />
                </MenubarMenu>
            </Menubar>
        </section>
    )
}
