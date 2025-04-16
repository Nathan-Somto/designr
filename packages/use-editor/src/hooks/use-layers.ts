import React from "react";
import { UseLayersProps, Layers, Workspace } from "../types";
import * as fabric from "fabric";
import { WORKSPACE_NAME } from "../defaults";
import { toCapitalize } from "../helpers/textTransformHelpers";
import { findLayerAndParent } from "../helpers/find-layer-and-parent";
type ModifiedFabricObject = fabric.FabricObject & {
    zIndex: number
    id: string
}
/**
 * A custom hook for managing and interacting with layers in a Fabric.js canvas.
 * This hook provides functionality for layer selection, visibility toggling, locking,
 * reordering, and updating the layer tree structure.
 *
 * @param {UseLayersProps} props - The properties required to initialize the hook.
 * @param {fabric.Canvas} props.canvas - The Fabric.js canvas instance to manage layers for.
 *
 *
 * @example
 * // Example usage of the useLayers hook
 * const { layers, onLayersUpdate, selectLayerInCanvas } = useLayers({ canvas });
 *
 * // Update layers when the canvas changes
 * React.useEffect(() => {
 *   onLayersUpdate();
 * }, [canvas]);
 *
 * // Select a layer by ID
 * selectLayerInCanvas('layer-id');
 * @private this hook is used internally by the editor but exposes some methods and values
 */
export function useLayers({
    canvas,
    getType
}: UseLayersProps

) {
    const [selectedLayer, setSelectedLayer] = React.useState<fabric.FabricObject | null>(null)
    const [layers, setLayers] = React.useState<Layers[]>([])
    const updateZindices = (objects: ModifiedFabricObject[]) => {
        //const baseTime = Date.now();
        objects.forEach((object, index) => {
            //object.id = `${object.type}-${baseTime + index}`;
            object.zIndex = index + 1;
        })
        return objects as (fabric.FabricObject & {
            zIndex: number
            id: string
        })[]
    }
    /**
     * @description processLayer is a recursive function that processes the layers of the canvas
     * @description it is used internally by the editor to create a tree of layers
     * @param object 
     * @returns 
     * @private
     */
    const processLayer = (object: ModifiedFabricObject): Layers => {
        let id = `${object.type}-${Date.now() + Math.floor(10000 * Math.random())}`
        object.id = id;
        const layer: Layers = {
            id,
            zIndex: object.zIndex,
            type: getType(object) ?? toCapitalize(object.type),
            isLocked: !object.evented,
            isVisibile: object.opacity !== 0,
            children: object instanceof fabric.Group ? object.getObjects().map(object => processLayer(object as ModifiedFabricObject)) : undefined,
        };
        return layer;
    };
    const updateLayer = (layers: Layers[], targetLayer: Layers, updater: (layer: Layers) => Partial<Layers>): Layers[] => {
        const clonedLayers = layers.slice();
        //console.log("the cloned layers: ", clonedLayers);
        const update = (layerList: Layers[], targetZIndex: number | null = null): boolean => {
            for (const layer of layerList) {
                // optimize this by checking if the layer is the target layer
                if (layer.id === targetLayer.id) {
                    Object.assign(layer, updater(layer));
                    return true;
                }
                if (layer.children) {
                    const found = update(layer.children, targetZIndex);
                    if (found) return true;
                }
                return false
            }
            return false
        };

        const targetZIndex = targetLayer.zIndex;

        update(clonedLayers, targetZIndex);
        return clonedLayers;
    };

    const onLayersUpdate = React.useCallback(() => {
        if (!canvas) return
        console.log("on layers update")
        const objects = canvas.getObjects()
            .filter(obj => (obj as Workspace)?.name !== WORKSPACE_NAME && !(obj.group && obj.group.type === 'group'));
        // console.log("the objects:", objects);
        // update the Zindex of the objects should be recursive and update the children as well
        const modified = updateZindices(objects as ModifiedFabricObject[]).map(object => processLayer(object))
        setLayers(modified.toReversed())
    }, [canvas])
    const onSelectLayer = React.useCallback((selectedObject: fabric.FabricObject | null) => {
        if (!selectedObject) return setSelectedLayer(null)
        if (!canvas) return
        const object = (canvas.getObjects() as ModifiedFabricObject[]).find(object => object.id === (selectedObject as ModifiedFabricObject)?.id)
        setSelectedLayer(object || null)
    }, [canvas])
    const selectLayerInCanvas = React.useCallback((id: string) => {
        if (!canvas) return
        const object = (canvas.getObjects() as ModifiedFabricObject[]).find(object => object.id === id)
        if (!object) return
        setSelectedLayer(object);
        canvas.setActiveObject(object)
        canvas.renderAll()
    }, [canvas])
    const moveLayer = React.useCallback(({
        layerId,
        targetIndex,
        parentLayerId
    }: {
        layerId: string
        targetIndex: number
        parentLayerId?: string
    }) => {
        if (!canvas) return;

        const updatedLayers = [...layers]/* .toReversed(); */
        const [layerToMove, oldIndex, oldParent] = findLayerAndParent(updatedLayers, layerId);
        if (!layerToMove) return;

        // Step 1: Remove from current position
        if (oldParent) {
            oldParent.children?.splice(oldIndex, 1);
        } else {
            updatedLayers.splice(oldIndex, 1);
        }

        // Step 2: Insert into new position
        if (parentLayerId) {
            const [newParent] = findLayerAndParent(updatedLayers, parentLayerId);
            if (!newParent) return;

            if (!newParent.children) newParent.children = [];
            newParent.children.splice(targetIndex - 1, 0, layerToMove);
        } else {
            updatedLayers.splice(targetIndex - 1, 0, layerToMove);
        }



        setLayers(updatedLayers);
        const updateCanvasStackingFromLayers = (
            layers: Layers[],
            canvas: fabric.Canvas,
            canvasObjects: fabric.Object[]
        ) => {
            // Find the workspace index first
            let zIndex = 1;

            const assignZIndex = (layerList: Layers[]) => {
                for (const layer of layerList) {
                    const obj = canvasObjects.find(o => o.id === layer.id);
                    if (obj) {
                        canvas.moveObjectTo(obj, zIndex);
                        layer.zIndex = zIndex;
                        zIndex++;
                    }
                    if (layer.children?.length) {
                        assignZIndex(layer.children);
                    }
                }
            };

            assignZIndex(layers);
            canvas.renderAll();
        };

        const objects = canvas.getObjects()
            .filter(obj => (obj as Workspace)?.name !== WORKSPACE_NAME)
        updateCanvasStackingFromLayers(layers, canvas, objects);
        console.log("canvas objects:", canvas.getObjects());
    }, [canvas, layers]);

    const toggleLayerVisibility = React.useCallback((layer: Layers) => {
        if (!canvas) return
        const updatedLayers = updateLayer(layers, layer, (layer) => ({
            isVisibile: !layer.isVisibile
        }))
        setLayers(updatedLayers)
        const originalFire = canvas.fire;
        canvas.fire = () => false;
        const object = (canvas.getObjects() as ModifiedFabricObject[]).find(object => object.id === layer.id)
        if (!object) return
        object.opacity = object.opacity === 0 ? 1 : 0
        canvas.renderAll()
        canvas.fire = originalFire;
    }, [canvas, layers])
    const toggleLayerLock = React.useCallback((layer: Layers) => {
        if (!canvas) return
        const object = (canvas.getObjects() as ModifiedFabricObject[]).find(object => object.id === layer.id)
        if (!object) return
        const updatedLayers = updateLayer(layers, layer, (layer) => ({
            isLocked: !layer.isLocked
        }))
        setLayers(updatedLayers)
        object.evented = !object.evented
        object.selectable = !object.selectable
        object.lockMovementX = !object.lockMovementX
        object.lockMovementY = !object.lockMovementY
        object.lockRotation = !object.lockRotation
        object.lockScalingX = !object.lockScalingX
        object.lockScalingY = !object.lockScalingY
        canvas.renderAll()
    }, [canvas, layers])
    return {
        /**
         * @description The current list of layers in the canvas, represented as a tree structure.
         * @type {Layers[]}
         * @example 
         * const {editor} = useEditor()
         * // use layers in your component
         * const { layers } = editor
         * 
         */
        layers,
        /**
         * @description The currently selected layer in the canvas.
         * @type {fabric.FabricObject | null}
         * @example
         * const {editor} = useEditor()
         * // use selected layer in your component
         * const { selectedLayer } = editor
         */
        selectedLayer,
        onSelectLayer,
        onLayersUpdate,
        /** 
     * @description selectLayerInCanvas is a helper function that selects a layer in the canvas
     * @description it is called in a layer panel when a user clicks on a layer
     * @param id the id of the layer to select
    */
        selectLayerInCanvas,
        /**
     * @description moveLayer helper function is used in the layers panel or whatever you have in mind for moving layers up and down in the canvas
     * @description because most design platforms support dragging and dropping layers up and down
     * @description the layer can be detached from its parent and moved to the top or bottom of the canvas
     * @example const {editor} = useEditor()
     * const { moveLayer } = editor
     * moveLayer({
     *  layerId: 'layer-id',
     * targetIndex: 0,
     * parentLayerId: 'parent-layer-id'
     * })
     */
        moveLayer,
        /**
         * @description toggleLayerVisibility is a helper function that toggles the visibility of a layer in the canvas
         * @description it is called in a layer panel when a user clicks on the visibility icon
         * @example const {editor} = useEditor()
         * const { toggleLayerVisibility } = editor
         * toggleLayerVisibility({
         *  id: 'layer-id'
         * })
         */
        toggleLayerVisibility,
        /**
         * @description toggleLayerLock is a helper function that toggles the lock state of a layer in the canvas
         * @description it is called in a layer panel when a user clicks on the lock icon
         * @example const {editor} = useEditor()
         * const { toggleLayerLock } = editor
         * toggleLayerLock({
         *  id: 'layer-id'
         * })
         */
        toggleLayerLock
    }
}