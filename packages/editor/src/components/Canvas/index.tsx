import { useInitCanvas } from '@/hooks/useInitCanvas'
import { useCanvasEvents } from '@/hooks/useCanvasEvents'
import { useKeyboardEvents } from '@/hooks/useKeyboardEvents';
function Canvas() {
    const { canvasRef } = useInitCanvas();
    useCanvasEvents();
    useKeyboardEvents();
    return (
        <div className='h-[calc(100vh-64px)] mt-[64px] w-full flex flex-col items-center justify-center'>
            <canvas ref={canvasRef}
                style={{
                    borderRadius: '6px',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                    height: 'calc(100vh - 64px)',
                    width: '100vw',
                }} />
        </div>
    )
}

export default Canvas