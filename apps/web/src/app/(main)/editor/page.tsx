'use client'
import Editor from "#/features/editor";
import React from "react"
export default function EditorPage() {
    const [initialState, setInitialState] = React.useState<string | null | undefined>(undefined)
    React.useEffect(() => {
        setInitialState(localStorage.getItem('design') ?? null)
    }, [])
    if (initialState === undefined) return <p>Loading...</p>
    return <Editor
        initialState={initialState !== null ? JSON.parse(initialState) : null}
    />
}