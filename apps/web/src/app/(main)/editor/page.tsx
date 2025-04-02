'use client'
import BottomToolbar from "#/features/editor/components/bottom-toolbar"
import Navbar from "#/features/editor/components/nav-bar"
import SettingsPanel from "#/features/editor/components/settings-panel"
import { useEditor } from "@designr/use-editor"

export default function EditorPage() {
    const {
        canvasRef,
        editor
    } = useEditor()
    console.log("editor zoom:", editor?.zoomValue)
    return (
        <div id="editor" className='h-screen w-screen overflow-hidden'>
            <Navbar />
            <div className='h-screen w-screen   flex flex-col items-center justify-center'>
                <canvas ref={canvasRef}
                    style={{
                        height: '100vh',
                        width: '100vw',
                    }} />
            </div>
            <SettingsPanel />
            <BottomToolbar
                editor={editor}
            />
        </div>
    )
}