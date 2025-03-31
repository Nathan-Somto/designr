import React from 'react'
import { ScrollArea } from '@designr/ui/components/scroll-area'
import WorkspaceSettings from './workspace-settings'
export default function SettingsPanel() {
    const thereIsASelection = false
    return (
        <ScrollArea
            id="editor__settings-panel"
            className='!fixed top-[120px] z-[60] right-[20px] !px-3 !py-5 w-[265px] !h-[350px] bg-white border border-gray-100 rounded-[8px] shadow-md'
        >
            {
                !thereIsASelection ? <WorkspaceSettings /> : null
            }
        </ScrollArea>
    )
}
