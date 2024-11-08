import * as fabric from 'fabric';
export const convertToType = (value: string, type: 'int' | 'float' | 'string') => {
    // check if value is a number
    if(type === 'int' || type === 'float'){
        if(isNaN(parseInt(value))){
            return 0;
        }
        if(type === 'int'){
            return parseInt(value);
        }
        return parseFloat(value);
    }
    return value;

}
export const createFilter = (value: string) => {
    let effect;
  
    switch (value) {
      case "greyscale":
        effect = new fabric.filters.Grayscale();
        break;
      case "polaroid":
        effect = new fabric.filters.Polaroid();
        break;
      case "sepia":
        effect = new fabric.filters.Sepia();
        break;
      case "kodachrome":
       
        effect = new fabric.filters.Kodachrome();
        break;
      case "contrast":
        effect = new fabric.filters.Contrast({ contrast: 0.3 });
        break;
      case "brightness":
        effect = new fabric.filters.Brightness({ brightness: 0.8 });
        break;
      case "brownie":
       
        effect = new fabric.filters.Brownie();
        break;
      case "vintage":
       
        effect = new fabric.filters.Vintage();
        break;
      case "technicolor":
       
        effect = new fabric.filters.Technicolor();
        break;
      case "pixelate":
        effect = new fabric.filters.Pixelate();
        break;
      case "invert":
        effect = new fabric.filters.Invert();
        break;
      case "blur":
        effect = new fabric.filters.Blur();
        break;
      case "sharpen":
        effect = new fabric.filters.Convolute({
          matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
        });
        break;
      case "emboss":
        effect = new fabric.filters.Convolute({
          matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
        });
        break;
      case "removecolor":
       
        effect = new fabric.filters.RemoveColor({
          threshold: 0.2,
          distance: 0.5
        });
        break;
      case "blacknwhite":
       
        effect = new fabric.filters.BlackWhite();
        break;
      case "vibrance":
       
        effect = new fabric.filters.Vibrance({ 
          vibrance: 1,
        });
        break;
      case "blendcolor":
        effect = new fabric.filters.BlendColor({ 
          color: "#00ff00",
          mode: "multiply",
        });
        break;
      case "huerotate":
        effect = new fabric.filters.HueRotation({ 
          rotation: 0.5,
        });
        break;
      case "resize":
        effect = new fabric.filters.Resize();
        break;
      case "gamma":
        effect = new fabric.filters.Gamma({
          gamma: [1, 0.5, 2.1]
        });
        break;
      case "saturation":
        effect = new fabric.filters.Saturation({
          saturation: 0.7,
        });
        break;
      default:
        effect = null;
        return;
    };
  
    return effect;
  };