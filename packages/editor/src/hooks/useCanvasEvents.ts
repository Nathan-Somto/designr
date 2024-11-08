import { useEffect, useRef } from "react";
import { useCanvas } from "./useCanvas";
import { useHistory } from "./useHistory";
import * as fabric from 'fabric'
export function useCanvasEvents() {
    const lastSave =useRef<string | null>(null);
    const {save, history, pointer} = useHistory();
    const {canvas, updateAction} = useCanvas();
    useEffect(() => {
        if(canvas !== null){
            const saveCanvas = () => {
                console.log("lastSave.current", lastSave.current)
                if(pointer > 0 && lastSave.current !== null && lastSave.current === history[history.length - 1]){
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
            canvas.on("mouse:wheel", (opt) => {
                const delta = opt.e.deltaY;
                let zoom = canvas.getZoom();
                zoom *= 0.999 ** delta
                zoom = Math.max(0.1, Math.min(20, zoom));
                canvas.setZoom(zoom);
                const point = new fabric.Point({
                    x: opt.e.offsetX, y: opt.e.offsetY
                })
                canvas.zoomToPoint(point, zoom);
                opt.e.preventDefault();
                opt.e.stopPropagation();
            })         
         
           // save(canvas)
        }        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvas])
}