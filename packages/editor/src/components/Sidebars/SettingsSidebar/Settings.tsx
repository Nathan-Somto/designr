import React from 'react'
import { useCanvas } from '@/hooks/useCanvas'
import DimensionSettings from './PositionSettings';
import TextSettings from './TextSettings';
import { SelectedObject } from './types';
import ImageSettings from './ImageSettings';
import AppearanceSettings from './AppearanceSettings';
import ShadowSettings from './ShadowSettings';
import { useWorkspace } from '@/hooks/useWorkspace';
import { workspace } from './data';
import WorkspaceSettings from './WorkspaceSettings';


export default function Settings() {
    const { canvas } = useCanvas()
    const showSettings = useWorkspace(state => state.showSettings);
    const [selectedObject, setSelectedObject] = React.useState<SelectedObject | null>(null)
    const handleObjectSelection = (target: SelectedObject['object'], renderCanvas = true) => {
        const selection: SelectedObject = {
            object: target,
            fill: target.fill as string,
            angle: target.angle,
            x: target.getX(),
            y: target.getY(),
            cornerSize: target.cornerSize,
            opacity: target.opacity,
            'shadow.color': target.shadow?.color ?? '#000',
            'shadow.blur': target.shadow?.blur ?? 0,
            'shadow.offsetX': target.shadow?.offsetX ?? 0,
            'shadow.offsetY': target.shadow?.offsetY ?? 0,
        }

        if (target.type !== 'circle') {
            selection.width = target.width * target.scaleX
            selection.height = target.height * target.scaleY
        }
        else if (target.type === 'circle') {
            //@ts-expect-error: the radius prop exists but the types are not included
            selection.diameter = Math.round(target.radius * 2 * target.scaleX)
        }
        if (target.type === 'image') {
            //@ts-expect-error: the filter prop exists but the types are not included
            selection.filter = target.filters[0]?.type
        }
        if (target.type === 'textbox') {
            //@ts-expect-error: the text prop exists but the types are not included
            selection.fontFamily = target.fontFamily
            //@ts-expect-error: the fontSize prop exists but the types are not included
            selection.fontWeight = target.fontWeight
            //@ts-expect-error: the fontSize prop exists but the types are not included
            selection.fontSize = target.fontSize
            //@ts-expect-error: the fontStyle prop exists but the types are not included
            selection.fontStyle = target.fontStyle
            //@ts-expect-error: the textDecoration prop exists but the types are not included
            selection.textDecoration = target.textDecoration
            //@ts-expect-error: the textAlign prop exists but the types are not included
            selection.textAlign = target.textAlign
            //@ts-expect-error: the letterSpacing prop exists but the types are not included
            selection.letterSpacing = target.letterSpacing
            //@ts-expect-error: the lineHeight prop exists but the types are not included
            selection.lineHeight = target.lineHeight
            //@ts-expect-error: the text transform prop exists but the types are not included
            selection.textTransform = target.textTransform
            //@ts-expect-error: the underline prop exists but the types are not included
            selection.underline = target.underline
            //@ts-expect-error: the lineThrough prop exists but the types are not included
            selection.textDecoration = target.underline ? 'underline' : target.lineThrough ? 'line-through' : 'none'
        }
        //console.log('selection', selection)
        setSelectedObject(selection)
        if (renderCanvas) {
            canvas?.renderAll()
        }
    }

    React.useEffect(() => {
        if (!canvas) return
        canvas.on('selection:created', (e) => {
            //console.log("created", e.selected[0])
            // keep track of width and height
            handleObjectSelection(e.selected[0], false)
        })
        canvas.on('selection:updated', (e) => {
            handleObjectSelection(e.selected[0], false)
        })
        canvas.on("object:scaling", (e) => {
            handleObjectSelection(e.target, false)
        })
        canvas.on("object:modified", (e) => {
            handleObjectSelection(e.target, false)
        })
        canvas.on('selection:cleared', () => {
            setSelectedObject(null)
        })
        return () => {
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvas])
    return (

        <div className='fixed top-[100px] h-[calc(100vh-100px)] bg-panel right-0 text-panel-foreground shadow-[0_4px_8px_rgba(0, 0, 0, 0.1)] flex flex-col gap-[10px] py-3 px-0 rounded-[6px] w-[250px]  overflow-y-auto overflow-x-hidden' id="settings__panel">
            <div className='px-4'>
                <h2 className='font-semibold text-lg text-left mb-0'>{showSettings ? workspace.label : 'Settings'}</h2>
                <p className='text-sm opacity-80 text-left'>{showSettings ? workspace.description : 'make edits to your design'}</p>
            </div>
            {!showSettings && (
                <>
                    <DimensionSettings
                        selectedObject={selectedObject}
                        handleObjectSelection={handleObjectSelection}
                    />
                    <AppearanceSettings
                        selectedObject={selectedObject}
                        handleObjectSelection={handleObjectSelection}
                    />
                    <TextSettings
                        selectedObject={selectedObject}
                        handleObjectSelection={handleObjectSelection}
                    />
                    <ImageSettings
                        selectedObject={selectedObject}
                        handleObjectSelection={handleObjectSelection}
                    />
                    <ShadowSettings
                        selectedObject={selectedObject}
                        handleObjectSelection={handleObjectSelection}
                    />
                </>
            )}
            {
                showSettings && (
                    <WorkspaceSettings />
                )
            }
        </div>
    )
}
