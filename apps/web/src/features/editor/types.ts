import { Editor, SelectedObject } from "@designr/use-editor"

type BaseEditorProps = {
    editor: Editor
}
type Access = 'self' | 'org' | 'public'
type EditorInputValue = 'int' | 'float' | 'color' | 'string'
//===These Types are used for data.tsx files in the settings-panel folder===//
interface ButtonSelect<K extends keyof SelectedObject> {
    label: string;
    options: {
        Icon: () => JSX.Element;
        action: string;
        config: {
            property: K;
            value: SelectedObject[K];
        };
    }[];
}
interface InputSelect<K extends keyof SelectedObject> {
    action: string;
    type: EditorInputValue;
    Icon: () => JSX.Element;
    config: Partial<{
        property: K;
        value: SelectedObject[K];
    }>;
}

interface SettingsSection<K extends keyof SelectedObject> {
    label: string;
    inputs: InputSelect<K>[];
}
interface OptionsSelect<K extends keyof SelectedObject> {
    action: string;
    type: string;
    Icon: () => JSX.Element;
    config: {
        property: K;
        value: SelectedObject[K];
    };
    options: ((SelectedObject[K])[]) | ({ label: string, value: SelectedObject[K] })[];
}
//===End====//
export type ObjectLike = Omit<object, 'symbol'>;
interface BaseEditorCompProps {
    editor: Editor
}
interface DragState {
    currentItemId: null | string;
    parentId: null | string;
    dropId: null | string;
    dropZIndex: number
}
export {
    type BaseEditorProps,
    type Access,
    type ButtonSelect,
    type InputSelect,
    type SettingsSection,
    type OptionsSelect,
    type EditorInputValue,
    type BaseEditorCompProps,
    type DragState
}