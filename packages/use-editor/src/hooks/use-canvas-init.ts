import React from "react";
import { CANVAS_BACKGROUND_COLOR, INITIAL_DIMENSIONS, JSON_KEYS, WORKSPACE_COLOR, WORKSPACE_NAME } from "../defaults";
import * as fabric from "fabric";
import { UseEditorProps } from "../types";
let svgBlobURL: string | null = null;
export function useCanvasInit({
    initialDimensions: dimensions,
    backgroundColor,
    canvasRef,
    workspaceColor,
    setCanvas,
    canvas,
    setZoom,
    initHistory
}: Pick<UseEditorProps, 'initialDimensions' | 'backgroundColor' | 'workspaceColor'> & {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    setCanvas: (canvas: fabric.Canvas) => void;
    canvas: fabric.Canvas | null;
    setZoom: (zoom: Readonly<number | null>) => void;
    initHistory: (initialState: string) => void
}) {
    const initialize = React.useCallback(() => {
        if (!canvasRef.current) return
        const customDefaults: Partial<
            fabric.TClassProperties<fabric.InteractiveFabricObject>
        > = {
            transparentCorners: false,
            cornerStyle: 'circle',
            borderScaleFactor: 2,
            padding: 1,
            borderColor: '#895af6',
            cornerColor: '#fff',
            cornerStrokeColor: 'rgb(0,0,0,0.15)',
            cornerSize: 10,
            _controlsVisibility: {
                tl: true, // Top-left
                tr: true, // Top-right
                bl: true, // Bottom-left
                br: true, // Bottom-right
                ml: true, // Middle-left
                mr: true, // Middle-right
                mt: false, // Middle-top
                mb: false, // Middle Bottom
                mtr: true  //Middle Top Right
            },
        }
        fabric.InteractiveFabricObject.ownDefaults = {
            ...fabric.InteractiveFabricObject.ownDefaults,
            ...customDefaults

        }
        fabric.Textbox.ownDefaults = {
            ...fabric.Textbox.ownDefaults,
            ...customDefaults
        }

        const canvasInstance = new fabric.Canvas(
            canvasRef.current,
            {
                height: window.innerHeight,
                width: window.innerWidth,
                controlsAboveOverlay: true,
                preserveObjectStacking: true,
                fill: backgroundColor || CANVAS_BACKGROUND_COLOR,
                backgroundColor: backgroundColor || CANVAS_BACKGROUND_COLOR,
                enableRetinaScaling: true,
                moveCursor: 'move',
                hoverCursor: 'default',
            }
        )
        function loadSVGAsImage(svgString: string, callback: (img: HTMLImageElement) => void) {
            if (!svgBlobURL) {
                const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
                svgBlobURL = URL.createObjectURL(blob);
            }
            const img = new Image();
            img.onload = function () {
                callback(img);
            };
            img.src = svgBlobURL;
        }
        const renderPillControl = (ctx: CanvasRenderingContext2D, left: number, top: number) => {
            const width = 7;
            const height = 14;
            const radius = 2.5;
            ctx.save();
            ctx.translate(left - width / 2, top - height / 2);
            ctx.beginPath();
            ctx.moveTo(radius, 0);
            ctx.lineTo(width - radius, 0);
            ctx.quadraticCurveTo(width, 0, width, radius);
            ctx.lineTo(width, height - radius);
            ctx.quadraticCurveTo(width, height, width - radius, height);
            ctx.lineTo(radius, height);
            ctx.quadraticCurveTo(0, height, 0, height - radius);
            ctx.lineTo(0, radius);
            ctx.quadraticCurveTo(0, 0, radius, 0);
            ctx.closePath();
            ctx.fillStyle = "#ffffff";
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
        }
        const defaultControls = fabric.FabricObject.createControls()
        const getCustomControls = () => {
            return {
                controls: {
                    ...defaultControls.controls,
                    mtr: new fabric.Control({
                        x: 0,
                        y: -0.5,
                        offsetY: -20,
                        cursorStyle: 'pointer',
                        render: (ctx, left, top) => {
                            loadSVGAsImage(
                                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" height="16" width="16">
                                <path d="M7.5 10h2.5v2.5" stroke-width="1"></path>
                                <path d="M12.16 6.9c0.54 -1.48 0.45 -2.86 -0.38 -3.69 -1.42 -1.42 -4.49 -0.65 -6.86 1.71 -2.37 2.37 -3.14 5.44 -1.71 6.86 1.39 1.39 4.37 0.68 6.71 -1.57" stroke-width="1"></path>
                            </svg>`,
                                (img) => {
                                    const size = 16; // Icon size
                                    ctx.save();
                                    ctx.translate(left, top)
                                    ctx.drawImage(img, -size / 2, -size / 2, size, size);
                                    ctx.restore();
                                }
                            );
                        },
                        actionHandler: fabric.controlsUtils.rotationWithSnapping
                    }),
                    ml: new fabric.Control({
                        x: -0.5,
                        y: 0,
                        render: renderPillControl,
                        actionHandler: fabric.controlsUtils.changeWidth,
                        actionName: 'resizing',
                        cursorStyle: 'e-resize'
                    }),
                    mr: new fabric.Control({
                        x: 0.5,
                        y: 0,
                        render: renderPillControl,
                        actionHandler: fabric.controlsUtils.changeWidth,
                        actionName: 'resizing',
                        cursorStyle: 'w-resize'
                    })
                }
            }
        }
        const controls = getCustomControls();
        fabric.FabricObject.createControls = function () {
            return controls;
        }
        fabric.FabricText.createControls = function () {
            return controls;
        }
        fabric.FabricImage.createControls = function () {
            return controls;
        }

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
            shadow: new fabric.Shadow({
                color: "rgba(0,0,0,0.2)",
                blur: 2,
            }),
            name: WORKSPACE_NAME
        });
        canvasInstance.clipPath = workspaceRect;
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
        const currentState = JSON.stringify(
            //@ts-ignore
            canvasInstance.toObject(JSON_KEYS)
        );
        initHistory(currentState)
        canvasInstance.renderAll();
        console.log("Canvas Has Been Initialized")

        //! setup the history api here
        //! the current state of the canvas, the intial history state
    }, [])
    React.useEffect(() => {
        const listener = () => {
            if (!svgBlobURL) return;
            URL.revokeObjectURL(svgBlobURL);
        }
        window.addEventListener('beforeunload', listener)
        initialize();
        return () => {
            canvas?.dispose();
            window.removeEventListener('beforeunload', listener)
        }
    }, [
        initialize
    ])
}