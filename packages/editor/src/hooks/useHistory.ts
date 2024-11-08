import { create } from "zustand";
import * as fabric from "fabric";

const JSON_KEYS = [
    "name",
    "gradientAngle",
    "selectable",
    "hasControls",
    "linkData",
    "editable",
    "extensionType",
    "extension",
    "backgroundColor",
  ];
let skipSave = true;
const STACK_LIMIT = 10;
type HistoryStore = {
    history: string[],
    pointer: number;
    redo: (state: fabric.Canvas) => void;
    undo: (state: fabric.Canvas) => void;
    save: (state: fabric.Canvas) => void;
    canRedo: () => boolean;
    canUndo: () => boolean;
}

export const useHistory = create<HistoryStore>((set, localState) => ({
    history: [],
    pointer: -1,

    save: (localCanvas) => {
        if (!skipSave) {
            return
        }
        set((state) => {
            console.log("history in save before save: ", localState().history)
            const lastState = state.history[state.pointer];
            const currentState = localCanvas.toJSON(JSON_KEYS);
            // check if the current state is the same with what we have in history
            if (state.pointer > 0 && lastState === currentState) {
                return state; // If no changes, skip saving
            }
            const newHistory = state.history
            .slice(
                Math.max(state.pointer - STACK_LIMIT, 0)/* ,
                state.pointer + 1 */
            )
            newHistory.push(JSON.stringify(currentState));
            return {
                history: newHistory,
                pointer: newHistory.length - 1
            }
        })
    },
    redo: (localCanvas) => {
        set((state) => {
            if (!state.canRedo()) {
                return state
            }
            skipSave = true
            const newPointer = Math.min(localState().pointer + 1, localState().history.length - 1);
            const previousState = localState().history[newPointer];
            if (previousState) {
                const json = JSON.parse(previousState)
                localCanvas.loadFromJSON(json, () => {
                }).then(() => {
                    skipSave = false
                    localCanvas.backgroundColor = json.backgroundColor
                    localCanvas.renderAll();
                    console.log("loaded from redo")
                })
                return {
                    history: state.history,
                    pointer: newPointer
                }
            }
            return state
        })
    },
    undo: (localCanvas) => {
        set((state) => {
            console.log("can undo: ", state.canUndo())
            if (!state.canUndo()) {
                return state
            }
            skipSave =true
            const newPointer = Math.max(localState().pointer - 1, 0);
            console.log("the new pointer in undo: ", newPointer)
            console.log("the history length in undo", localState().history.length)
            const previousState = localState().history[newPointer];
            if (previousState) {
                //localCanvas.clear()
                const json = JSON.parse(previousState)
                localCanvas.loadFromJSON(json, (e) => {         
                }).then(() => {
                    skipSave = false
                    localCanvas.backgroundColor = json.backgroundColor
                    localCanvas.renderAll();
                    console.log("loaded from undo")
                }
                )
                return {
                    history: state.history,
                    pointer: newPointer
                }
            }
            return state
        })
    },
    canUndo: () => {
        return localState().pointer > 0
    },
    canRedo: () => localState().pointer < localState().history.length - 1
}));

