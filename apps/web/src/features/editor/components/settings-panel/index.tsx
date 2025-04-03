import React from 'react'
import { ScrollArea } from '@designr/ui/components/scroll-area'
import WorkspaceSettings from './workspace-settings'
import { Divider } from '@designr/ui/components/divider'
import AlignmentSettings from './alignment-settings'
import ElementSettings from './element-settings'
import TransformSettings from './transform-settings'
import TextSettings from './text-settings'
import ImageSettings from './image-settings'
import EditorShowPanel from '../ui/editor-show-panel'
import FillSettings from './fill-settings'
import StrokeSettings from './stroke-settings'
import EffectsSettings from './effects-settings'
import { BaseEditorCompProps } from '../../types'
export default function SettingsPanel({ editor }: BaseEditorCompProps) {
    const thereIsASelection = (editor?.selectedObjects?.length ?? 0) > 0
    console.log("selected object", editor?.selectedObjects);
    return (
        <ScrollArea
            id="editor__settings-panel"
            className='!fixed top-[120px] z-[60] right-[20px] !px-3 !py-5 w-[265px] !h-[350px] bg-white border border-gray-100 rounded-[8px] shadow-md'
        >
            {
                !thereIsASelection ? <WorkspaceSettings editor={editor} /> :
                    <>
                        {/* Alignment Settings */}
                        <AlignmentSettings />
                        {/* Divider */}
                        <Divider className='my-3' />
                        {/* Object Name(show as dropdown if it is a group) */}
                        {/* Element Settings */}
                        <ElementSettings
                            elements={['Rectangle', 'Circle', 'Triangle']}
                            isGroup={true}
                        />
                        {/* Divider */}
                        <Divider className='mt-2.5 mb-5' />
                        {/* Transform Settings */}
                        <TransformSettings />
                        {/* Divider */}
                        <Divider className='mt-2.5 mb-5' />
                        {/* Text Settings (shows only when it is type text) */}
                        <TextSettings />
                        <Divider className='mt-2.5 mb-5' />
                        {/* Image Settings */}
                        <ImageSettings />
                        <Divider className='mt-2.5 mb-5' />
                        {/* Fill  Settings (with show panel) */}
                        <EditorShowPanel
                            label='Fill'
                            id='fill-settings'
                            ComponentToRender={() => <FillSettings />}
                        /* on show set the fill to black */
                        /* on remove set it to transparent */
                        />
                        <Divider className='mt-2.5 mb-5' />
                        {/* Stroke Settings (with show panel) */}
                        <EditorShowPanel
                            label='Stroke'
                            id='stroke-settings'
                            ComponentToRender={() => <StrokeSettings />}
                        />
                        <Divider className='mt-2.5 mb-5' />
                        {/* Effect Settings (with show panel) */}
                        <EditorShowPanel
                            label='Effect'
                            id='effect-settings'
                            ComponentToRender={() => <EffectsSettings />}
                        />
                    </>
            }
        </ScrollArea>
    )
}
