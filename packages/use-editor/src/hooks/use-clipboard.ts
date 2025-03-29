import { useRef, useCallback } from "react";
import * as fabric from "fabric";
import { JSON_KEYS } from "../defaults";
/**
 * 
 * @param canvas the fabric canvas instance
 * @description a hook that helps to manage the clipboard actions
 * @example const {copy, paste} = useClipboard(canvas)
 * @returns 
 */
export const useClipboard = (canvas: fabric.Canvas | null) => {
    const copiedObjectRef = useRef<fabric.Object | null>(null);

    const copy = useCallback(async () => {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (!activeObject) return;

        const cloned = await activeObject.clone(JSON_KEYS);
        copiedObjectRef.current = cloned;
        canvas.discardActiveObject();
        canvas.requestRenderAll();
    }, [canvas]);

    const paste = useCallback(async () => {
        if (!canvas || !copiedObjectRef.current) return;
        const cloned = await copiedObjectRef.current.clone(JSON_KEYS);
        if (!cloned) return;
        if (
            cloned.type === "activeSelection"
            &&
            cloned instanceof fabric.ActiveSelection
        ) {
            cloned.canvas = canvas;
            cloned.forEachObject((obj) => {
                canvas.add(obj);
            });
            cloned.setCoords();
        } else {
            canvas.add(cloned);
        }
        // we offset the position of the pasted object
        cloned.set({
            left: (cloned.left || 0) + 20,
            top: (cloned.top || 0) + 20,
        });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.requestRenderAll();
    }, [canvas]);

    return {
        /**
         * @description copies the active object on the canvas
         * @returns void
         * @example 
         * const {editor} = useEditor()
         * editor?.copy()
         */
        copy,
        /**
         * @description pastes the copied object on the canvas
         * @returns void
         * @example 
         * const {editor} = useEditor()
         * editor?.paste()
         */
        paste
    };
};
