import React from "react";
import * as fabric from "fabric";
import { Alignment, EditorGradient, EditorGradientDirection, FabricFilterType, SelectedObject, SelectedObjectProps } from "../types";
import { createFilter } from "../helpers/createFilter";
//!Todo: handle multiple selections from select all
/**
 * 
 * @param canvas the fabric canvas instance
 * @description a hook that helps to manage the selection of objects on the canvas
 * @example const {selectedObjects, onObjectsSelection, updateObjectProperty, onObjectsDeselection} = useSelection(canvas)
 * @returns 
 */
export function useSelection(canvas: fabric.Canvas | null) {
    const [selectedObjects, setSelectedObjects] = React.useState<SelectedObject[] | null>(null);
    const getAlignment = React.useCallback((object: fabric.Object, canvas: fabric.Canvas) => {
        if (!object || !canvas) return 'none';

        const { left, top, width, height, scaleX, scaleY } = object;
        const objWidth = width * scaleX;
        const objHeight = height * scaleY;

        if (left === 0) return 'left';
        if (left === canvas.width - objWidth) return 'right';
        if (top === 0) return 'top';
        if (top === canvas.height - objHeight) return 'bottom';
        if (left === (canvas.width - objWidth) / 2 && top === (canvas.height - objHeight) / 2) return 'center';
        if (left === (canvas.width - objWidth) / 2) return 'centerH';
        if (top === (canvas.height - objHeight) / 2) return 'centerV';

        return 'none';
    }, [])
    const formatLinearGradient = React.useCallback((fill: fabric.Gradient<'linear'>): EditorGradient => {
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
    }, [])
    const applyLinearGradient = React.useCallback((fill: EditorGradient): fabric.Gradient<'linear'> => {
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
    }, [])
    const onObjectsSelection = React.useCallback((targets: fabric.Object[]) => {
        if (!targets || targets.length === 0) return;

        const newSelections = targets.map(target => {
            const selection: SelectedObject = {
                object: target,
                fill: '',
                angle: target.angle,
                x: target.left,
                y: target.top,
                cornerSize: target.cornerSize,
                opacity: target.opacity,
                'shadow.color': target.shadow?.color ?? '#000',
                'shadow.blur': target.shadow?.blur ?? 0,
                'shadow.offsetX': target.shadow?.offsetX ?? 0,
                'shadow.offsetY': target.shadow?.offsetY ?? 0,
                strokeColor: target.stroke as string,
                strokeWidth: target.strokeWidth,
                skewX: target.skewX,
                skewY: target.skewY,
                scaleX: target.scaleX,
                scaleY: target.scaleY,
                align: getAlignment(target, canvas as fabric.Canvas),
            };
            if (typeof target.fill === 'string') {
                selection.fill = target.fill;
            }
            else if (target.fill instanceof fabric.Gradient && target.fill.type === 'linear') {
                selection.fill = formatLinearGradient(target.fill);
            }
            if (!(target instanceof fabric.Circle)) {
                selection.width = target.width * target.scaleX;
                selection.height = target.height * target.scaleY;
            } else if (target instanceof fabric.Circle) {
                selection.diameter = Math.round(target.radius * 2 * target.scaleX);
            }

            if (target instanceof fabric.FabricImage) {
                //@ts-expect-error: the filter prop exists but the types are not included
                selection.filter = target.filters[0]?.type;
            }

            if (target instanceof fabric.Textbox) {
                selection.fontFamily = target.fontFamily;
                selection.fontWeight = target.fontWeight;
                selection.fontSize = target.fontSize;
                //@ts-expect-error: the fontStyle prop exists but the types are not included
                selection.fontStyle = target.fontStyle;
                //@ts-expect-error: the textDecoration prop exists but the types are not included
                selection.textDecoration = target.textDecoration;
                //@ts-expect-error: the textAlign prop exists but the types are not included
                selection.textAlign = target.textAlign;
                //@ts-expect-error: the letterSpacing prop exists but the types are not included
                selection.letterSpacing = target.letterSpacing;
                selection.lineHeight = target.lineHeight;
                //@ts-expect-error: the text transform prop exists but the types are not included
                selection.textTransform = target.textTransform;
                //@ts-expect-error: the underline prop exists but the types are not included
                selection.underline = target.underline;
                //@ts-expect-error: the lineThrough prop exists but the types are not included
                selection.textDecoration = target.underline ? 'underline' : target.lineThrough ? 'line-through' : 'none';
            }

            return selection;
        });

        setSelectedObjects(newSelections);
    }, []);
    /**
     * @description helps to update an image object filter
     * @description 
     * @param value the filter to apply to the image
     * @example updateImageFilter('grayscale')
     * @private
    */
    const updateImageFilter = React.useCallback((value: FabricFilterType) => {
        if (!selectedObjects) return;
        const filterEffect = createFilter(value);
        const imageObject = selectedObjects.find(
            (selectedObject) => selectedObject.object.type === 'image'
        )?.object as fabric.Image;
        if (!imageObject) return;
        imageObject.filters = filterEffect ? [filterEffect] : [];
        imageObject.applyFilters();
    }, [
        selectedObjects,
        canvas
    ]);
    const alignObject = (
        object: fabric.Object,
        alignment: Alignment,
        canvas: fabric.Canvas) => {
        if (!object || !canvas) return;

        switch (alignment) {
            case 'left':
                object.set({ left: 0 });
                break;
            case 'right':
                object.set({ left: canvas.width - object.width * object.scaleX });
                break;
            case 'top':
                object.set({ top: 0 });
                break;
            case 'bottom':
                object.set({ top: canvas.height - object.height * object.scaleY });
                break;
            case 'centerH':
                object.set({ left: (canvas.width - object.width * object.scaleX) / 2 });
                break;
            case 'centerV':
                object.set({ top: (canvas.height - object.height * object.scaleY) / 2 });
                break;
            case 'center':
                object.set({
                    left: (canvas.width - object.width * object.scaleX) / 2,
                    top: (canvas.height - object.height * object.scaleY) / 2,
                });
                break;
        }

        object.setCoords();
    }

    const updateObjectProperty = React.useCallback(<K extends SelectedObjectProps>(property: K, value: SelectedObject[K]) => {
        if (!selectedObjects || !canvas) return;

        selectedObjects.forEach((selectedObject) => {
            const { object } = selectedObject;
            if (property === 'x') {
                object.setX(value as number);
            } else if (property === 'y') {
                object.setY(value as number);
            } else if (property === 'filter') {
                updateImageFilter(value as FabricFilterType);
            } else if (property === 'align') {
                alignObject(object, value as Alignment, canvas);
            }
            else if (
                property === 'fill'
                &&
                object.fill instanceof fabric.Gradient
                && object.fill.type === 'linear'
            ) {
                object.set('fill', applyLinearGradient(value as EditorGradient));
            }
            else if (property.startsWith('shadow.')) {
                const shadow = new fabric.Shadow({
                    color: property === 'shadow.color' ? (value as string) : selectedObject['shadow.color'],
                    blur: property === 'shadow.blur' ? (value as number) : selectedObject['shadow.blur'],
                    offsetX: property === 'shadow.offsetX' ? (value as number) : selectedObject['shadow.offsetX'],
                    offsetY: property === 'shadow.offsetY' ? (value as number) : selectedObject['shadow.offsetY'],
                });
                object.set({ shadow });
            }
            else {
                object.set(property, value);
            }

            canvas.renderAll();
        });

        canvas.renderAll();
        setSelectedObjects((prev) => {
            if (!prev) return prev;
            return prev.map((selectedObject) => ({
                ...selectedObject,
                [property]: value,
            }));
        }
        );
    }, [selectedObjects, canvas]);
    /**
     * @description a callback that is run when an object is deselected
     * @description this method should be used internally by the editor
     * @description it runs on selection:cleared events
     * @example onObjectDeselection()
     * @private
     * */
    const onObjectsDeselection = React.useCallback(() => {
        setSelectedObjects(null);
    }, []);
    return {
        selectedObjects,
        /**
     * @description a callback that is run when an object is selected
     * @description this method should be used internally by the editor
     * @description it runs on selection:created events
     * @param target the object to select
     * @example onObjectsSelection(canvas.getActiveObject())
     * @private
     */
        onObjectsSelection,
        /**
     * @description helps to update the selected object properties
     * @param property the property to update
     * @param value the value to update the property with
     * @example updateObjectProperty('x', 100)
        */
        updateObjectProperty,
        onObjectsDeselection
    };
}
