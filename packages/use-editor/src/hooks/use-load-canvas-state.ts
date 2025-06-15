import React from "react"
import { UseLoadCanvasStateProps } from "../types"
/**
 * @description Loads the intial state persisted anywhere(db or local storage) into the canvas
 * @param param0 
 */
export function useLoadCanvasState({ canvas, state, initCanvasHistory, autoZoomToFit }: UseLoadCanvasStateProps) {
    React.useEffect(() => {
        async function loadCanvasState() {
            if (!canvas || !state) return

            await canvas.loadFromJSON(state)
            canvas?.renderAll()
            //! state the history state here
            initCanvasHistory(state);
            //! auto zoom to the center point here
            autoZoomToFit();
        }
        loadCanvasState().catch((error) => {
            console.error("Error loading canvas state:", error);
        })
    }, [canvas, state])
}