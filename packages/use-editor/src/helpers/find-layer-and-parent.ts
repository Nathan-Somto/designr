import { Layers } from "../types"

export const findLayerAndParent = (layers: Layers[], id: string, parentLayer: Layers | null = null): [Layers | null, number, Layers | null] => {
    for (let i = 0; i < layers.length; i++) {
        if (layers[i].id === id) {
            return [
                layers[i],
                i,
                parentLayer
            ]
        }
        if (layers[i]?.children !== undefined && (layers[i]?.children as Layers[]).length > 0) {
            const childrenLayers = (layers[i] as Layers).children as Layers[]
            const parent = layers[i]
            const result = findLayerAndParent(childrenLayers, id, parent)
            if (result[0]) return result
        }
    }
    return [
        null,
        -1,
        null
    ]
}