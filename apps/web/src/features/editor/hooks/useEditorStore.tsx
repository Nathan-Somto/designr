// a store to keep the editor state globallly accessible on initialization
// uses the context hook from react 19, useReducer hook as well.
// the main functions are setting the state, getting the state and deposing it.
import { Editor } from '@designr/use-editor';
import React from 'react';
const EditorContext = React.createContext<
    (State & { dispatch: Dispatch }) | null
>(null)
type State = {
    editor: Editor | null;
}
type Actions = {
    type: 'SET_EDITOR'
    payload: Editor;
} | {
    type: 'RESET_EDITOR'
}
type Dispatch = {
    setEditor: (editor: NonNullable<Editor>) => void;
    resetEditor: () => void;
}
function reducer(state: State, action: Actions): State {
    switch (action.type) {
        case 'SET_EDITOR':
            return { ...state, editor: action.payload };
        case 'RESET_EDITOR':
            return { ...state, editor: null };
        default:
            throw new Error(`Unhandled action type: ${action}`);
    }
}
export function EditorProvider({
    children
}: React.PropsWithChildren) {
    const [state, dispatch] = React.useReducer(reducer, {
        editor: null
    })
    const values = {
        editor: state.editor,
        dispatch: {
            setEditor: (editor: Editor) => {
                dispatch({ type: 'SET_EDITOR', payload: editor });
            },
            resetEditor: () => {
                dispatch({ type: 'RESET_EDITOR' });
            }
        }
    }

    return (
        <EditorContext.Provider value={values}>
            {
                children
            }
        </EditorContext.Provider>
    );
}
export function useEditorStore() {
    const ctx = React.useContext(EditorContext);
    if (!ctx) {
        throw new Error('useEditorStore must be used within an EditorProvider');
    }
    return ctx;
}