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
            // stop if its from an input field or text area
            event.preventDefault()
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
            const isCtrl = event.ctrlKey || event.metaKey
            if (isCtrl && event.key === '+') {
                zoomChange?.('+')
            }
            if (isCtrl && event.key === '-') {
                zoomChange?.('-')
            }
            if (isCtrl && event.key === "c") {
                copy?.()
            }
            if (isCtrl && event.key === "v") {
                paste?.()
            }
            if (event.key === "Delete" || event.key === "Backspace") {
                clearActiveObjects?.()
            }
            if (isCtrl && event.key === "z") {
                undo?.()
            }
            if (isCtrl && event.key === "y") {
                redo?.()
            }
            if (isCtrl && event.key === "g") {
                groupActiveObjects?.()
            }
            if (isCtrl && event.key === "u") {
                ungroupActiveObject?.()
            }
            if (isCtrl && event.key === "d") {
                duplicateActiveObject?.()
            }
            if (isCtrl && event.key === "b") {
                sendToBack?.()
            }
            if (isCtrl && event.key === "f") {
                bringToFront?.()
            }
            if (isCtrl && event.key === "a") {
                selectAllObjects?.()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [canvas, bringToFront, clearActiveObjects, duplicateActiveObject, sendToBack, groupActiveObjects, selectAllObjects, ungroupActiveObject])
}