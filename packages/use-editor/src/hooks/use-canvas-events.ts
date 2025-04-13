import React from "react";
import { UseCanvasEventsProps } from "../types";
import fabric from "fabric";
/**
 * 
 * @description Handles all the events that occur on the canvas
 * @param param0
 */
export function useCanvasEvents({
    canvas,
    onClear,
    onObjectsSelection,
    onObjectsDeselection,
    onObjectModified,
    onSave,
    updateAction,
    menuRef,
    updateContextMenuPosition
}: UseCanvasEventsProps) {
    React.useEffect(() => {
        if (!canvas) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                updateContextMenuPosition(null);
            }
        }
        canvas?.on('object:added', (e) => {
            console.log('object:added');
            onObjectModified?.(e.target as unknown as fabric.FabricObject[]);
            onSave?.();
        });
        canvas?.on('object:modified', (e) => {
            console.log('object:modified');
            onSave?.();
            onObjectModified?.(e.target as unknown as fabric.FabricObject[]);
            onObjectsSelection?.([e.target], false)
        });
        canvas.on("object:scaling", (e) => {
            onObjectsSelection?.([e.target], false);
        })
        canvas?.on('object:removed', (e) => {
            console.log('object:removed');
            onObjectModified?.(e.target as unknown as fabric.FabricObject[]);
            onSave?.();
        });
        canvas?.on('object:moving', () => {
            updateAction('Translating')
        });
        canvas?.on('selection:created', (e) => {
            console.log("selection:created");
            onObjectsSelection?.(e.selected, false)
            updateAction('Selection');
        })
        canvas?.on('selection:updated', (e) => {
            console.log("selection:updated");
            onObjectsSelection?.(e.selected, false)
        })
        canvas?.on('selection:cleared', () => {
            onObjectsDeselection?.()
        })
        canvas?.on('mouse:wheel', function (opt) {
            const e = opt.e;
            e.preventDefault();
            let deltaX = e.deltaX; // Horizontal movement
            let deltaY = e.deltaY; // Vertical movement
            let vpt = canvas.viewportTransform;

            if (!vpt) return;

            // Panning (horizontally or vertically)
            vpt[4] -= deltaX; // Pan horizontally
            vpt[5] -= deltaY; // Pan vertically

            // Pan limits (prevents moving too far)
            const zoom = canvas.getZoom();
            const maxPanX = (canvas.getWidth() * zoom) / 2;
            const maxPanY = (canvas.getHeight() * zoom) / 2;
            //Acts as a boundary for the panning
            vpt[4] = Math.max(-maxPanX, Math.min(maxPanX, vpt[4]));
            vpt[5] = Math.max(-maxPanY, Math.min(maxPanY, vpt[5]));

            canvas.requestRenderAll();
            //canvas.renderAll();
        });
        canvas?.on('contextmenu', (evt) => {
            evt.e.preventDefault();
            // only activate if there is a selected object
            if (canvas.getActiveObject()) {
                updateContextMenuPosition({ x: (evt.e as PointerEvent).clientX, y: (evt.e as PointerEvent).clientY })
            }
            else {
                updateContextMenuPosition(null)
            }
        })
        document.addEventListener('click', handleClickOutside);
        return () => {
            canvas.off('mouse:down');
            canvas.off('object:added');
            canvas.off('object:modified');
            canvas.off('object:removed');
            canvas.off('object:moving');
            canvas.off('selection:created');
            canvas.off("selection:cleared");
            canvas.off('selection:updated');
            canvas.off('mouse:wheel');
            canvas.off('contextmenu');
            canvas.off('object:scaling');
            document.removeEventListener('click', handleClickOutside);
        }
    }, [canvas])
}