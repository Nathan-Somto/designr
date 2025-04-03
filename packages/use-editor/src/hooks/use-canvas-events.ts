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
    updateAction
}: UseCanvasEventsProps) {
    React.useEffect(() => {
        if (!canvas) return;
        canvas?.on('object:added', (e) => {
            console.log('object:added');
            onObjectModified?.(e.target as unknown as fabric.FabricObject[]);
            onSave?.();
        });
        canvas?.on('object:modified', (e) => {
            console.log('object:modified');
            onSave?.();
            onObjectModified?.(e.target as unknown as fabric.FabricObject[]);
        });
        canvas?.on('object:removed', (e) => {
            console.log('object:removed');
            onObjectModified?.(e.target as unknown as fabric.FabricObject[]);
            onSave?.();
            //onSave?.(e.target?.canvas?.toDatalessJSON());
        });
        canvas?.on('object:moving', () => {
            updateAction('Translating')
        });
        canvas?.on('selection:created', (e) => {
            onObjectsSelection?.(e.selected, false)
            updateAction('Selection');
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


        return () => {
            canvas.off('mouse:down');
            canvas.off('object:added');
            canvas.off('object:modified');
            canvas.off('object:removed');
            canvas.off('object:moving');
            canvas.off('selection:created');
            canvas.off('mouse:wheel');
        }
    }, [canvas])
}