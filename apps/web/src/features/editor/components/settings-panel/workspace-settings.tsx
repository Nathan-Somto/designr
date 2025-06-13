import React, { useState, useEffect } from 'react'
import { workspace } from './data'
import { EditorInput } from '../ui/editor-input'
import EditorSelect from '../ui/editor-select'
import EditorColorInput from '../ui/editor-color-input'
import { GridIcon } from 'lucide-react'
import { EditorGradient } from '@designr/use-editor'
import { useSettings } from '#/features/settings/settings-provider'
import { userSettingsDefaults } from '@designr/db/user-settings'
import { useEditorStore } from '../../hooks/useEditorStore'

export default function WorkspaceSettings() {
    const { editor } = useEditorStore();
    const properties = editor?.getWorkSpaceProperties();
    const { settings } = useSettings();
    const isGridEnabled = settings?.gridEnabled ?? userSettingsDefaults?.gridEnabled
    // Local state for width, height, and grid lines
    const [width, setWidth] = useState(properties?.width ?? 525);
    const [height, setHeight] = useState(properties?.height ?? 300);
    const [gridIsActive, setGridIsActive] = useState(properties?.gridIsActive ?? false);
    const [backgroundColor, setBackgroundColor] = useState(properties?.fill ?? '#fff');
    const [gridDimensions, setGridDimensions] = useState(`${properties?.gridHorizontal ?? 12}x${properties?.gridVertical ?? 12}`)

    useEffect(() => {
        if (!properties) return;
        setWidth(properties.width);
        setHeight(properties.height);
        setGridDimensions(`${properties.gridHorizontal}x${properties.gridVertical}`)
        setGridIsActive(properties.gridIsActive);
    }, [properties]);

    return (
        <div>
            <h3 className='text-xs px-2 font-medium text-muted-foreground mb-4'>File size</h3>

            {/* Width and Height Inputs */}
            <div className='grid grid-cols-2 gap-2 mb-3.5'>
                <EditorInput
                    type="int"
                    Icon={workspace.inputs[0].Icon}
                    property="width"
                    action="Set Width"
                    onChange={(_, value) => {
                        const newWidth = +value || 0;
                        setWidth(newWidth);
                        editor?.setWorkSpaceSize(newWidth, height);
                    }}
                    value={width}
                />
                <EditorInput
                    type="int"
                    Icon={workspace.inputs[1].Icon}
                    property="height"
                    action="Set Height"
                    onChange={(_, value) => {
                        const newHeight = +value || 0;
                        setHeight(newHeight);
                        editor?.setWorkSpaceSize(width, newHeight);
                    }}
                    value={height}
                />
            </div>

            {/* Preset Dimensions Selector */}
            <EditorSelect
                Icon={workspace.selects[0].Icon}
                action={workspace.selects[0].action}
                config={workspace.selects[0].config}
                options={workspace.selects[0].options}
                value={`${width}x${height}`}
                onChange={(_, value) => {
                    if (typeof value !== 'string') return;
                    const [newWidth, newHeight] = value.split('x').map(Number);
                    setWidth(newWidth);
                    setHeight(newHeight);
                    editor?.setWorkSpaceSize(newWidth, newHeight);
                }}
            />

            <div className='h-[0.25px] mt-7 mb-5 bg-background' />

            {/* Background Color */}
            <div>
                <h3 className='text-xs text-muted-foreground font-medium mb-2 px-2'>Background Color</h3>
            </div>
            <EditorColorInput
                action="Background Color"
                value={backgroundColor as string | EditorGradient}
                property="background"
                supportsGradient
                onChange={(_, newColor) => {
                    console.log("the new color:", newColor);
                    setBackgroundColor(newColor);
                    editor?.setWorkspaceColor(newColor);
                }}
            />
            {
                isGridEnabled && (
                    <>
                        <div className='h-[0.25px] mt-2 mb-6 bg-background' />

                        {/* Grid Settings */}
                        <div>
                            <h3 className='text-xs text-muted-foreground font-medium mb-3 px-2'>Grid Lines</h3>
                        </div>
                        <div className='grid grid-cols-2 gap-2 mb-2'>
                            <EditorSelect
                                action="Grid Overlay"
                                Icon={() => <GridIcon size={18} />}
                                options={['On', 'Off']}
                                value={gridIsActive ? 'On' : 'Off'}
                                config={{ property: 'grid', value: 'Off' }}
                                className='col-span-2 mb-0.5'
                                onChange={(_, value) => {
                                    const isActive = value === 'On';
                                    setGridIsActive(isActive);
                                    editor?.addGridToCanvas({
                                        showGrid: isActive,
                                    });
                                }}
                            />
                            {/* Grid Horizontal & Vertical Inputs */}
                            <EditorSelect
                                Icon={workspace.selects[1].Icon}
                                action={workspace.selects[1].action}
                                config={workspace.selects[1].config}
                                options={workspace.selects[1].options}
                                className='col-span-2'
                                value={gridDimensions}
                                onChange={(_, value) => {
                                    if (typeof value !== 'string') return;
                                    const [gridHorizontal, gridVertical] = value.split('x').map(Number);
                                    setGridDimensions(value);
                                    if (gridIsActive) {
                                        editor?.addGridToCanvas({
                                            gridHorizontal,
                                            gridVertical,
                                            showGrid: true
                                        })
                                        return;
                                    }
                                    editor?.setGridDimensions({
                                        gridHorizontal,
                                        gridVertical
                                    })
                                }}
                            />
                        </div>
                    </>
                )
            }
        </div>
    );
}
