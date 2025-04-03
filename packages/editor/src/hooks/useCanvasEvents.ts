import { useEffect, useRef } from "react";
import { useCanvas } from "./useCanvas";
import { useHistory } from "./useHistory";
import * as fabric from 'fabric'
export function useCanvasEvents() {
    const lastSave = useRef<string | null>(null);
    const { save, history, pointer } = useHistory();
    const { canvas, updateAction } = useCanvas();
    useEffect(() => {
        if (canvas !== null) {
            const saveCanvas = () => {
                console.log("lastSave.current", lastSave.current)
                if (pointer > 0 && lastSave.current !== null && lastSave.current === history[history.length - 1]) {
                    return;
                }
                lastSave.current = history[history.length - 1];
                save(canvas);
            }
            canvas.on('mouse:down', () => {
            })
            canvas.on('object:added', () => {
                console.log('object:added');
                saveCanvas();
                //localStorage.setItem('canvas', JSON.stringify(canvasInstance))
            });
            canvas.on('object:modified', () => {
                console.log('object:modified');
                saveCanvas();
                //localStorage.setItem('canvas', JSON.stringify(canvasInstance))
            });
            canvas.on('object:removed', () => {
                console.log('object:removed');
                saveCanvas();
                //localStorage.setItem('canvas', JSON.stringify(canvasInstance))
            });
            canvas.on('object:moving', () => {
                updateAction('Translating')
            });
            canvas.on('mouse:wheel', function (opt) {
                const e = opt.e;
                let deltaX = e.deltaX; // Horizontal movement
                let deltaY = e.deltaY; // Vertical movement
                let vpt = canvas.viewportTransform;

                if (!vpt) return;

                // Panning (always works, even after zoom)
                vpt[4] -= deltaX; // Pan horizontally
                vpt[5] -= deltaY; // Pan vertically

                // Pan limits (prevents moving too far)
                const zoom = canvas.getZoom(); // Get current zoom level
                const maxPanX = (canvas.getWidth() * zoom) / 2;
                const maxPanY = (canvas.getHeight() * zoom) / 2;

                vpt[4] = Math.max(-maxPanX, Math.min(maxPanX, vpt[4]));
                vpt[5] = Math.max(-maxPanY, Math.min(maxPanY, vpt[5]));

                e.preventDefault();
                canvas.requestRenderAll();
            });

            document.addEventListener('keydown', (e) => {
                //e.preventDefault();
                if (!e.ctrlKey || (e.key !== '+' && e.key !== '-')) return;

                let zoom = canvas.getZoom();
                zoom *= e.key === '+' ? 1.1 : 0.9;
                zoom = Math.min(5, Math.max(0.5, zoom));

                const activeObject = canvas.getActiveObject();
                if (activeObject) {
                    const objCenter = activeObject.getCenterPoint();
                    canvas.zoomToPoint(objCenter, zoom);
                }
                else {
                    // just zoom to the center of the canvas
                    canvas.zoomToPoint(new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2), zoom);
                }

                e.preventDefault();
                canvas.requestRenderAll();
            });

            // save(canvas)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvas])
}