import React from "react";
import * as fabric from "fabric";
import { Alignment, BorderStyle, EditorGradient, FabricFilterType, SelectedObject, SelectedObjectProps, UseSelectionProps } from "../types";
//!Todo: handle multiple selections from select all
/**
 * 
 * @param canvas the fabric canvas instance
 * @description a hook that helps to manage the selection of objects on the canvas
 * @example const {selectedObjects, onObjectsSelection, updateObjectProperty, onObjectsDeselection} = useSelection(canvas)
 * @returns 
 */
export function useSelection({ canvas,
    getAlignment,
    formatLinearGradient,
    applyLinearGradient,
    updateImageFilter,
    alignObject,
    getBorderStyleFromDashArray,
    setBorderStyle
}: UseSelectionProps) {
    const [selectedObjects, setSelectedObjects] = React.useState<SelectedObject[] | null>(null);
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
                align: getAlignment?.(target, canvas as fabric.Canvas) ?? 'none',
                borderStyle: getBorderStyleFromDashArray?.(target.strokeDashArray) ?? 'solid',
            };

            if (typeof target.fill === 'string') {
                selection.fill = target.fill;
            }
            else if (target.fill instanceof fabric.Gradient && target.fill.type === 'linear') {
                selection.fill = formatLinearGradient?.(target.fill) ?? selection.fill;
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

    const updateSelectedObjectProperty = React.useCallback(<K extends SelectedObjectProps>(property: K, value: SelectedObject[K]) => {
        if (!selectedObjects || !canvas) return;

        selectedObjects.forEach((selectedObject) => {
            const { object } = selectedObject;
            if (property === 'x') {
                object.setX(value as number);
            } else if (property === 'y') {
                object.setY(value as number);
            } else if (property === 'filter') {
                updateImageFilter?.(selectedObject, value as FabricFilterType);
            } else if (property === 'align') {
                alignObject?.(object, value as Alignment);
            }
            else if (property === 'borderStyle') {
                setBorderStyle?.(object, selectedObject, value as Exclude<BorderStyle, "custom">);
            }
            else if (
                property === 'fill'
                &&
                object.fill instanceof fabric.Gradient
                && object.fill.type === 'linear'
            ) {
                object.set('fill', applyLinearGradient?.(value as EditorGradient));
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
     * @example updateSelectedObjectProperty('x', 100)
        */
        updateSelectedObjectProperty,
        onObjectsDeselection
    };
}
