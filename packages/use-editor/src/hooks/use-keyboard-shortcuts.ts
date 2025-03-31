import React from "react";
import { UseKeyboardShortcutsProps } from "../types";
/**
 * 
 * @param canvas the fabric canvas instance
 * @description this hook helps to add keyboard shortcuts to the canvas
 * @example useKeyboardShortcuts({canvas, bringToFront, clearActiveObjects, duplicateActiveObject, sendToBack, groupActiveObjects, selectAllObjects, ungroupActiveObject, redo, undo, copy, paste, zoomChange})
 */
export function useKeyboardShortcuts({
    canvas,
    bringToFront,
    clearActiveObjects,
    duplicateActiveObject,
    sendToBack,
    groupActiveObjects,
    selectAllObjects,
    ungroupActiveObject,
    redo,
    undo,
    copy,
    paste,
    zoomChange
}: UseKeyboardShortcutsProps) {
    React.useEffect(() => {
        if (!canvas) return
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

            const isCtrl = event.ctrlKey || event.metaKey;

            if (isCtrl && (event.key === '+' || event.key === '=')) {
                zoomChange?.('+');
                event.preventDefault();
            }
            if (isCtrl && event.key === '-') {
                zoomChange?.('-');
                event.preventDefault();
            }
            if (isCtrl && event.key === "c") {
                copy?.();
                event.preventDefault();
            }
            if (isCtrl && event.key === "v") {
                paste?.();
                event.preventDefault();
            }
            if (event.key === "Delete" || event.key === "Backspace") {
                clearActiveObjects?.();
                event.preventDefault();
            }
            if (isCtrl && event.key === "z") {
                undo?.();
                event.preventDefault();
            }
            if (isCtrl && event.key === "y") {
                redo?.();
                event.preventDefault();
            }
            if (isCtrl && event.key === "g") {
                groupActiveObjects?.();
                event.preventDefault();
            }
            if (isCtrl && event.key === "u") {
                ungroupActiveObject?.();
                event.preventDefault();
            }
            if (isCtrl && event.key === "d") {
                duplicateActiveObject?.();
                event.preventDefault();
            }
            if (isCtrl && event.key === "b") {
                sendToBack?.();
                event.preventDefault();
            }
            if (isCtrl && event.key === "f") {
                bringToFront?.();
                event.preventDefault();
            }
            if (isCtrl && event.key === "a") {
                selectAllObjects?.();
                event.preventDefault();
            }
        };

        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [canvas, bringToFront, clearActiveObjects, duplicateActiveObject, sendToBack, groupActiveObjects, selectAllObjects, ungroupActiveObject])
}