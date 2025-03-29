import * as fabric from "fabric";
import { FabricFilterType } from "../types";

const filterMap: Record<FabricFilterType, any> = {
    greyscale: new fabric.filters.Grayscale(),
    polaroid: new fabric.filters.Polaroid(),
    sepia: new fabric.filters.Sepia(),
    kodachrome: new fabric.filters.Kodachrome(),
    contrast: new fabric.filters.Contrast({ contrast: 0.3 }),
    brightness: new fabric.filters.Brightness({ brightness: 0.8 }),
    brownie: new fabric.filters.Brownie(),
    vintage: new fabric.filters.Vintage(),
    technicolor: new fabric.filters.Technicolor(),
    pixelate: new fabric.filters.Pixelate(),
    invert: new fabric.filters.Invert(),
    blur: new fabric.filters.Blur(),
    sharpen: new fabric.filters.Convolute({
        matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
    }),
    emboss: new fabric.filters.Convolute({
        matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
    }),
    removecolor: new fabric.filters.RemoveColor({
        threshold: 0.2,
        distance: 0.5,
    }),
    blacknwhite: new fabric.filters.BlackWhite(),
    vibrance: new fabric.filters.Vibrance({
        vibrance: 1,
    }),
    blendcolor: new fabric.filters.BlendColor({
        color: "#00ff00",
        mode: "multiply",
    }),
    huerotate: new fabric.filters.HueRotation({
        rotation: 0.5,
    }),
    resize: new fabric.filters.Resize(),
    gamma: new fabric.filters.Gamma({
        gamma: [1, 0.5, 2.1],
    }),
    saturation: new fabric.filters.Saturation({
        saturation: 0.7,
    }),
};

export const createFilter = (value: FabricFilterType) => {
    return filterMap[value as FabricFilterType] || null;
};
