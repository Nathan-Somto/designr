import { useEffect } from "react";
import { useCanvas } from "./useCanvas";
import * as fabric from 'fabric'
import { useHistory } from "./useHistory";
import { randomPosition } from "@/components/Toolbar/utils";
export function useKeyboardEvents() {
    // listens to keyboards for  basic key board shorcuts
    //1. selecting an object and pressing backspace or delete should delete the object
    // ctrl + z should undo the last action
    // ctrl + shift + z should redo the last action
    // ctrl + c should copy the selected object
    // ctrl + v should paste the copied object
    // ctrl + g should group the selected objects
    // ctrl + u should ungroup the selected objects
    //no cut
    // ctrl + a should select all objects
    // implementation
    const { undo, redo, canRedo, canUndo } = useHistory()
    const { updateAction, canvas } = useCanvas()
    useEffect(() => {
        const handleKeyDown = async (e: KeyboardEvent) => {
            // if the backspace is from a input field cancel 

            if (canvas) {
                if (e.key === 'Delete') {
                    const activeObject = canvas.getActiveObject()
                    if (!activeObject) {
                        return;
                    }
                    canvas.remove(activeObject)
                }
                if (e.key === 'z' && e.ctrlKey) {
                    if (e.shiftKey) {
                        // redo
                        if (canRedo()) {
                            redo(canvas)
                        }
                    } else {
                        // undo
                        if (canUndo()) {
                            undo(canvas)
                        }
                    }
                }
                // handle copying and pasting
                if (e.key === 'c' && e.ctrlKey) {
                    const activeObject = canvas.getActiveObject()
                    if (!activeObject) {
                        return;
                    }
                    // copy the object
                    navigator.clipboard.writeText(JSON.stringify(activeObject))

                }
                if (e.key === 'v' && e.ctrlKey) {
                    e.preventDefault();
                    // Read the copied object from the clipboard
                    navigator.clipboard.readText().then(async (text) => {
                        try {
                            const copiedObject = JSON.parse(text);
                            // Convert the copied JSON into a fabric object
                            fabric.util.enlivenObjects([copiedObject]).then((enlivenedObjects) => {
                                enlivenedObjects.forEach((enlivenedObject) => {
                                    const { top, left } = randomPosition(canvas.height, canvas.width)
                                    //@ts-expect-error: enlivenedObject is a fabric object
                                    enlivenedObject.left = left;
                                    //@ts-expect-error: enlivenedObject is a fabric object
                                    enlivenedObject.top = top;
                                    //@ts-expect-error: enlivenedObject is a fabric object
                                    return canvas.add(enlivenedObject);

                                });
                                canvas.renderAll();
                            }
                            );
                        } catch (error) {
                            console.error("Failed to parse clipboard data or enliven object:", error);
                        }
                    });
                }
                if(e.key === 'g' && e.ctrlKey){
                    e.preventDefault();
                    const activeObjects = canvas.getActiveObjects();
                    if(!activeObjects)return;
                    //console.log('activeObject type:', activeObject.type)
                    //if(activeObject.type !== 'activeselection') return;
                   const group = new fabric.Group(activeObjects);
                   //canvas.discardActiveObject();
                   canvas.add(group);
                    //canvas.requestRenderAll();
                }
                if(e.key === 'u' && e.ctrlKey){
                    e.preventDefault();
                    if (!canvas.getActiveObject()) {
                        return;
                      }
                      if (canvas?.getActiveObject()?.type !== 'group') {
                        return;
                      }
                      //canvas?.getActiveObject()?.toActiveSelection();
                      canvas.requestRenderAll();
                }
                if (e.key === 'a' && e.ctrlKey) {
                    e.preventDefault();
                    console.log("selecting all objects")
                    canvas.discardActiveObject()
                    const objects = canvas.getActiveObjects().filter(object => !object.selectable)
                     canvas.setActiveObject(new fabric.ActiveSelection(objects, {
                         canvas,
                     }))

                    canvas.requestRenderAll()
                }

            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvas])
}
