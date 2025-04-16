'use client';
import { useEditor } from '@designr/use-editor'
import React from 'react'
import BottomToolbar from './components/bottom-toolbar'
import ContextMenu from './components/context-menu'
import LayersPanel from './components/layers-panel'
import Navbar from './components/nav-bar'
import SettingsPanel from './components/settings-panel'
type Props = {
  initialState: {
    width: number,
    height: number,
    state: string
  } | null
}
export default function Editor({ initialState }: Props) {
  const [isPending, startTransition] = React.useTransition()
  const [contextMenuPostion, setContextMenuPostion] = React.useState<
    {
      x: number;
      y: number;
    } | null
  >(null)
  const handleSave = React.useCallback((values: {
    width: number;
    height: number;
    state: string;
  }) => {

    startTransition(() => {
      setTimeout(() => {
        localStorage.setItem('design', JSON.stringify(values))
      }, 650)
    }
    )
  }, [])
  const {
    canvasRef,
    editor,
    menuRef
  } = useEditor({
    onSaveCallback: handleSave,
    updateContextMenuPosition(position) {
      setContextMenuPostion(position)
    },
    initialDimensions: initialState !== null ? {
      width: initialState?.width,
      height: initialState?.height
    } : undefined,
    //@ts-ignore
    intialState: initialState?.state ?? undefined
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
      <LayersPanel
        editor={editor}
      />
      <SettingsPanel
        editor={editor}
      />
      <BottomToolbar
        editor={editor}
      />
      <ContextMenu
        menuRef={menuRef}
        contextMenuPostion={contextMenuPostion}
        editor={editor}
      />
    </div>
  )
}
