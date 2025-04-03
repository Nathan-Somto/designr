import React from "react"
import { STROKE_COLOR, STROKE_WIDTH } from "../defaults"
import * as fabric from 'fabric'
import { CanvasAction } from "../types"
type Props = {
    canvas: fabric.Canvas
    currentAction: CanvasAction
    updateAction: (action: CanvasAction) => void
    line: React.MutableRefObject<fabric.Line | null>
}
export const lineDrawingHelpers = ({ canvas, currentAction, updateAction, line }: Props) => {
    const enableLineDrawingMode = () => {
        canvas.isDrawingMode = true
        canvas.on('mouse:down', (opt) => {
            const pointer = canvas.getScenePoint(opt.e)
            const points: [number, number, number, number] = [pointer.x, pointer.y, pointer.x, pointer.y]
            line.current = new fabric.Line(points, {
                strokeWidth: STROKE_WIDTH,
                stroke: STROKE_COLOR,
                fill: STROKE_COLOR,
                originX: 'center',
                originY: 'center'
            })
            canvas.add(line.current)
        })
        canvas.on('mouse:move', (opt) => {
            if (!canvas.isDrawingMode || !line.current) return
            //console.log("currentAction", currentAction);
            const pointer = canvas.getScenePoint(opt.e);
            line.current.set({ x2: pointer.x, y2: pointer.y });
            canvas.renderAll();
        })
        canvas.on('mouse:up', () => {
            if (!canvas.isDrawingMode || !line.current) return
            if (line.current) {
                line.current.set({
                    selectable: true,
                    evented: true,
                });
                disableLineDrawingMode();
            }
        })
    }
    const disableLineDrawingMode = () => {
        line.current = null
        canvas.isDrawingMode = false
        canvas.off('mouse:down')
        canvas.off('mouse:move')
        canvas.off('mouse:up')
        updateAction('Select')
    }
    return {
        /**
        * @description a function to enable line drawing mode on the canvas, it activates mouse up, down and move events to draw lines
        * @example 
        * const {editor} = useEditor();
        * editor?.enableLineDrawingMode();
       */
        enableLineDrawingMode,
        disableLineDrawingMode
    }
}