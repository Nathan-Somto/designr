import React from "react";
import { UseHistoryProps } from "../types"
import * as fabric from "fabric";
const STACK_LIMIT = 10;

export function useHistory({ canvas, onSaveCallback }: UseHistoryProps) {
    const canvasHistory = React.useRef<string[]>([]);
    const [pointer, setPointer] = React.useState(-1);
    const skipSave = React.useRef(false);
    const canRedo = React.useCallback(() => {
        return pointer < canvasHistory.current.length - 1;
    }
        , [pointer]);
    const canUndo = React.useCallback(() => {
        return pointer > 0;
    }, [pointer]);
    const save = React.useCallback(() => {
        // avoid the stack from passing our limit
        if (skipSave.current) return;
        const lastState = canvasHistory.current[pointer];
        //@ts-ignore
        const currentState = canvas?.toJSON(JSON_KEYS);
        // based on the limit cut out the previous states
        // if the length is STACK_LIMIT, we remove the first element
        // and add the new state to the end
        if (pointer > 0 && lastState === currentState) {
            return;
        }
        //! create new history and esnure it does not pass the limit
        const newHistory = canvasHistory.current.slice();
        if (newHistory.length >= STACK_LIMIT) {
            newHistory.shift();
        }
        newHistory.push(JSON.stringify(currentState));
        //@ts-ignore
        const object = (canvas?.getObjects() as fabric.FabricObject[]).find(object => object.name === 'workspace');
        canvasHistory.current = newHistory;
        setPointer(STACK_LIMIT - 1);
        onSaveCallback?.({
            state: currentState,
            width: object?.width || 0,
            height: object?.height || 0
        })
    }, [
        pointer,
        canvas,
    ])
    const undo = React.useCallback(() => {
        if (!canUndo()) return;
        skipSave.current = true;
        canvas?.clear();
        canvas?.renderAll();
        const newPointer = Math.max(pointer - 1, 0);
        const previousState = canvasHistory.current[newPointer];
        if (previousState) {
            canvas?.loadFromJSON(previousState, () => {
            }).then(() => {
                skipSave.current = false;
                canvas?.renderAll();
            });
            setPointer(newPointer);
        }
    }, [
        canvas,
        canUndo,
        pointer
    ])
    const redo = React.useCallback(() => {
        if (!canRedo()) return;
        skipSave.current = true;
        canvas?.clear();
        canvas?.renderAll();
        const newPointer = Math.min(pointer + 1, canvasHistory.current.length - 1);
        const nextState = canvasHistory.current[newPointer];
        if (nextState) {
            canvas?.loadFromJSON(nextState, () => {
            }).then(() => {
                skipSave.current = false;
                //canvas.backgroundColor = json.backgroundColor;
                canvas.renderAll();
            });
            setPointer(newPointer);
        }
    }, [
        canvas,
        canRedo,
        pointer
    ]);
    const initHistory = React.useCallback((initialState: string) => {
        canvasHistory.current = [initialState];
        setPointer(0);
    }, [])
    return {
        save,
        undo,
        redo,
        canRedo,
        canUndo,
        initHistory
    }
}
