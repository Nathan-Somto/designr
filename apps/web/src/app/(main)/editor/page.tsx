'use client'
import { useEditor } from "@designr/use-editor"

export default function EditorPage() {
    const {
        canvasRef,
        editor
    } = useEditor()
    console.log("editor zoom:", editor?.zoomValue)
    return (
        <div id="editor" className='h-screen w-screen overflow-hidden'>
            <div className='h-screen w-screen   flex flex-col items-center justify-center'>
                <canvas ref={canvasRef}
                    style={{
                        height: '100vh',
                        width: '100vw',
                    }} />
            </div>
        </div>
    )
}