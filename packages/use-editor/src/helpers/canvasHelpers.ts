import * as fabric from "fabric";
import { Alignment, BorderStyle, CanvasHelpersProps, EditorGradient, EditorGradientDirection, FabricFilterType, SelectedObject, TextConfig, ZoomDirection, ZoomValue } from '../types'
import { FILL_COLOR, STROKE_COLOR, STROKE_WIDTH, WORKSPACE_NAME } from '../defaults'
import { randomPosition } from './randomPosition';
import { createLink } from './createLink';
import { createFilter } from "./createFilter";
/**
 * @description this is a huge file that contains all the helper functions that interact with the canvas i.e adding shapes,text, images, changing properties of an object, getting the state of current selection
 */
export default function canvasHelpers({ canvas, filename, setZoom, updateAction }: CanvasHelpersProps) {
    //====== INSERTERS ======
    const insertElement = (canvas: fabric.Canvas, element: fabric.Object) => {
        const workspace = getWorkspace(canvas);
        canvas.isDrawingMode = false;
        if (!workspace) return
        //! switching to center point allows for easy identification
        const points = workspace.getCenterPoint();
        element.set({
            top: points.y,
            left: points.x,
        })
        canvas.add(element)
        canvas.setActiveObject(element)
    }
    const addCircle = (circleProps?: fabric.CircleProps) => {
        const circle = new fabric.Circle({
            radius: 50,
            stroke: STROKE_COLOR,
            fill: FILL_COLOR,
            ...circleProps
        })
        insertElement(canvas, circle)
        updateAction('Circle');
    }
    const addRectangle = (rectProps?: fabric.RectProps) => {
        const rect = new fabric.Rect({
            width: 100,
            height: 100,
            stroke: STROKE_COLOR,
            fill: FILL_COLOR,
            ...rectProps
        })
        insertElement(canvas, rect)
        updateAction('Rectangle')
    }
    const addTriangle = (triangleProps?: fabric.FabricObjectProps) => {
        const triangle = new fabric.Triangle({
            width: 100,
            height: 100,
            stroke: STROKE_COLOR,
            fill: FILL_COLOR,
            ...triangleProps
        })
        insertElement(canvas, triangle)
        updateAction('Triangle')
    }
    const addDiamond = (diamondProps?: Omit<
        fabric.RectProps,
        'angle'
    >) => {
        const polygon = new fabric.Rect(
            {
                width: 100,
                height: 100,
                angle: 45,
                stroke: STROKE_COLOR,
                fill: FILL_COLOR,
                ...diamondProps
            }
        )
        insertElement(canvas, polygon)
        updateAction('Diamond')
    }
    const addStar = (props: Omit<fabric.FabricObjectProps, 'points'> | void) => {
        function createStar({ cx, cy, outerRadius, innerRadius, numPoints = 5 }: {
            cx: number;
            cy: number;
            outerRadius: number;
            innerRadius: number;
            numPoints?: number;
        }) {
            const points: {
                x: number;
                y: number;
            }[] = [];
            // there are 10 points in a star
            // 5 inner and 5 outer
            // the angle step is 36 degrees (for inner points)
            // and 72 degrees for outer points
            // formular for getting a point in a circle are:
            //  x = cx + r * cos(angle)
            // y = cy + r * sin(angle)
            const angleStep = (Math.PI * 2) / (numPoints * 2);

            for (let i = 0; i < numPoints * 2; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const radius = i % 2 === 0 ? outerRadius : innerRadius;

                const x = cx + radius * Math.cos(angle);
                const y = cy + radius * Math.sin(angle);

                points.push({ x, y });
            }

            return new fabric.Polygon(points, {
                fill: FILL_COLOR,
                stroke: STROKE_COLOR,
                strokeWidth: 2
            });
        }
        const star = createStar({
            cx: 350,
            cy: 200,
            outerRadius: 100,
            innerRadius: 40,
            ...props
        })
        insertElement(canvas, star)
        updateAction('Star')
    }
    const addSoftRect = (rectProps?: fabric.RectProps) => {
        const softRect = new fabric.Rect({
            width: 100,
            height: 100,
            rx: 20,
            ry: 20,
            stroke: STROKE_COLOR,
            fill: FILL_COLOR,
            ...rectProps
        })
        insertElement(canvas, softRect)
        updateAction('SoftRect')
    }
    const enableDrawingMode = (props: {
        strokeColor?: string;
        strokeWidth?: number
    } | void) => {
        canvas.discardActiveObject()
        canvas.isDrawingMode = true
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
        canvas.freeDrawingBrush.color = props?.strokeColor ?? STROKE_COLOR
        canvas.freeDrawingBrush.width = props?.strokeWidth ?? 2
        canvas.renderAll()
        updateAction('Drawing')
    }
    const addText = (textConfig: TextConfig) => {
        const text = new fabric.Textbox(textConfig.value, {
            ...textConfig,
        })
        insertElement(canvas, text)
        updateAction('Text')
    }
    const addImage = async (url: string) => {
        const point = canvas.getCenterPoint();
        const image = await fabric.FabricImage.fromURL(url, {
            crossOrigin: 'anonymous',
        },
            {
                left: point.x,
                top: point.y,
                originX: 'center',
                originY: 'center'
            }
        )
        image.scaleToWidth(canvas.width * 0.5)
        image.scaleToHeight(canvas.height * 0.5)
        insertElement(canvas, image)

    }
    const addGridToCanvas = ({
        gridHorizontal = 12,
        gridVertical = 12,
        showGrid = true,
    }) => {
        if (!canvas) return;

        // Remove existing grid if toggling off
        if (!showGrid) {
            canvas.getObjects('line').forEach((obj) => {
                //@ts-ignore
                if (obj.id === 'grid-line') {
                    canvas.remove(obj);
                }
            });
            canvas.renderAll();
            return;
        }

        const canvasWidth = canvas.width || 1000;
        const canvasHeight = canvas.height || 800;

        // Create both the horizontal and vertical lines
        for (let i = 0; i < canvasWidth / gridHorizontal; i++) {
            const x = i * gridHorizontal;
            const verticalLine = new fabric.Line([x, 0, x, canvasHeight], {
                stroke: STROKE_COLOR,
                strokeWidth: STROKE_WIDTH,
                selectable: false,
                evented: false,
                id: 'grid-line',
            });
            canvas.add(verticalLine);
        }

        for (let j = 0; j < canvasHeight / gridVertical; j++) {
            const y = j * gridVertical;
            const horizontalLine = new fabric.Line([0, y, canvasWidth, y], {
                stroke: STROKE_COLOR,
                strokeWidth: STROKE_WIDTH,
                selectable: false,
                evented: false,
                id: 'grid-line',
            });
            canvas.add(horizontalLine);
        }

        canvas.renderAll();
    }
    //====== GETTERS ======
    function getWorkspace(canvas: fabric.Canvas) {
        //@ts-ignore
        return canvas.getObjects().find(obj => obj.name === WORKSPACE_NAME)
    };
    const getObjectsApartFromWorkspace = (canvas: fabric.Canvas) => {
        //@ts-ignore
        return canvas.getObjects().filter(obj => obj.name !== 'workspace')
    }
    const getAlignment = (object: fabric.Object) => {
        if (!object || !canvas) return 'none';
        const workspace = getWorkspace(canvas);
        if (!workspace) return 'none';
        const { left, top, width, height, scaleX, scaleY } = object;
        const objWidth = width * scaleX;
        const objHeight = height * scaleY;

        if (left === 0) return 'left';
        if (left === workspace.width - objWidth) return 'right';
        if (top === 0) return 'top';
        if (top === workspace.height - objHeight) return 'bottom';
        if (left === (workspace.width - objWidth) / 2 && top === (workspace.height - objHeight) / 2) return 'center';
        if (left === (workspace.width - objWidth) / 2) return 'centerH';
        if (top === (workspace.height - objHeight) / 2) return 'centerV';

        return 'none';
    }
    const formatLinearGradient = (fill: fabric.Gradient<'linear'>): EditorGradient => {
        const gradient = fill;
        const { x1, y1, x2, y2 } = gradient.coords;

        // Determine direction based on gradient coordinates
        let direction: EditorGradientDirection = 'to right';
        if (x1 === 0 && x2 === 0 && y1 === 0 && y2 === 1) direction = 'to bottom';
        else if (x1 === 0 && x2 === 1 && y1 === 0 && y2 === 0) direction = 'to right';
        else if (x1 === 1 && x2 === 0 && y1 === 0 && y2 === 0) direction = 'to left';
        else if (x1 === 0 && x2 === 0 && y1 === 1 && y2 === 0) direction = 'to top';
        else if (x1 === 0 && x2 === 1 && y1 === 0 && y2 === 1) direction = 'to bottom-right';
        else if (x1 === 1 && x2 === 0 && y1 === 0 && y2 === 1) direction = 'to bottom-left';
        else if (x1 === 0 && x2 === 1 && y1 === 1 && y2 === 0) direction = 'to top-right';
        else if (x1 === 1 && x2 === 0 && y1 === 1 && y2 === 0) direction = 'to top-left';

        // Extract color stops
        const colors = gradient.colorStops.map(stop => ({
            offset: stop.offset,
            color: stop.color
        }));

        return {
            type: 'linear',
            direction,
            colors
        };
    }
    const getBorderStyleFromDashArray = (strokeDashArray: number[] | null | undefined): BorderStyle => {
        const dashArrayMap: Record<string, Exclude<BorderStyle, 'custom'>> = {
            "[]": "solid",
            "[10,5]": "dashed",
            "[2,5]": "dotted",
            "[10,5,2,5]": "double",
            "[10,2,2,10]": "groove",
        };
        return dashArrayMap[JSON.stringify(strokeDashArray) as keyof typeof dashArrayMap] ?? "custom";
    }
    const isType = (object: fabric.Object, type: 'circle' | 'rectangle' | 'triangle' | 'image' | 'text') => {
        switch (type) {
            case 'circle':
                return object instanceof fabric.Circle;
            case 'rectangle':
                return object instanceof fabric.Rect;
            case 'triangle':
                return object instanceof fabric.Triangle;
            case 'image':
                return object instanceof fabric.FabricImage;
            case 'text':
                return object instanceof fabric.Textbox;
            default:
                return false;
        }
    }
    //====== EXPORTERS ======
    const exportAsPNG = () => {
        const dataURL = canvas?.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 2,
        });
        if (!dataURL) return;
        createLink(dataURL, `${filename}-${new Date().getTime()}.png`);
    }
    const exportAsJSON = () => {
        const data = JSON.stringify(canvas?.toDatalessJSON());
        createLink(`data:text/json;charset=utf-8,${encodeURIComponent(data)}`,
            `${filename}-${new Date().getTime()}.json`);
    }
    const exportAsSVG = () => {
        const data = canvas?.toSVG();
        if (!data) return;
        createLink(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(data)}`,
            `${filename}-${new Date().getTime()}.svg`);
    }
    const previewCanvas = () => {
        const dataURL = canvas?.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 2,
        });
        return dataURL
    }
    //===== SETTERS ======
    const setWorkspaceColor = (color: string) => {
        const workspace = getWorkspace(canvas);
        if (!workspace) return;
        workspace.set('fill', color);
        canvas.requestRenderAll();
    }
    const setZoomLevel = (
        {
            direction,
            value
        }: {
            direction?: ZoomDirection,
            value?: ZoomValue
        }
    ) => {
        if (!canvas) return;

        let zoom = canvas.getZoom();
        const workspace = getWorkspace(canvas);

        if (!workspace) return;
        // Direction takes precedence over value
        if (direction) {
            zoom = direction === '+' ? zoom * 1.5 : zoom * 0.5;
        } else if (value) {
            switch (value) {
                case '50%':
                    zoom = 0.5;
                    break;
                case '100%':
                    zoom = 1;
                    break;
                case '200%':
                    zoom = 2;
                    break;
                case 'fit':
                    const canvasWidth = canvas.getWidth();
                    const canvasHeight = canvas.getHeight();
                    zoom = fabric.util.findScaleToFit({
                        width: workspace.width,
                        height: workspace.height
                    }, {
                        width: canvasWidth,
                        height: canvasHeight
                    }) * 0.7
                    break;
            }
        }
        // Ensure zoom stays within limits
        zoom = Math.max(0.1, Math.min(5, zoom));

        // Zoom to the center of the workspace
        const center = workspace.getCenterPoint();
        setZoom?.(zoom);
        canvas.zoomToPoint(center, zoom);

        canvas.requestRenderAll();
    }
    const setWorkSpaceSize = (width: number, height: number) => {
        const workspace = getWorkspace(canvas);
        if (!workspace) return;
        workspace.set('width', width || workspace.width);
        workspace.set('height', height || workspace.height);
        setZoomLevel({ value: 'fit' });
        canvas.requestRenderAll();
    }
    const sendToBack = () => {
        const activeObjects = canvas.getActiveObjects()
        activeObjects.forEach(object => {
            canvas.sendObjectBackwards(object)
        })
        // ensure that the canvas is always the furthest back
        const workspace = getWorkspace(canvas)
        canvas?.sendObjectToBack(workspace as fabric.Object)
        canvas.renderAll()
    }
    const bringToFront = () => {
        const activeObjects = canvas.getActiveObjects()
        const workspace = getWorkspace(canvas)
        activeObjects.forEach(object => {
            canvas.bringObjectForward(object)
        })
        canvas.sendObjectToBack(workspace as fabric.Object)
        canvas.renderAll()
    }
    const clearActiveObjects = () => {
        const activeObjects = canvas.getActiveObjects()
        activeObjects.forEach(object => {
            canvas.remove(object)
        })
        canvas.discardActiveObject()
    }
    const zoomChange = (direction: ZoomDirection) => {
        let zoom = canvas.getZoom();
        zoom *= direction === '+' ? 1.5 : 0.5;
        zoom = Math.max(0.1, Math.min(5, zoom));
        // if there is an active object, zoom to its center, otherwise zoom to the center of the canvas
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            const objCenter = activeObject.getCenterPoint();
            canvas.zoomToPoint(objCenter, zoom);
        }
        else {
            canvas.zoomToPoint(new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2), zoom);
        }
        setZoom?.(zoom);
        canvas.requestRenderAll();
    }
    const groupActiveObjects = () => {
        const objects = canvas.getActiveObjects()
        if (objects.length === 0) return
        const group = new fabric.Group(objects)
        canvas.discardActiveObject()
        canvas.add(group)
        canvas.requestRenderAll()
    }
    const ungroupActiveObjects = () => {
        const group = canvas.getActiveObject()
        if (!group || group.type !== 'group') return
        //type safe check for is group
        if (!(group instanceof fabric.Group)) return
        canvas.remove(group);
        // remove all groups from active selection
        const sel = new fabric.ActiveSelection(
            group.removeAll(),
            {
                canvas: canvas,
            }
        )
        canvas.setActiveObject(sel)
        canvas.requestRenderAll()
    }
    const duplicateActiveObjects = async () => {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length === 0) return;
        // Clear our current selection
        canvas.discardActiveObject();
        // Iterate through all active objects and clone them
        const clonedObjects = await Promise.all(
            activeObjects.map(async (object) => {
                const cloned = await object.clone();
                cloned.set({
                    left: (cloned.left || 0) + 20,
                    top: (cloned.top || 0) + 20,
                });
                return cloned;
            })
        );
        clonedObjects.forEach((cloned) => canvas.add(cloned));
        canvas.requestRenderAll();
    };

    const disableDrawingMode = () => {
        canvas.isDrawingMode = false
    }
    const selectAllObjects = () => {
        // select all objects apart from the workspace
        const objects = getObjectsApartFromWorkspace(canvas)
        canvas.setActiveObject(new fabric.ActiveSelection(objects, {
            canvas,
        }))
        canvas.requestRenderAll()
    }
    const applyLinearGradient = (fill: EditorGradient): fabric.Gradient<'linear'> => {
        const { direction, colors } = fill;
        const coordsMap: Record<EditorGradientDirection, fabric.GradientCoords<'linear'>> = {
            'to right': { x1: 0, y1: 0, x2: 1, y2: 0 },
            'to left': { x1: 1, y1: 0, x2: 0, y2: 0 },
            'to top': { x1: 0, y1: 1, x2: 0, y2: 0 },
            'to bottom': { x1: 0, y1: 0, x2: 0, y2: 1 },
            'to top-right': { x1: 0, y1: 1, x2: 1, y2: 0 },
            'to top-left': { x1: 1, y1: 1, x2: 0, y2: 0 },
            'to bottom-right': { x1: 0, y1: 0, x2: 1, y2: 1 },
            'to bottom-left': { x1: 1, y1: 0, x2: 0, y2: 1 }
        };
        return new fabric.Gradient({
            type: 'linear',
            gradientUnits: 'percentage',
            coords: coordsMap[direction],
            colorStops: colors.map(({ offset, color }) => ({ offset, color }))
        });
    }
    const updateImageFilter = (selectedObject: SelectedObject, value: FabricFilterType) => {
        // Todo: add support for multiple filters
        if (!selectedObject) return;
        const filterEffect = createFilter(value);
        const imageObject = selectedObject.object instanceof fabric.FabricImage
            ? selectedObject.object : null;
        if (!imageObject) return;
        imageObject.filters = filterEffect ? [filterEffect] : [];
        imageObject.applyFilters();
    }
    const alignObject = (
        object: fabric.Object,
        alignment: Alignment,
    ) => {
        if (!object || !canvas) return;
        const workspace = getWorkspace(canvas);
        if (!workspace) return;
        switch (alignment) {
            case 'left':
                object.set({ left: 0 });
                break;
            case 'right':
                object.set({ left: workspace.width - object.width * object.scaleX });
                break;
            case 'top':
                object.set({ top: 0 });
                break;
            case 'bottom':
                object.set({ top: workspace.height - object.height * object.scaleY });
                break;
            case 'centerH':
                object.set({ left: (workspace.width - object.width * object.scaleX) / 2 });
                break;
            case 'centerV':
                object.set({ top: (workspace.height - object.height * object.scaleY) / 2 });
                break;
            case 'center':
                object.set({
                    left: (workspace.width - object.width * object.scaleX) / 2,
                    top: (workspace.height - object.height * object.scaleY) / 2,
                });
                break;
            case 'none':
                const { top, left } = randomPosition({
                    height: workspace.height,
                    width: workspace.width,
                })
                object.set({ top, left });
                break;
            default:
                break;
        }

        object.setCoords();
    }
    const setBorderStyle = (object: fabric.Object, selectedObject: SelectedObject, newStyle: Exclude<BorderStyle, 'custom'>) => {
        const borderStyleMap: Record<Exclude<BorderStyle, 'custom'>, number[]> = {
            solid: [],
            dashed: [10, 5],
            dotted: [2, 5],
            double: [10, 5, 2, 5],
            groove: [10, 2, 2, 10],
        };

        selectedObject.borderStyle = newStyle;
        object.strokeDashArray = borderStyleMap[newStyle] ?? [];
    }
    return {
        /**
         * Adds a circle to the canvas.
         * @example 
         * // without any arguments
         * const {editor} = useEditor();
         * editor?.addCircle();
         * // with arguments
         * editor?.addCircle({radius: 50, stroke: 'red', fill: 'blue'});
         */
        addCircle,

        /**
         * Adds a rectangle to the canvas.
         * @example
         * const {editor} = useEditor();
         * // without any arguments
         * editor?.addRectangle()
         * // with arguments
         * editor?.addRectangle({strokeWidth: 2, fill: 'pink' })
         */
        addRectangle,

        /**
         * Adds a triangle to the canvas.
         * @example
         * const {editor} = useEditor();
         * // without any arguments
         * editor?.addTriangle();
         * // with arguments
         * editor?.addTriangle({stroke: 'red', fill: 'blue'});
         */
        addTriangle,

        /**
         * Adds a diamond shape to the canvas.
         * @example
         * const {editor} = useEditor();
         * // without any arguments
         * editor?.addDiamond();
         * // with arguments
         * editor?.addDiamond({stroke: 'red', fill: 'blue'});
         */
        addDiamond,

        /**
         * Adds a star shape to the canvas.
         * @example
         * const {editor} = useEditor();
         * // without any arguments
         * editor?.addStar();
         * // with arguments
         * editor?.addStar({stroke: 'red', fill: 'blue'});
         */
        addStar,

        /**
         * Adds a soft rectangle (rounded corners) to the canvas.
         * @example
         * const {editor} = useEditor();
         * // without any arguments
         * editor?.addSoftRect();
         * // with arguments
         * editor?.addSoftRect({stroke: 'red', fill: 'blue'});
         */
        addSoftRect,

        /**
         * Enables drawing mode on the canvas.
         * @example
         * const {editor} = useEditor();
         * editor?.enableDrawingMode();
         */
        enableDrawingMode,

        /**
         * Clears all selected objects from the canvas.
         * @example
         * const {editor} = useEditor();
         * editor?.clearActiveObjects();
         */
        clearActiveObjects,

        /**
         * Adds a text object to the canvas.
         * @param {string} text - The text content.
         * @example
         * const {editor} = useEditor();
         *  editor?.addText({
         *      value: 'Hello World!',
         *      fontSize: 20,
         * });
         */
        addText,

        /**
         * Adds an image to the canvas.
         * @param {string} url - The image URL.
         * @example
         * const {editor} = useEditor();
         * editor?.addImage("https://example.com/image.png");
         */
        addImage,

        /**
         * Exports the canvas as a PNG file. which is automatically downloaded
         * @example
         * const {editor} = useEditor();
         * editor?.exportAsPNG();
         */
        exportAsPNG,

        /**
         * Exports the canvas as a JSON object. which is automatically downloaded
         * @example
         * const {editor} = useEditor();
         * editor?.exportAsJSON();
         */
        exportAsJSON,

        /**
         * Exports the canvas as an SVG string. which is automatically downloaded
         * @example
         * const svg = canvasHelpers.exportAsSVG();
         */
        exportAsSVG,

        /**
         * Retrieves the workspace object.
         * @returns {fabric.Object} The workspace object.
         * @example
         * const {editor} = useEditor();
         * const workspace = editor?.getWorkspace();
         */
        getWorkspace,

        /**
         * Sets the workspace background color.
         * @param {string} color - The background color in hex or rgba format.
         * @example
         * const {editor} = useEditor();
         * editor?.setWorkspaceColor("#ff0000");
         */
        setWorkspaceColor,

        /**
         * Sets the workspace size.
         * @param {number} width - The width of the workspace.
         * @param {number} height - The height of the workspace.
         * @example
         * const {editor} = useEditor();
         * editor?.setWorkSpaceSize(800, 600);
         */
        setWorkSpaceSize,

        /**
         * Sends the selected object to the back layer.
         * @example
         * const {editor} = useEditor();
         * editor?.sendToBack();
         */
        sendToBack,

        /**
         * Brings the selected object to the front layer.
         * @example
         * const {editor} = useEditor();
         * editor?.bringToFront();
         */
        bringToFront,

        /**
         * Disables drawing mode on the canvas.
         * @example
         * const {editor} = useEditor();
         * editor?.disableDrawingMode();
         */
        disableDrawingMode,

        /**
         * Groups selected objects into a single group.
         * @example
         * const {editor} = useEditor();
         * editor?.groupActiveObjects();
         */
        groupActiveObjects,

        /**
         * Ungroups a selected group back into separate objects.
         * @example
         * const {editor} = useEditor();
         * editor?.ungroupActiveObjects();
         */
        ungroupActiveObjects,

        /**
         * Duplicates the currently selected objects.
         * @example
         * const {editor} = useEditor();
         * editor?.duplicateActiveObjects();
         */
        duplicateActiveObjects,

        /**
         * Selects all objects on the canvas.
         * @example
         * const {editor} = useEditor();
         * editor?.selectAllObjects();
         */
        selectAllObjects,

        /**
         * Zooms the canvas in or out.
         * @param {ZoomDirection} direction - The zoom direction(either + or -).
         * @example
         * const {editor} = useEditor();
         * editor?.zoomChange('+');
         */
        zoomChange,

        /**
         * Sets the zoom level of the canvas.
         * @param {'+' | '-' | undefined} direction - Zoom direction (increase, decrease, or undefined).
         * @param {'50%' | '100%' | '200%' | 'fit'} value - Zoom level.
         * @example
         * const {editor} = useEditor();
         * editor?.setZoomLevel({
         *          value: 'fit'
         *     }); // Fit workspace to screen
         * editor?.setZoomLevel({
         *          direction: '+'
         *    }); // Zoom in by 50%
         */
        setZoomLevel,
        /**
         * @description a function that can be used to preview the canvas
         * @example
         * const {editor} = useEditor();
         * const preview = editor?.previewCanvas();
         * return <img src={preview} alt="preview" />
         */
        previewCanvas,
        /**
         * @description a function that can be used to add a grid to the canvas
         * @example
         * const {editor} = useEditor();
         * editor?.addGridToCanvas({gridHorizontal: 12, gridVertical: 12, showGrid: true})
         */
        addGridToCanvas,
        /**
         * @description a function that can be used to get the alignment of an object
         * @example
         * const {editor} = useEditor();
         * const alignment = editor?.getAlignment(object) // returns 'left' | 'right' | 'top' | 'bottom' | 'center' | 'centerH' | 'centerV' | 'none'
         */
        getAlignment,
        /**
         * @description a function that can be used to format a fabric js linear gradient to a simplified format for easy css conversion
         * @example 
         * const {editor} = useEditor();
         * const fill = editor?.formatLinearGradient(new fabric.Gradient({
         *      type: 'linear',
         *      coords: { x1: 0, y1: 0, x2: 1, y2: 0 },
         *      colorStops: 
         *             [
         *               { offset: 0, color: 'red' },
         *                { offset: 1, color: 'blue' },
         *             ],
         * }));
         */
        formatLinearGradient,
        /**
         * @description a function that can be used to apply a linear gradient to an object
         * @example
         * const {editor} = useEditor();
         * const fill = editor?.applyLinearGradient({
         *     type: 'linear',
         *     direction: 'to right',
         *     colors:  
         *          [
         *          { offset: 0, color: 'red' },
         *          { offset: 1, color: 'blue' },
         *        ],
         * });
         */
        applyLinearGradient,
        /**
         * @description a function that can be used to update the image filter of a selected object
         * @example
         * const {editor} = useEditor();
         * editor?.updateImageFilter(selectedObjects, 'grayscale');
         * @private used internally in the useSelection hook
         */
        updateImageFilter,
        /**
         * @description a function that can be used to align an object to a specified alignment
         * @example
         * const {editor} = useEditor();
         * editor?.alignObject(object, 'left');
         * @private used internally in the useSelection hook
         */
        alignObject,
        /**  
         * @description a function that can be used to set the border style of an object
         * @example
         * const {editor} = useEditor();
         * editor?.setBorderStyle(object, selectedObject, 'dashed');
         * @private used internally in the useSelection hook
        */
        setBorderStyle,
        /**
         * @description a function that can be used to get the border style of an object
         * @example
         * const {editor} = useEditor();
         * const borderStyle = editor?.getBorderStyleFromDashArray([10, 5]); // returns 'dashed'
         * @private used internally in the useSelection hook
         */
        getBorderStyleFromDashArray,
        /**
         * @description a function that can be used to check if an object is of a certain type
         * @example
         * const {editor} = useEditor();
         * const isCircle = editor?.isType(object, 'circle'); // returns true or false
         */
        isType,
        //enableLineDrawingMode,
    };
}