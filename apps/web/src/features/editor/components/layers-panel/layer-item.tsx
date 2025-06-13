import React, { useState } from 'react'
import { ChevronRight, ChevronDown, Eye, EyeOff, Lock, Unlock } from 'lucide-react'
import { Button } from '@designr/ui/components/button'
import { cn } from '@designr/ui/lib/utils'
import { DragState } from '../../types'
import { Layers } from '@designr/use-editor'
import { Divider } from '@designr/ui/components/divider'
import { motion } from 'motion/react'
import { useEditorStore } from '../../hooks/useEditorStore'
interface LayerItemProps {
    layer: Layers
    parentLayerId?: string
    depth?: number
    refContainer: React.RefObject<HTMLDivElement>
    dragState: DragState
    setDragState: (dragState: DragState) => void
}

export function LayerItem({ layer, depth = 0, refContainer, parentLayerId, dragState, setDragState }: LayerItemProps) {
    const { editor } = useEditorStore();
    const [open, setOpen] = useState(false)
    const [isVisibile, setIsVisible] = React.useState(layer.isVisibile);
    const [isLocked, setIsLocked] = React.useState(layer.isLocked)
    const isGroup = !!layer.children?.length
    //@ts-ignore
    const isSelected = editor?.selectedLayer?.id === layer.id

    const handleSelect = () => {
        if (editor) {
            console.log("selected")
            editor.selectLayerInCanvas(layer.id)
        }
    }
    const handleVisibilityToggle = () => {
        setIsVisible(prev => !prev)
        editor?.toggleLayerVisibility(layer)
    }
    const handleLockToggle = () => {
        setIsLocked(prev => !prev);
        editor?.toggleLayerLock(layer);
    }
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setDragState({
            ...dragState,
            currentItemId: layer.id,
        })
    }
    const handleDragEnd = () => {
        console.log("the drag state: ", dragState);
        if (dragState.currentItemId === null || dragState.dropZIndex === -1) return;
        console.log("moving layers")
        editor?.moveLayer({
            layerId: dragState.currentItemId,
            parentLayerId: dragState.parentId ?? undefined,
            targetIndex: dragState.dropZIndex
        })
        setDragState({
            ...dragState,
            dropId: null,
            dropZIndex: -1
        })
    }
    const handleDragOver = () => {
        //e.preventDefault();
        if (layer.id !== dragState.dropId) {
            console.log("dragging over")
            setDragState({
                ...dragState,
                dropZIndex: layer.zIndex,
                dropId: layer.id,
                parentId: parentLayerId ?? null
            })
        }
    }
    const showDropIndicator = dragState.dropId === layer.id && dragState.dropId !== null
    return (
        <div
        >
            {showDropIndicator && <Divider className='bg-primary my-[1.25px] h-[1.25px]' />}
            <div
                onDragOver={handleDragOver}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                draggable
            >
                <motion.div
                    layout
                    layoutId={layer.id}
                    data-selected={isSelected}
                    onClick={() => {
                        handleSelect()
                    }}
                    className={cn(
                        'flex items-center justify-between group h-8 text-xs rounded-[8px] px-2 py-[2px] cursor-pointer group transition-all',
                        isSelected ? 'hover:!bg-primary/10 hover:!text-primary !text-secondary-foreground data-[selected=true]:!bg-primary/10 data-[selected=true]:!text-primary' : 'hover:border hover:border-primary',
                        depth > 0 && 'ml-2',
                    )}
                >
                    <div className='flex items-center gap-1'>
                        {isGroup && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setOpen(!open)
                                }}
                                data-selected={isSelected}
                                className='text-muted-foreground data-[selected=true]:!text-primary'
                            >
                                {open ? (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                ) : (
                                    <ChevronRight className="w-3.5 h-3.5" />
                                )}
                            </button>
                        )}
                        <span className='text-xs'>{layer.type}</span>
                    </div>

                    <div className="flex opacity-0 group-hover:opacity-100 ease-in transition-opacity items-center gap-x-1.5">
                        <Button
                            variant="ghost"
                            size="shrink"
                            data-selected={isSelected}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLockToggle();
                            }}
                            className="p-0 size-fit text-black/80 data-[selected=true]:!text-primary"
                        >
                            {isLocked ? (
                                <Lock className="!size-[12px]" />
                            ) : (
                                <Unlock className="!size-[12px]" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="shrink"
                            data-selected={isSelected}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleVisibilityToggle();
                            }}
                            className="p-0 size-fit text-black/80 data-[selected=true]:!text-primary"
                        >
                            {isVisibile ? (
                                <Eye className="!size-[12px]" />
                            ) : (
                                <EyeOff className="!size-[12px]" />
                            )}
                        </Button>
                    </div>
                </motion.div>
            </div>
            {open && isGroup && (
                <div className="pl-3 mt-1 space-y-[2px]">
                    {layer.children?.map((child) => (
                        <LayerItem
                            key={child.id}
                            layer={child}
                            parentLayerId={layer.id}
                            refContainer={refContainer}
                            depth={depth + 1}
                            dragState={dragState}
                            setDragState={setDragState}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
