import React from "react";
import * as fabric from "fabric";
import { FabricFilterType, SelectedObject, SelectedObjectProps } from "../types";
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

    const onObjectsSelection = React.useCallback((targets: fabric.Object[]) => {
        if (!targets || targets.length === 0) return;

        const newSelections = targets.map(target => {
            const selection: SelectedObject = {
                object: target,
                fill: target.fill as string,
                angle: target.angle,
                x: target.left,
                y: target.top,
                cornerSize: target.cornerSize,
                opacity: target.opacity,
                'shadow.color': target.shadow?.color ?? '#000',
                'shadow.blur': target.shadow?.blur ?? 0,
                'shadow.offsetX': target.shadow?.offsetX ?? 0,
                'shadow.offsetY': target.shadow?.offsetY ?? 0,
            };

            if (target.type !== 'circle') {
                selection.width = target.width * target.scaleX;
                selection.height = target.height * target.scaleY;
            } else if (target.type === 'circle') {
                //@ts-expect-error: the radius prop exists but the types are not included
                selection.diameter = Math.round(target.radius * 2 * target.scaleX);
            }

            if (target.type === 'image') {
                //@ts-expect-error: the filter prop exists but the types are not included
                selection.filter = target.filters[0]?.type;
            }

            if (target.type === 'textbox') {
                //@ts-expect-error: the text prop exists but the types are not included
                selection.fontFamily = target.fontFamily;
                //@ts-expect-error: the fontSize prop exists but the types are not included
                selection.fontWeight = target.fontWeight;
                //@ts-expect-error: the fontSize prop exists but the types are not included
                selection.fontSize = target.fontSize;
                //@ts-expect-error: the fontStyle prop exists but the types are not included
                selection.fontStyle = target.fontStyle;
                //@ts-expect-error: the textDecoration prop exists but the types are not included
                selection.textDecoration = target.textDecoration;
                //@ts-expect-error: the textAlign prop exists but the types are not included
                selection.textAlign = target.textAlign;
                //@ts-expect-error: the letterSpacing prop exists but the types are not included
                selection.letterSpacing = target.letterSpacing;
                //@ts-expect-error: the lineHeight prop exists but the types are not included
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
            } else {
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
