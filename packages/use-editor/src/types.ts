import fabric, { FabricObject, FabricObjectProps, ObjectEvents, SerializedObjectProps } from 'fabric'
type UseEditorProps = {
    filename?: Readonly<string>
    initialDimensions?: {
        width: number
        height: number
    }
    intialState?: string // JSON string
    onSaveCallback?: (
        value: {
            width: number
            height: number
            state: string
        }
    ) => void
    backgroundColor?: string
    workspaceColor?: string
    updateContextMenuPosition?: (position: { x: number, y: number }) => void
}
type CanvasAction = 'Select' | 'Text' | 'Image' | 'Rectangle' | 'Circle' | 'Triangle' | 'Diamond' | 'Drawing' | 'Star' | 'Line' | 'Undo' | 'Redo' | 'Clear' | "Translating" | "Rotating" | "Selection"
type UseLoadCanvasStateProps = {
    canvas: fabric.Canvas | null
    state: string | null
    initCanvasHistory: (state: string) => void
    autoZoomToFit: () => void
}
type CanvasHelpersProps = {
    canvas: fabric.Canvas
    filename?: Readonly<string>
    setZoom?: (value: number) => void
}
type TextConfig = {
    fontSize: number;
    fontWeight: string;
    fontFamily: string;
    lineHeight: number;
    value: string;
}
type FabricFilterType =
    | "greyscale"
    | "polaroid"
    | "sepia"
    | "kodachrome"
    | "contrast"
    | "brightness"
    | "brownie"
    | "vintage"
    | "technicolor"
    | "pixelate"
    | "invert"
    | "blur"
    | "sharpen"
    | "emboss"
    | "removecolor"
    | "blacknwhite"
    | "vibrance"
    | "blendcolor"
    | "huerotate"
    | "resize"
    | "gamma"
    | "saturation";

type SelectedObject = {
    object: FabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents>;
    width?: number;
    height?: number;
    diameter?: number;
    fontFamily?: string;
    fontWeight?: string;
    fontSize?: number;
    fontStyle?: 'normal' | 'italic' | 'oblique';
    textDecoration?: 'underline' | 'line-through' | 'none';
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
    letterSpacing?: number;
    lineHeight?: number;
    fill: string;
    filter?: FabricFilterType;
    cornerSize: number;
    'shadow.color'?: string;
    'shadow.blur'?: number;
    'shadow.offsetX'?: number;
    'shadow.offsetY'?: number;
    opacity?: number;
    x?: number;
    angle?: number;
    y?: number;
}
type SelectedObjectProps = keyof SelectedObject
type UseCanvasEventsProps = {
    canvas: fabric.Canvas | null
    onObjectsSelection?: (target: (SelectedObject['object'])[], renderCanvas: boolean) => void
    onObjectsDeselection?: () => void
    onSave?: (value: string) => void
    onObjectModified?: (target: fabric.FabricObject[]) => void
    onClear?: () => void
    updateAction: (value: CanvasAction) => void
}
type UseKeyboardShortcutsProps = {
    canvas: fabric.Canvas | null
    clearActiveObjects?: () => void
    duplicateActiveObject?: () => void
    groupActiveObjects?: () => void
    ungroupActiveObject?: () => void
    sendToBack?: () => void
    bringToFront?: () => void
    selectAllObjects?: () => void
    redo: () => void
    undo: () => void
    copy: () => void
    paste: () => void
    zoomChange?: (direction: ZoomDirection) => void
}
type UseLayersProps = {
    canvas: fabric.Canvas | null
}
type Layers = {
    id: string
    zIndex: number
    type: string
    children?: Layers[]
    isVisibile?: boolean
    isLocked?: boolean
}
type UseHistoryProps = {
    canvas: fabric.Canvas | null
    onSaveCallback?: UseEditorProps['onSaveCallback']
}
type ZoomDirection = '+' | '-';
type ZoomValue = '50%' | '100%' | '200%' | 'fit';
export type {
    CanvasAction,
    UseEditorProps,
    UseLoadCanvasStateProps,
    CanvasHelpersProps,
    TextConfig,
    SelectedObject,
    SelectedObjectProps,
    FabricFilterType,
    UseCanvasEventsProps,
    UseKeyboardShortcutsProps,
    UseLayersProps,
    Layers,
    UseHistoryProps,
    ZoomDirection,
    ZoomValue
}