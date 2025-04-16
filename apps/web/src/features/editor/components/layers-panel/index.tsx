import React from 'react'
import { BaseEditorCompProps, DragState } from '../../types'
import { ScrollArea } from '@designr/ui/components/scroll-area'
import { Divider } from '@designr/ui/components/divider'
import { LayerItem } from './layer-item'
import { motion } from 'motion/react'


export default function LayersPanel({ editor }: BaseEditorCompProps) {
    //console.log('the layers: ', editor?.layers)
    const refContainer = React.useRef<HTMLDivElement>(null)
    const [dragState, setDragState] = React.useState<DragState>({
        currentItemId: null,
        parentId: null,
        dropId: null,
        dropZIndex: -1,
    })
    return (
        <ScrollArea
            id="editor__layers-panel"
            className='!fixed top-[120px] z-[60] left-[20px] !px-3 !py-5 w-[215px] !h-[300px] bg-white border border-gray-100 rounded-[8px] shadow-md'
        >
            <h3 className='text-xs px-2 font-medium text-muted-foreground mb-3'>Layers</h3>
            <Divider />
            <motion.div ref={refContainer} className='mt-3 space-y-[2px]'>
                {editor?.layers?.map(layer => (
                    <LayerItem
                        key={layer.id}
                        refContainer={refContainer}
                        layer={layer}
                        editor={editor}
                        dragState={
                            dragState
                        }
                        setDragState={setDragState}
                    />
                ))}
            </motion.div>
        </ScrollArea>
    )
}
