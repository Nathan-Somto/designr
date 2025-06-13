'use client';
import { useEditor } from '@designr/use-editor'
import React from 'react'
import ZoomControls from './components/zoom-controls'
import ContextMenu from './components/context-menu'
import LayersPanel from './components/layers-panel'
import Navbar from './components/nav-bar'
import SettingsPanel from './components/settings-panel'
import MobileWarning from './components/mobile-warning';
import OnlineStatus from '#/components/online-status';
import useIsOnline from '#/hooks/useIsOnline';
import AiPanel from './components/ai-panel';
import { EditorProvider, useEditorStore } from './hooks/useEditorStore';
type Props = {
  initialState: {
    width: number,
    height: number,
    state: string
  } | null
}
function Editor({ initialState }: Props) {
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
    dispatch: {
      setEditor,
    }
  } = useEditorStore();
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
    intialState: initialState?.state ?? undefined,
    onInit: (editor) => {
      setEditor(editor);
    }
  })
  const isOnline = useIsOnline()

  return (
    <>
      <OnlineStatus isOnline={isOnline} />
      <MobileWarning />
      <div id="editor" className='h-screen w-screen overflow-hidden'>
        <Navbar
          isSaving={isPending}
        //key={'nav-bar'}
        />
        <div className='h-screen w-screen   flex flex-col items-center justify-center'>
          <canvas
            id="editor__canvas"
            ref={canvasRef}
            style={{
              height: '100vh',
              width: '100vw',
            }} />
        </div>
        <LayersPanel
        />
        <SettingsPanel
        />
        <AiPanel />
        <ZoomControls
        />
        <ContextMenu
          menuRef={menuRef}
          contextMenuPostion={contextMenuPostion}
        />
      </div>
    </>
  )
}
export default function EditorWithProvider(props: Props) {
  return (
    <EditorProvider>
      <Editor {...props} />
    </EditorProvider>
  )
}