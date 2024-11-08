import { ZoomInIcon, ZoomOutIcon } from 'lucide-react'
import React from 'react'
import { useCanvas } from '@/hooks/useCanvas'
import * as fabric from 'fabric'
import { useImageStore } from '@/hooks/useImage'
import { cn } from '@repo/ui/lib/utils'
export default function BottomToolbar() {
    const isSidebarOpen = useImageStore(store => store.isSidebarOpen)
    const {
        canvas
    } = useCanvas();
    const [zoomLevel, setZoomLevel] = React.useState<number>(canvas?.getZoom() ?? 1)
    const handleZoomLevel = (direction: 'in' | 'out' | 'reset') => {
        if (!canvas) return;
        let zoom = canvas.getZoom();
        zoom = direction === 'reset' ? 1 : direction === 'in' ? Math.min(zoom + 0.1, 5) : Math.max(zoom - 0.1, 0.2);
        const selectedEl = canvas.getActiveObject();
        if (selectedEl) {
            canvas.zoomToPoint(new fabric.Point({
                x: selectedEl.getX(),
                y: selectedEl.getY()
            }),
                zoom
            )
        }
        else {
            canvas.setZoom(zoom);
        }
        setZoomLevel(zoom);
        canvas.renderAll();
    }
    return (
        <div
            className={cn('fixed bottom-4 bg-panel left-[20px] h-12 overflow-hidden rounded-[8px] text-panel-foreground w-[320px]', isSidebarOpen && 'right-[20px] left-auto', )}
        >
            <div className='flex items-center gap-x-3 w-full'>
                <div className='flex items-center gap-x-5 h-12 w-[240px] flex-shrink-0 justify-center border-r border-r-neutral-300'>
                    <button onClick={() => handleZoomLevel('in')} className='p-2 rounded-[8px] hover:bg-neutral-300 hover:text-black/70'>
                        <ZoomInIcon />
                    </button>
                    <button onClick={() => handleZoomLevel('out')} className='p-2 hover:bg-neutral-300 hover:text-black/70 rounded-[8px]'>
                        <ZoomOutIcon />
                    </button>
                    <button onClick={() => handleZoomLevel('reset')} className='p-2 hover:bg-neutral-300 hover:text-black/70 rounded-[8px]'>
                        Reset
                    </button>
                </div>
                <p className='max-w-fit text-center w-[80px] flex-shrink-0'>{(zoomLevel * 100).toFixed(1)}%</p>
            </div>
        </div>
    )
}
