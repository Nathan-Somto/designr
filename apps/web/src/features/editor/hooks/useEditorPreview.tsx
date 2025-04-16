/* eslint-disable @next/next/no-img-element */
import { XIcon } from "lucide-react";
import { BaseEditorProps } from "../types";
import React from "react";
import ReactDOM from "react-dom";
import Hint from "@designr/ui/components/hint";

type UseEditorPreviewProps = BaseEditorProps & {
    showPreview?: boolean;
    hideExitPreview?: boolean;
};

export function useEditorPreview({
    editor,
    showPreview = false,
    hideExitPreview = false,
}: UseEditorPreviewProps) {
    const [isPreviewing, setIsPreviewing] = React.useState(false);
    const [previewSrc, setPreviewSrc] = React.useState<string | null>(null);

    const enterPreviewMode = () => {
        const dataUrl = editor?.previewCanvas();
        setPreviewSrc(dataUrl ?? null);
        setIsPreviewing(true);
    };

    const exitPreviewMode = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsPreviewing(false);
        setPreviewSrc(null);
    };

    React.useEffect(() => {
        if (showPreview) {
            enterPreviewMode();
        }
    }, [showPreview]);

    const EditorPreviewModal = () => {
        if (!isPreviewing || !previewSrc) return null;

        return ReactDOM.createPortal(
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[80]">
                {!hideExitPreview && (
                    <Hint
                        label="Exit Preview"
                        className="z-[90]"
                    >
                        <button
                            onClick={exitPreviewMode}
                            className="absolute top-4 right-4 text-white p-2 rounded-md hover:bg-white/30"
                        >
                            <XIcon />
                        </button>
                    </Hint>
                )}
                <img src={previewSrc} alt="Canvas Preview" className="max-w-full max-h-full" />
            </div>,
            document.body
        );
    };

    return {
        enterPreviewMode,
        exitPreviewMode,
        EditorPreviewModal,
    };
}
