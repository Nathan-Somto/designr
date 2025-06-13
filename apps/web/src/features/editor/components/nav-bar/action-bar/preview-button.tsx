/* eslint-disable @next/next/no-img-element */
import { useEditorPreview } from '#/features/editor/hooks/useEditorPreview';
import { useEditorStore } from '#/features/editor/hooks/useEditorStore';
import { Button } from '@designr/ui/components/button';
import Hint from '@designr/ui/components/hint';
import { EyeIcon } from 'lucide-react';
import React from 'react'

export default function PreviewButton() {
    const { editor } = useEditorStore();
    const {
        EditorPreviewModal,
        enterPreviewMode
    } = useEditorPreview({
        editor,
        showPreview: false,
        hideExitPreview: false
    })
    return (
        <>
            <EditorPreviewModal />
            <Hint label="preview">
                <Button
                    onClick={() => enterPreviewMode()}
                    variant={'ghost'}
                    size={'shrink'}
                >
                    <EyeIcon />
                </Button>
            </Hint>
        </>
    )
}
