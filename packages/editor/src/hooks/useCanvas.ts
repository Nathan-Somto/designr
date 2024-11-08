import {create} from 'zustand'
import * as fabric from 'fabric'
import { Action } from "../components/Toolbar/data";
export type CanvasAction = Action | "Translating" | "Rotating" | "Selection"
interface CanvasStore {
    canvas: fabric.Canvas | null
    setCanvas: (canvas: fabric.Canvas) => void
    updateAction: (currentAction: CanvasAction) => void,
    currentAction: CanvasAction
}
export const useCanvas = create<CanvasStore>((set) => ({
    canvas: null,
    setCanvas: (canvas) => set({canvas}),
    updateAction: (currentAction) => set({currentAction}),
    currentAction: "Selection"
}))
