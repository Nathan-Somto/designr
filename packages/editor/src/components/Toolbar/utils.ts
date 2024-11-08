import * as fabric from 'fabric';
export const randomPosition = (height: number | undefined, width: number | undefined) => {
    if (!height || !width) return {
        top: 0,
        left: 0
    }
    return {
        top: Math.random() * (height),
        left: Math.random() * (width),
    };
};
export const insertElement = (canvas: fabric.Canvas, element: fabric.Object) => {
    //@ts-expect-error: name exists on fabric.Object
    const workspace = canvas.getObjects().find(obj => obj.name === 'workspace');
    console.log("workspace:", workspace);
    if (!workspace) return;
    const { top, left } = randomPosition(workspace.height, workspace.width);
    element.left = workspace.left + left;
    element.top = workspace.top + top;
    canvas.add(element);
}