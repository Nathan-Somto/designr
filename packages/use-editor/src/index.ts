import useEditor from "./hooks/use-editor";
export * from "./types";
// get the return type of editor that is returned from useEditor
type UseEditorReturnType = ReturnType<typeof useEditor>;
type Editor = UseEditorReturnType["editor"];
export {
    useEditor
};
export type { Editor };

