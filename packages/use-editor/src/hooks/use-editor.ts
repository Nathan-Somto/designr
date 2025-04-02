import React from "react";
import * as fabric from "fabric";
import { CanvasAction, UseEditorProps } from "../types";
import { useLoadCanvasState } from "./use-load-canvas-state";
import canvasHelpers from "../helpers/canvasHelpers";
import { useSelection } from "./use-selection";
import { useCanvasEvents } from "./use-canvas-events";
import { useKeyboardShortcuts } from "./use-keyboard-shortcuts";
import { useLayers } from "./use-layers";
import { useHistory } from "./use-history";
import { useClipboard } from "./use-clipboard";
import { useCanvasInit } from "./use-canvas-init";
/**
 * 
 * @description a hook that helps to manage the editor instance
 * @description this hook is an aggregate of all the hooks that are needed to manage the editor instance
 * @description for access of the canvas instance pass it down to the children
 * @example 
 * const {
 *      initialize, 
 *      canvasRef, 
 *      editor
 *    } = useEditor({
 *      initialDimensions, 
 *      intialState, 
 *      onSaveCallback, 
 *      backgroundColor, 
 *      workspaceColor  
 *     })
 * <canvas ref={canvasRef}></canvas>
 * {editor && <EditorComponent {...editor} />}
 * @returns 
 */
export default function useEditor(props: UseEditorProps | void = {
    onSaveCallback: () => { },
    filename: 'canvas',
    updateContextMenuPosition: () => { },
}) {
    if (typeof props !== 'object') {
        throw new Error('props must be an object')
    }
    const {
        initialDimensions,
        intialState,
        onSaveCallback,
        backgroundColor,
        workspaceColor
    } = props
    // the editor instance
    const dimensions = React.useRef(initialDimensions)
    const state = React.useRef(intialState ?? null)
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const [canvas, setCanvas] = React.useState<fabric.Canvas | null>(null)
    const [currentAction, setCurrentAction] = React.useState<CanvasAction>("Selection")
    const [zoom, setZoom] = React.useState<Readonly<number | null>>(null)
    useCanvasInit({
        initialDimensions: dimensions.current,
        backgroundColor,
        canvas,
        canvasRef,
        setCanvas,
        workspaceColor,
        setZoom
    })
    const {
        copy,
        paste
    } = useClipboard(canvas)
    const {
        canRedo,
        canUndo,
        undo,
        save,
        redo,
        initHistory
    } = useHistory({
        canvas,
        onSaveCallback
    })
    const {
        layers,
        selectedLayer,
        onSelectLayer,
        onLayersUpdate,
        selectLayerInCanvas,
        moveLayer,
        toggleLayerLock,
        toggleLayerVisibility
    } = useLayers({
        canvas
    })


    const editor = React.useMemo(() => {
        if (!canvas) return null
        return canvasHelpers({
            canvas,
            setZoom,
            updateAction: setCurrentAction
        })

    }, [
        canvas
    ])
    const {
        selectedObjects,
        onObjectsSelection,
        onObjectsDeselection,
        updateSelectedObjectProperty
    } = useSelection({
        canvas,
        alignObject: editor?.alignObject,
        applyLinearGradient: editor?.applyLinearGradient,
        formatLinearGradient: editor?.formatLinearGradient,
        getAlignment: editor?.getAlignment,
        updateImageFilter: editor?.updateImageFilter,
        setBorderStyle: editor?.setBorderStyle,
        getBorderStyleFromDashArray: editor?.getBorderStyleFromDashArray
    });
    useCanvasEvents({
        canvas,
        onObjectModified: onLayersUpdate,
        onObjectsSelection: (target) => {
            onObjectsSelection(target)
            onSelectLayer(target !== null && target[0] !== undefined ? target[0] : null)
        },
        onObjectsDeselection: () => {
            onObjectsDeselection()
            onSelectLayer(null)
        },
        updateAction: setCurrentAction,
        onSave: save
    })
    useLoadCanvasState({
        canvas,
        state: state.current,
        initCanvasHistory: initHistory,
        autoZoomToFit: () => {
            editor?.setZoomLevel({
                value: 'fit'
            })
        }
    })
    useKeyboardShortcuts({
        canvas,
        bringToFront: editor?.bringToFront,
        clearActiveObjects: editor?.clearActiveObjects,
        duplicateActiveObject: editor?.duplicateActiveObjects,
        sendToBack: editor?.sendToBack,
        groupActiveObjects: editor?.groupActiveObjects,
        selectAllObjects: editor?.selectAllObjects,
        ungroupActiveObject: editor?.ungroupActiveObjects,
        redo,
        undo,
        copy,
        paste,
        zoomChange: editor?.zoomChange
    })
    return {
        canvasRef,
        editor: editor ? {
            ...editor,
            selectedObjects,
            selectedLayer,
            layers,
            updateSelectedObjectProperty,
            selectLayerInCanvas,
            moveLayer,
            toggleLayerLock,
            toggleLayerVisibility,
            redo,
            undo,
            canRedo,
            canUndo,
            zoomValue: `${((zoom ?? 0) * 100).toFixed(0)}%`,
            currentAction
        } : null
    }
}