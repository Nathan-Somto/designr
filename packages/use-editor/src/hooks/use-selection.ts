import React from "react";
import * as fabric from "fabric";
import { Alignment, BorderStyle, EditorGradient, FabricFilterType, SelectedObject, SelectedObjectProps, UseSelectionProps } from "../types";
import { isCapitalized, isLowercase, isUppercase, toCapitalize } from "../helpers/textTransformHelpers";
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
                'shadow.color': target.shadow?.color,
                'shadow.blur': target.shadow?.blur,
                'shadow.offsetX': target.shadow?.offsetX,
                'shadow.offsetY': target.shadow?.offsetY,
                strokeColor: target.stroke as string,
                strokeWidth: target.strokeWidth,
                skewX: target.skewX,
                skewY: target.skewY,
                scaleX: target.scaleX,
                scaleY: target.scaleY,
                align: getAlignment?.(target, canvas as fabric.Canvas) ?? 'none',
                borderStyle: getBorderStyleFromDashArray?.(target.strokeDashArray) ?? 'solid',
                filter: 'none',
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
                selection.filter = target.filters[0]?.type as FabricFilterType;
            }
            if (target instanceof fabric.Textbox) {
                selection.fontFamily = target.fontFamily;
                selection.fontWeight = target.fontWeight;
                selection.fontSize = target.fontSize;
                selection.fontStyle = target.fontStyle as SelectedObject['fontStyle'];
                selection.textAlign = target.textAlign as SelectedObject['textAlign'];
                selection.letterSpacing = target.charSpacing;
                selection.lineHeight = target.lineHeight;
                //Todo: create helpers to determine type of text textTransform
                const textValue = target.text
                selection.textTransform = isCapitalized(textValue) ? 'capitalize' : isUppercase(textValue) ? 'uppercase' : isLowercase(textValue) ? 'lowercase' : 'none';
                selection.textDecoration = target.underline ? 'underline' : target.linethrough ? 'line-through' : 'none';
            }

            return selection;
        });

        setSelectedObjects(newSelections);
    }, [getAlignment, selectedObjects]);

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
            else if (property === 'textTransform' && selectedObject.object instanceof fabric.Textbox) {
                const textValue = selectedObject.object.text
                object.set('text', value === 'capitalize' ? toCapitalize(textValue) : value === 'uppercase' ? textValue.toUpperCase() : value === 'lowercase' ? textValue.toLowerCase() : textValue)
            }
            else if (property === 'borderStyle') {
                setBorderStyle?.(selectedObject, value as Exclude<BorderStyle, "custom">);
            }
            else if (property === 'strokeColor') {
                object.set('stroke', value)
            }
            else if (
                property === 'fill'
                && typeof value === 'object'
            ) {
                object.set('fill', applyLinearGradient?.(value as EditorGradient<'linear'>));
            }
            else if (property === 'textDecoration') {
                object.set('underline', value === 'underline')
                object.set('linethrough', value === 'line-through')
            }
            else if (property.startsWith('shadow.')) {
                const shadow = new fabric.Shadow({
                    color: property === 'shadow.color' ? (value as string) : selectedObject['shadow.color'],
                    blur: property === 'shadow.blur' ? (value as number) : selectedObject['shadow.blur'],
                    offsetX: property === 'shadow.offsetX' ? (value as number) : selectedObject['shadow.offsetX'],
                    offsetY: property === 'shadow.offsetY' ? (value as number) : selectedObject['shadow.offsetY'],
                });
                object.set('shadow', shadow);
            }
            else {
                object.set(property, value);
            }
        });

        setSelectedObjects((prev) => {
            if (!prev) return prev;
            return prev.map((selectedObject) => ({
                ...selectedObject,
                [property]: value,
            }));
        }
        );
        canvas.renderAll();
    }, [selectedObjects, canvas, applyLinearGradient]);
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
