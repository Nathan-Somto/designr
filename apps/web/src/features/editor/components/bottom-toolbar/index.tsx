import { Button } from '@designr/ui/components/button'
import { Menubar, MenubarMenu, MenubarSeparator } from '@designr/ui/components/menubar'
import { ZoomInIcon, ZoomOutIcon } from 'lucide-react'
import React from 'react'
import { zoomValues } from './data'
import EditorSelect from '../ui/editor-select'
import { ZoomValue } from '@designr/use-editor'
import { BaseEditorCompProps } from '../../types'
import { useSettings } from '#/features/settings/settings-provider'
import { cn } from '@designr/ui/lib/utils'
import { EditorLayoutStyles } from '../ui/editor-layout-styles'
import { userSettingsDefaults } from '@designr/db/user-settings'

export default function BottomToolbar({ editor }: BaseEditorCompProps) {
    const { settings } = useSettings();
    const key = settings?.layout?.zoomControls ?? userSettingsDefaults?.layout?.zoomControls
    return (
        <section
            className={cn('px-6 text-muted-foreground w-fit h-fit', EditorLayoutStyles[key])}
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
