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
import { useEditorOnboarding } from './hooks/useEditorOnboarding';
import { Loader } from 'lucide-react';
import { useEditorPreview } from './hooks/useEditorPreview';
type Props = {
  initialState: {
    width: number,
    height: number,
    state: string,
    filename: string
  } | null;
  mode: 'edit' | 'view';
  releaseLoading?: () => void;
  isLoading?: boolean;
}
function Editor({ initialState, releaseLoading, isLoading, mode }: Props) {
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
    },
    editor
  } = useEditorStore();
  const {
    JoyrideComponent
  } = useEditorOnboarding({
    releaseLoading
  });
  const {
    canvasRef,
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
    intialState: initialState?.state,
    initWhen: initialState !== null,
    onInit: (editor) => {
      setEditor(editor);
    },
    filename: initialState?.filename || 'Untitled'
  })
  const {
    EditorPreviewModal
  } = useEditorPreview({
    editor,
    hideExitPreview: mode === 'view',
    showPreview: mode === 'view'
  })
  const isOnline = useIsOnline()
  if (initialState === null && isLoading) return <section
    id="editor__loading"
    className="flex flex-col gap-y-4 items-center justify-center h-screen w-screen">
    <div className="flex items-center gap-x-2">
      <Loader className="size-8 animate-spin text-muted-foreground" aria-label="Loading.." />
      <p className="text-lg text-muted-foreground font-semibold">Loading your design</p>
    </div>
  </section>
  return (
    <>
      <EditorPreviewModal />
      <OnlineStatus isOnline={isOnline} />
      <MobileWarning />
      <div
        id="editor"
        className='h-screen w-screen overflow-hidden'>
        <Navbar
          isSaving={isPending}
          filename={initialState?.filename || 'Untitled Project'}
          key={'nav-bar'}
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
      <JoyrideComponent />
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