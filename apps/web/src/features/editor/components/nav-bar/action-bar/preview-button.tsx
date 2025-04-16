/* eslint-disable @next/next/no-img-element */
import { useEditorPreview } from '#/features/editor/hooks/useEditorPreview';
import { BaseEditorProps } from '#/features/editor/types';
import { Button } from '@designr/ui/components/button';
import Hint from '@designr/ui/components/hint';
import { EyeIcon } from 'lucide-react';
import React from 'react'

export default function PreviewButton({
    editor
}: BaseEditorProps) {
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
