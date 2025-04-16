import React from "react"
import { UseLoadCanvasStateProps } from "../types"
/**
 * @description Loads the intial state persisted anywhere(db or local storage) into the canvas
 * @param param0 
 */
export function useLoadCanvasState({ canvas, state, initCanvasHistory, autoZoomToFit }: UseLoadCanvasStateProps) {
    React.useEffect(() => {
        if (!canvas || !state) return
        canvas.loadFromJSON(state, () => {
            canvas?.renderAll()
            //! state the history state here
            initCanvasHistory(state);
            //! auto zoom to the center point here
            autoZoomToFit();
        })
    }, [canvas, state])
}