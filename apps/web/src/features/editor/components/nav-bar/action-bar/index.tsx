import { Menubar, MenubarMenu } from '@designr/ui/components/menubar'
import React from 'react'
import PreviewButton from './preview-button'
import ShareButton from './share-button'
import DownloadButton from './download-button'
import KeyboardShortcuts from './keyboard-shortcuts'
import { BaseEditorCompProps } from '#/features/editor/types'

export default function ActionBar({ editor }: BaseEditorCompProps) {
    return (
        <Menubar className='space-x-2'>
            <MenubarMenu>
                {/* Share Button */}
                <ShareButton
                    editor={editor}
                />
                {/* Export Menu*/}
                <DownloadButton
                    editor={editor}
                />
                {/* Preview Button */}
                <PreviewButton
                    editor={editor}
                />
                {/* Key board Short cuts */}
                <KeyboardShortcuts />
            </MenubarMenu>
        </Menubar>
    )
}
