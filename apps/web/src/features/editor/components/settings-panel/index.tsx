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
    //console.log("selected object", editor?.selectedObjects);
    const uiStates = React.useMemo(() => {
        return {
            thereIsAnImage: editor?.selectedObjects?.some(item => editor?.isType(item.object, 'image')) ?? false,
            thereIsAtext: editor?.selectedObjects?.some(item => editor?.isType(item.object, 'text')) ?? false,
            thereIsACircle: editor?.selectedObjects?.some(item => editor?.isType(item.object, 'circle')) ?? false,
            shouldShowAlignment: editor?.selectedObjects?.length === 1
        }
    }, [editor?.selectedObjects])
    //console.log("layers: ", editor?.layers);
    const getGroupElementCounts = React.useCallback(() => {
        if (!editor?.selectedObjects?.length) return '';

        const groupObject = editor.selectedObjects[0].object;
        if (!editor.isType(groupObject, 'group')) return editor?.getType(groupObject) ?? '';

        const countMap: Record<string, number> = {};
        //@ts-ignore
        groupObject.getObjects().forEach((item) => {
            const type = editor?.getType(item);
            if (type) {
                countMap[type] = (countMap[type] || 0) + 1;
            }
        });

        return Object.entries(countMap).map(([type, count]) => `${type}(${count})`);
    }, [editor?.selectedObjects]);

    return (
        <ScrollArea
            id="editor__settings-panel"
            className='!fixed top-[120px] z-[60] right-[20px] !px-3 !py-5 w-[265px] !h-[350px] bg-white border border-gray-100 rounded-[8px] shadow-md'
        >
            {
                !thereIsASelection ?
                    <WorkspaceSettings editor={editor} /> :
                    <>
                        {uiStates.shouldShowAlignment && (
                            <>
                                {/* Alignment Settings */}
                                <AlignmentSettings editor={editor} />
                                {/* Divider */}
                                <Divider className='my-3' />
                            </>
                        )}
                        {/* Object Name(show as dropdown if it is a group) */}
                        {/* Element Settings */}
                        <ElementSettings
                            editor={editor}
                            thereIsACircle={uiStates?.thereIsACircle}
                            elements={getGroupElementCounts()}
                            isGroup={editor?.selectedObjects?.length === 1 && editor?.isType(editor?.selectedObjects?.[0]?.object, 'group')}
                        />
                        {/* Divider */}
                        <Divider className='mt-2.5 mb-5' />
                        {/* Transform Settings */}
                        <TransformSettings editor={editor} />
                        {/* Divider */}
                        <Divider className='mt-2.5 mb-5' />
                        {/* Text Settings (shows only when it is type text) */}
                        {uiStates?.thereIsAtext && (
                            <>
                                <TextSettings editor={editor} />
                                <Divider className='mt-2.5 mb-5' />
                            </>
                        )}
                        {/* Image Settings */}
                        {uiStates?.thereIsAnImage && (
                            <>
                                <ImageSettings
                                    editor={editor}
                                />
                                <Divider className='mt-2.5 mb-5' />
                            </>
                        )}
                        {/* Fill  Settings (with show panel) */}
                        <EditorShowPanel
                            label='Fill'
                            id='fill-settings'
                            open={editor?.selectedObjects?.[0]?.fill !== undefined}
                            ComponentToRender={FillSettings}
                            props={
                                {
                                    editor
                                }
                            }
                        />
                        <Divider className='mt-2.5 mb-5' />
                        {/* Stroke Settings (with show panel) */}
                        <EditorShowPanel
                            label='Stroke'
                            id='stroke-settings'
                            open={editor?.selectedObjects?.[0]?.strokeColor !== undefined}
                            ComponentToRender={StrokeSettings}
                            props={{
                                editor
                            }}
                        />
                        <Divider className='mt-2.5 mb-5' />
                        {/* Effect Settings (with show panel) */}
                        <EditorShowPanel
                            label='Effect'
                            id='effect-settings'
                            open={editor?.selectedObjects?.[0]?.['shadow.color'] !== undefined}
                            ComponentToRender={EffectsSettings}
                            props={{
                                editor
                            }}
                        />
                    </>
            }
        </ScrollArea>
    )
}
