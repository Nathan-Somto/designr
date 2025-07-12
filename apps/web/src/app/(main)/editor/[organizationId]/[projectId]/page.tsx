'use client'
import Editor from "#/features/editor";
import { useApi } from "#/hooks/useApi";
import { getProjectForEditor } from "#/services/projects";
import { useParams } from "next/navigation";
import React from "react"
export default function EditorPage() {
    // get the dynamic params for project id
    const params = useParams();
    const projectId = params?.projectId;
    const fetchFn = React.useCallback(() => getProjectForEditor(projectId as string), [projectId]);
    const {
        data: project,
        error,
        isFetching: isProjectLoading
    } = useApi({
        fetchFn,
        shouldFetch: !!projectId
    })
    const [initialState, setInitialState] = React.useState<{
        width: number,
        height: number,
        state: string,
        filename: string
    } | null | undefined>(undefined);
    const [mode, setMode] = React.useState<'view' | 'edit'>('view');
    const [loading, setLoading] = React.useState(true);
    // based on can view and can edit perform necessary checks
    React.useEffect(() => {
        if (isProjectLoading) return;
        if (project === undefined) return;
        if (project?.canEdit) {
            setMode('edit');
        }
    }, [project, isProjectLoading])
    const releaseLoading = React.useCallback(() => {
        setLoading(false);
        setInitialState({
            width: project?.width || 800,
            height: project?.height || 600,
            state: project?.data as string || '{}',
            filename: project?.name || 'Untitled Project'
        });
    }, [
        project?.width,
        project?.height,
        project?.data,
        project?.name
    ]);
    if (error) {
        return <div className="flex items-center justify-center h-screen bg-destructive/10 text-destructive">
            <h1 className="text-2xl font-semibold mb-2">Error loading project</h1>
            <p className="text-lg">{error}</p>
        </div>
    }
    return <Editor
        initialState={initialState ?? null}
        mode={mode}
        releaseLoading={releaseLoading}
        isLoading={loading}
    />
}