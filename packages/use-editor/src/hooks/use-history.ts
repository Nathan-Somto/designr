import React from "react";
import { UseHistoryProps } from "../types"
import * as fabric from "fabric";
import { JSON_KEYS, WORKSPACE_NAME } from "../defaults";
const STACK_LIMIT = 10;

export function useHistory({ canvas, onSaveCallback }: UseHistoryProps) {
    const canvasHistory = React.useRef<string[]>([]);
    const [pointer, setPointer] = React.useState(-1);
    //console.log("the pointer", pointer);
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
        //! we have to manually convert to object then stringify because of this issue:
        //https://github.com/fabricjs/fabric.js/issues/10425
        const currentState: object = canvas?.toObject(JSON_KEYS);
        // based on the limit cut out the previous states
        // if the length is STACK_LIMIT, we remove the first element
        // and add the new state to the end
        const stringifiedState = JSON.stringify(currentState)
        if (lastState === stringifiedState) {
            return;
        }
        //! create new history and esnure it does not pass the limit
        const newHistory = canvasHistory.current.slice();
        if (newHistory.length >= STACK_LIMIT) {
            newHistory.shift();
        }
        newHistory.push(stringifiedState);
        //@ts-ignore
        const object = (canvas?.getObjects() as fabric.FabricObject[]).find(object => object.name === WORKSPACE_NAME);
        canvasHistory.current = newHistory;
        setPointer(newHistory.length - 1);
        onSaveCallback?.({
            state: stringifiedState,
            width: object?.width || 0,
            height: object?.height || 0
        })
    }, [
        pointer,
        canvas,
    ])
    const undo = React.useCallback(async () => {
        if (!canUndo()) return;
        skipSave.current = true;
        canvas?.clear();
        const newPointer = Math.max(pointer - 1, 0);
        const previousState = canvasHistory.current[newPointer];
        if (previousState) {
            await canvas?.loadFromJSON(previousState)
            canvas?.renderAll();
            skipSave.current = false;
            setPointer(newPointer);
        }
    }, [
        canvas,
        canUndo,
        pointer
    ])
    const redo = React.useCallback(async () => {
        if (!canRedo()) return;
        skipSave.current = true;
        canvas?.clear();
        const newPointer = Math.min(pointer + 1, canvasHistory.current.length - 1);
        const nextState = canvasHistory.current[newPointer];
        if (nextState) {
            await canvas?.loadFromJSON(nextState)
            skipSave.current = false;
            canvas?.renderAll();
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
