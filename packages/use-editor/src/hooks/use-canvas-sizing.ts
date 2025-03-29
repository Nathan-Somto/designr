/* function resizeCanvas() {
    const outerCanvasContainer = $('.fabric-canvas-wrapper')[0];
    
    const ratio = canvas.getWidth() / canvas.getHeight();
    const containerWidth   = outerCanvasContainer.clientWidth;
    const containerHeight  = outerCanvasContainer.clientHeight;

    const scale = containerWidth / canvas.getWidth();
    const zoom  = canvas.getZoom() * scale;
    canvas.setDimensions({width: containerWidth, height: containerWidth / ratio});
    canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
} */