'use client'
import BottomToolbar from "#/features/editor/components/bottom-toolbar"
import Navbar from "#/features/editor/components/nav-bar"
import SettingsPanel from "#/features/editor/components/settings-panel"
import { useEditor } from "@designr/use-editor"
import React from "react"

export default function EditorPage() {
    const [isPending, startTransition] = React.useTransition()
    const handleSave = React.useCallback((values: {
        width: number;
        height: number;
        state: string;
    }) => {

        startTransition(() => {
            setTimeout(() => {
                startTransition(() => {
                    setTimeout(() => {
                        console.log("width: ", values.width)
                        console.log("saved");
                    }, 2200)
                })
            }, 650)
        }
        )
    }, [])
    const {
        canvasRef,
        editor
    } = useEditor({
        //onSaveCallback: handleSave
    })
    return (
        <div id="editor" className='h-screen w-screen overflow-hidden'>
            <Navbar
                isSaving={isPending}
                //key={'nav-bar'}
                editor={editor}
            />
            <div className='h-screen w-screen   flex flex-col items-center justify-center'>
                <canvas ref={canvasRef}
                    style={{
                        height: '100vh',
                        width: '100vw',
                    }} />
            </div>
            <SettingsPanel
                editor={editor}
            />
            <BottomToolbar
                editor={editor}
            />
        </div>
    )
}