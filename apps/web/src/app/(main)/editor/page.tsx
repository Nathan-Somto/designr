'use client'
import Editor from "#/features/editor";
import React from "react"
export default function EditorPage() {
    const [initialState, setInitialState] = React.useState<string | null | undefined>(undefined)
    const [loading, setLoading] = React.useState(true);
    const releaseLoading = React.useCallback(() => {
        /*  setTimeout(() => { */
        setLoading(false);
        setInitialState(localStorage.getItem('design') ?? null);
        /* }, 2500); */
    }, []);
    return <Editor
        initialState={initialState !== null && initialState !== undefined ? JSON.parse(initialState) : null}
        releaseLoading={releaseLoading}
        isLoading={loading}
    />
}