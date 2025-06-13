import React from 'react'
import { DragState } from '../../types'
import { ScrollArea } from '@designr/ui/components/scroll-area'
import { Divider } from '@designr/ui/components/divider'
import { LayerItem } from './layer-item'
import { motion } from 'motion/react'
import { useSettings } from '#/features/settings/settings-provider'
import { userSettingsDefaults } from '@designr/db/user-settings'
import { cn } from '@designr/ui/lib/utils'
import { EditorLayoutStyles } from '../ui/editor-layout-styles'
import { useEditorStore } from '../../hooks/useEditorStore'


export default function LayersPanel() {
    const { editor } = useEditorStore();
    //console.log('the layers: ', editor?.layers)
    const { settings } = useSettings();
    const key = settings?.layout?.layersPanel ?? userSettingsDefaults?.layout?.layersPanel
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
            data-position={key}
            className={cn('!px-3 !py-5 w-[215px] !h-[300px] bg-white border border-gray-100 rounded-[8px] shadow-md', EditorLayoutStyles[key])}
        >
            <h3 className='text-xs px-2 font-medium text-muted-foreground mb-3'>Layers</h3>
            <Divider />
            <motion.div ref={refContainer} className='mt-3 space-y-[2px]'>
                {editor?.layers?.map(layer => (
                    <LayerItem
                        key={layer.id}
                        refContainer={refContainer}
                        layer={layer}
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
