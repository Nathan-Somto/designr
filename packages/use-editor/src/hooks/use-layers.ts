import React from "react";
import { UseLayersProps, Layers } from "../types";
import * as fabric from "fabric";
import { isInRange } from "../helpers/isInRange";
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
    canvas
}: UseLayersProps

) {
    const [selectedLayer, setSelectedLayer] = React.useState<fabric.FabricObject | null>(null)
    const [layers, setLayers] = React.useState<Layers[]>([])
    const addIdToObject = (object: ModifiedFabricObject) => {
        object.id = `${object.type}-${new Date().getTime()}`
        return object
    }
    const updateZindices = (objects: ModifiedFabricObject[]) => {
        objects.forEach((object, index) => {
            addIdToObject(object as ModifiedFabricObject)
            object.zIndex = index
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
        const layer: Layers = {
            id: object.id,
            zIndex: object.zIndex,
            type: object.type,
            isLocked: object.evented,
            isVisibile: object.opacity !== 0,
            children: object instanceof fabric.Group ? object.getObjects().map(object => processLayer(object as ModifiedFabricObject)) : undefined,
        };
        return layer;
    };
    const updateLayer = (layers: Layers[], targetLayer: Layers, updater: (layer: Layers) => Partial<Layers>): Layers[] => {
        const clonedLayers = structuredClone(layers);

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
        const objects = canvas.getObjects().filter(object => object.type !== 'workspace')
        // update the Zindex of the objects should be recursive and update the children as well
        const modified = updateZindices(objects as ModifiedFabricObject[]).map(object => processLayer(object))
        setLayers(modified.reverse())
    }, [])
    const onSelectLayer = React.useCallback((selectedObject: fabric.FabricObject | null) => {
        if (!selectedObject) return setSelectedLayer(null)
        if (!canvas) return
        const object = (canvas.getObjects() as ModifiedFabricObject[]).find(object => object.id === (selectedObject as ModifiedFabricObject)?.id)
        setSelectedLayer(object || null)
    }, [])
    const selectLayerInCanvas = React.useCallback((id: string) => {
        if (!canvas) return
        const object = (canvas.getObjects() as ModifiedFabricObject[]).find(object => object.id === id)
        if (!object) return
        canvas.setActiveObject(object)
        canvas.renderAll()
    }, [])
    const moveLayer = React.useCallback((layerInfo: {
        layerId: string
        targetIndex: number
        parentLayerId?: string
    }) => {
        if (!canvas) return
        if (selectedLayer) return
        // find the layer and the parent layer
        // returns the layer, its index and its parent layer
        const findLayerAndParent = (layers: Layers[], id: string, parentLayer: Layers | null = null): [Layers | null, number, Layers | null] => {
            for (let i = 0; i < layers.length; i++) {
                if (layers[i].id === id) {
                    return [
                        layers[i],
                        i,
                        parentLayer
                    ]
                }
                if (layers[i]?.children !== undefined
                    && (layers[i]?.children as Layers[]).length > 0) {
                    const childrenLayers = (layers[i] as Layers).children as Layers[]
                    const parent = layers[i]
                    const result = findLayerAndParent(childrenLayers, id, parent)
                    if (result[0]) return result
                }
                return [
                    null,
                    -1,
                    null
                ]
            }
            return [
                null,
                -1,
                null
            ]
        }
        const updatedLayers = layers.slice()
        const [layer, index, parentLayer] = findLayerAndParent(updatedLayers, layerInfo.layerId)
        if (!layer) return
        // if parent layer is null that means this layer is a top level layer
        let prevObject: Layers | null = null
        let currentObjectZIndex: number = layer.zIndex
        if (!parentLayer) {
            // check if the index is in bounds of layers
            if (!isInRange(0, layerInfo.targetIndex, layers.length)) return
            updatedLayers.splice(index, 1)
            prevObject = updatedLayers[layerInfo.targetIndex]
            updatedLayers.splice(layerInfo.targetIndex, 0, layer)

        }
        else {
            // based on the target parent layer id  find it, and attach our layer to it
            if (!layerInfo.parentLayerId) return
            const [parent] = findLayerAndParent(updatedLayers, layerInfo?.parentLayerId)
            if (!parent) return
            // check if the index is in bounds of layers
            if (!isInRange(0, layerInfo.targetIndex, parent.children?.length as number)) return
            // remove from its old parent(we are allowed to use splice because we are working with a copy of the layers)
            parentLayer.children?.splice(index, 1)
            prevObject = parent.children?.[layerInfo.targetIndex] ?? null
            // add to the new parent
            parent.children?.splice(layerInfo.targetIndex, 0, layer)
        }
        // perform swap for state
        const tempZ = layer.zIndex;
        layer.zIndex = prevObject?.zIndex as number;
        if (prevObject) prevObject.zIndex = tempZ;
        setLayers(updatedLayers)
        // update their indexes
        const prevObjectInCanvas = canvas._objects[prevObject?.zIndex as number]
        const currentObjectInCanvas = canvas._objects[currentObjectZIndex]
        // perform swap for our canvas
        const temp = currentObjectInCanvas
        canvas._objects[currentObjectZIndex] = prevObjectInCanvas
        canvas._objects[prevObject?.zIndex as number] = temp
        canvas.renderAll()
    }, [])
    const toggleLayerVisibility = React.useCallback((layer: Layers) => {
        if (!canvas) return
        const updatedLayers = updateLayer(layers, layer, (layer) => ({
            isVisibile: !layer.isVisibile
        }))
        setLayers(updatedLayers)
        const object = (canvas.getObjects() as ModifiedFabricObject[]).find(object => object.id === layer.id)
        if (!object) return
        object.opacity = object.opacity === 0 ? 1 : 0
        object.evented = object.opacity !== 0
        object.selectable = object.opacity !== 0
        object.lockMovementX = object.opacity === 0
        object.lockMovementY = object.opacity === 0
        object.lockRotation = object.opacity === 0
        canvas.renderAll()
    }, [])
    const toggleLayerLock = React.useCallback((layer: Layers) => {
        if (!canvas) return
        const updatedLayers = updateLayer(layers, layer, (layer) => ({
            isLocked: !layer.isLocked
        }))
        setLayers(updatedLayers)
        const object = (canvas.getObjects() as ModifiedFabricObject[]).find(object => object.id === layer.id)
        if (!object) return
        object.evented = !object.evented
        object.selectable = !object.selectable
        object.lockMovementX = !object.lockMovementX
        object.lockMovementY = !object.lockMovementY
        object.lockRotation = !object.lockRotation
        object.lockScalingX = !object.lockScalingX
        object.lockScalingY = !object.lockScalingY
        canvas.renderAll()
    }, [])
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