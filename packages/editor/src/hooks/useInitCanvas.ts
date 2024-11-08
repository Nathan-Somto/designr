
import * as fabric from 'fabric'
import { useHistory } from '@/hooks/useHistory'
import { useCanvas } from './useCanvas'
import { useEffect, useRef } from 'react'



export function useInitCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const {setCanvas} = useCanvas()
    const {save, history} = useHistory()
    useEffect(() => {
        // check local storage for a saved instance
        //const savedInstance = localStorage.getItem('canvas')
        console.log("height:", canvasRef.current?.clientHeight)
        const canvasInstance = new fabric.Canvas(canvasRef.current as HTMLCanvasElement, {
            height: canvasRef.current?.offsetHeight || window.innerHeight,
            width: canvasRef.current?.offsetWidth || window.innerWidth,
            
        });
        
        canvasInstance.backgroundColor = '#d1d5db';
        canvasInstance.renderAll();
        // Define the rectangle workspace
        const workspaceRect = new fabric.Rect({
            width: (canvasRef.current?.offsetWidth || window.innerWidth) * 0.5,
            height: (canvasRef.current?.offsetHeight || window.innerHeight) * 0.5,
            fill: '#eee',
            strokeWidth: 2,
            selectable: false,
            rx: 10,
            ry: 10,
            name: 'workspace',
        }); 
        //const {y, x} = canvasInstance.getCenterPoint();
        // Center the rectangle on the canvas
       /*  workspaceRect.set({
            left: x,
            top: y,
        }); */
       /*  const scale = fabric.util.findScaleToFit(workspaceRect, {
            width:canvasInstance.width,
            height: canvasInstance.height
        })
        
        canvasInstance.zoomToPoint(new fabric.Point(x, y), 0.75 * scale); */
        canvasInstance.centerObject(workspaceRect);
        canvasInstance.clipPath = workspaceRect;
        canvasInstance.add(workspaceRect);
        setCanvas(canvasInstance)
       /*  canvasInstance.loadFromJSON(JSON.parse(history[history.length - 1]), () => {
            canvasInstance.renderAll()
            save(canvasInstance)  
        }) */
            return () => {
                canvasInstance.dispose()
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    
  
   return {
    canvasRef
   }
}


