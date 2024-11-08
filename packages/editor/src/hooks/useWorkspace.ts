import {create} from 'zustand';
import * as fabric from 'fabric';
type WorkspaceStore = {
    showSettings: boolean,
    setShowSettings: (showSettings: boolean) => void
    changeWorkspaceBg: (canvas:fabric.Canvas, color: string) => void
    changeWorkspaceSize: (canvas:fabric.Canvas, width?: number, height?: number) => void
}
 //@ts-expect-error: name exists on fabric.Object
export const getWorkspace = (canvas: fabric.Canvas) => canvas.getObjects().find(obj => obj.name === 'workspace');
export const useWorkspace = create<WorkspaceStore>(set => ({
    showSettings: false,
    setShowSettings: (showSettings) => set({showSettings}),
    changeWorkspaceBg: (canvas, color) => {
        const workspace = getWorkspace(canvas);
        if (!workspace) return;
        workspace.set('fill', color);
        canvas.requestRenderAll();
    },
    changeWorkspaceSize: (canvas, width, height) => {
        const workspace = getWorkspace(canvas);
        if (!workspace) return;
        workspace.set('width', width || workspace.width);
        workspace.set('height', height || workspace.height);
        canvas.requestRenderAll();
    }
}))
