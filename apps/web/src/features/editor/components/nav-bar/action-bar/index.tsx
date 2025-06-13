import { Menubar, MenubarMenu } from '@designr/ui/components/menubar'
import React from 'react'
import PreviewButton from './preview-button'
import ShareButton from './share-button'
import DownloadButton from './download-button'
import KeyboardShortcuts from './keyboard-shortcuts'

export default function ActionBar() {
    return (
        <Menubar className='space-x-2'>
            <MenubarMenu>
                {/* Share Button */}
                <ShareButton
                />
                {/* Export Menu*/}
                <DownloadButton
                />
                {/* Preview Button */}
                <PreviewButton
                />
                {/* Key board Short cuts */}
                <KeyboardShortcuts />
            </MenubarMenu>
        </Menubar>
    )
}
