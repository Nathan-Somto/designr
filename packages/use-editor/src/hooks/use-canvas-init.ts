import React from "react";
import { CANVAS_BACKGROUND_COLOR, INITIAL_DIMENSIONS, WORKSPACE_COLOR, WORKSPACE_NAME } from "../defaults";
import * as fabric from "fabric";
import { UseEditorProps } from "../types";
export function useCanvasInit({
    initialDimensions: dimensions,
    backgroundColor,
    canvasRef,
    workspaceColor,
    setCanvas,
    canvas,
    setZoom
}: Pick<UseEditorProps, 'initialDimensions' | 'backgroundColor' | 'workspaceColor'> & {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    setCanvas: (canvas: fabric.Canvas) => void;
    canvas: fabric.Canvas | null;
    setZoom: (zoom: Readonly<number | null>) => void;

}) {
    const initialize = React.useCallback(() => {
        if (!canvasRef.current) return
        const canvasInstance = new fabric.Canvas(
            canvasRef.current,
            {
                height: window.innerHeight,
                width: window.innerWidth,
                controlsAboveOverlay: true,
                preserveObjectStacking: true,
                fill: backgroundColor || CANVAS_BACKGROUND_COLOR,
                backgroundColor: backgroundColor || CANVAS_BACKGROUND_COLOR,

            }
        )
        // Define the rectangle workspace
        const workspaceRect = new fabric.Rect({
            width: dimensions?.width || INITIAL_DIMENSIONS.width,
            height: dimensions?.height || INITIAL_DIMENSIONS.height,
            fill: workspaceColor || WORKSPACE_COLOR,
            selectable: false,
            rx: 10,
            ry: 10,
            strokeWidth: 0,
            stroke: "rgba(0,0,0,0)",
            name: WORKSPACE_NAME,
            shadow: new fabric.Shadow({
                color: "rgba(0,0,0,0.2)",
                blur: 2,
            }),
        });
        canvasInstance.centerObject(workspaceRect);
        canvasInstance.add(workspaceRect);
        canvasInstance.add(workspaceRect);
        const zoom = fabric.util.findScaleToFit({
            width: workspaceRect.width,
            height: workspaceRect.height
        }, {
            width: canvasInstance.width,
            height: canvasInstance.height
        }) * 0.7
        // zoom to fit comes here
        canvasInstance.zoomToPoint(canvasInstance.getCenterPoint(), zoom)
        setZoom(zoom)
        setCanvas(canvasInstance)
        canvasInstance.renderAll();
        console.log("Canvas Has Been Initialized")

        //! setup the history api here
        //! the current state of the canvas, the intial history state
    }, [])
    React.useEffect(() => {
        initialize();
        return () => {
            canvas?.dispose();
        }
    }, [
        initialize
    ])
}