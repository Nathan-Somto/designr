import { FabricObject, FabricObjectProps, ObjectEvents, SerializedObjectProps } from 'fabric'
export interface SelectedObject {
    object: FabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents>;
    width?: number;
    height?: number;
    diameter?: number;
    fontFamily?: string;
    fontWeight?: string;
    fontSize?: number;
    fontStyle?: 'normal' | 'italic' | 'oblique';
    textDecoration?: 'underline' | 'line-through'  | 'none';
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
    letterSpacing?: number;
    lineHeight?: number;
    fill: string;
    filter?: string;
    cornerSize: number;
    'shadow.color'?: string;
    'shadow.blur'?: number;
    'shadow.offsetX'?: number;
    'shadow.offsetY'?: number;
    opacity?: number;
    x?: number;
    angle?: number;
    y?: number;
};
type NonObjectKeys<T> = {
    [K in keyof T]: T[K] extends object ? never : K;
}[keyof T];
export interface SettingsProps {
    selectedObject: SelectedObject | null;
    handleObjectSelection: (target: SelectedObject["object"], renderCanvas?: boolean) => void
}
export interface InputProps {
    type: "string" | "int" | "float";
    label: string;
    Icon: () => JSX.Element;
    value: string | number;
}
export interface TextButtons {
    label: string;
    options: {
        Icon: () => JSX.Element;
        action: string;
        config: Record<string, string | number>;
    }[];
}
export interface TextOptions {
    label: string;
    options: string[];
}
export type ObjectLike = Omit<object, 'symbol'>;
interface BaseProps<T extends ObjectLike> {
    selectedObject: T
    handleChange: (property: string, value: string | number) => void,
    selectedObjectProp: Exclude<NonObjectKeys<T>, undefined>
}
export interface RenderButtonsProps<T extends ObjectLike> extends BaseProps<T>, TextButtons { }
export interface RenderSelectProps<T extends ObjectLike> extends BaseProps<T>, TextOptions { 
    useCustomValues?:boolean,
    values?: string[]
}
export interface RenderInputProps<T extends ObjectLike> extends BaseProps<T>, InputProps {
    width?: 'full' | 'half' | 'sm'
    showLabel?: boolean
}
type newType = Exclude<NonObjectKeys<SelectedObject>, undefined>