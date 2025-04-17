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
    updateContextMenuPosition?: (position: { x: number, y: number } | null) => void
}
type CanvasAction = 'SoftRect' | 'Select' | 'Text' | 'Image' | 'Rectangle' | 'Circle' | 'Triangle' | 'Diamond' | 'Drawing' | 'Star' | 'Line' | 'Undo' | 'Redo' | 'Clear' | "Translating" | "Rotating" | "Selection"
type UseLoadCanvasStateProps = {
    canvas: fabric.Canvas | null
    state: string | null
    initCanvasHistory: (state: string) => void
    autoZoomToFit: () => void
}
interface Workspace extends fabric.Rect<{
    width: number;
    height: number;
    fill: string;
    selectable: false;
    rx: number;
    ry: number;
    strokeWidth: number;
    stroke: string;
    shadow: fabric.Shadow;
}, fabric.SerializedRectProps, fabric.ObjectEvents> {
    name: string;
    gridIsActive: boolean;
    gridHorizontal: number;
    gridVertical: number;

}
type CanvasHelpersProps = {
    canvas: fabric.Canvas
    filename?: Readonly<string>
    setZoom?: (value: number) => void
    updateAction: (value: CanvasAction) => void
}
type TextConfig = {
    fontSize: number;
    fontWeight: string;
    fontFamily: string;
    lineHeight: number;
    value: string;
}
type FabricFilterType =
    | "none"
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
type Alignment = 'left' | 'right' | 'top' | 'bottom' | 'centerH' | 'centerV' | 'center' | 'none'
type EditorGradientDirection =
    | 'to right'
    | 'to left'
    | 'to top'
    | 'to bottom'
    | 'to top-right'
    | 'to top-left'
    | 'to bottom-right'
    | 'to bottom-left';

interface EditorGradient<k = 'linear'> {
    type: k;
    direction: EditorGradientDirection;
    colors: { offset: number; color: string }[];
}
type BorderStyle = 'solid' | 'dashed' | 'groove' | 'double' | 'custom' | 'dotted'
type SelectedObject = {
    object: FabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents>;
    width?: number;
    height?: number;
    diameter?: number;
    fontFamily?: string;
    fontWeight?: string | number;
    fontSize?: number;
    fontStyle?: 'normal' | 'italic' | 'oblique';
    textDecoration?: 'underline' | 'line-through' | 'none' | 'strike-through';
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
    letterSpacing?: number;
    lineHeight?: number;
    fill: string | EditorGradient;
    filter?: FabricFilterType;
    cornerSize?: number;
    'shadow.color'?: string;
    'shadow.blur'?: number;
    'shadow.offsetX'?: number;
    'shadow.offsetY'?: number;
    opacity?: number;
    x?: number;
    angle?: number;
    y?: number;
    strokeColor?: string;
    strokeWidth?: number;
    align: Alignment;
    skewX?: number;
    skewY?: number;
    scaleX?: number;
    scaleY?: number;
    borderStyle?: BorderStyle
}
type SelectedObjectProps = keyof SelectedObject
type UseSelectionProps = {
    canvas: fabric.Canvas | null;
    getAlignment?: (object: fabric.Object, canvas: fabric.Canvas) => Alignment;
    formatLinearGradient?: (fill: fabric.Gradient<'linear'>) => EditorGradient;
    applyLinearGradient?: (fill: EditorGradient) => fabric.Gradient<'linear'>;
    alignObject?: (object: fabric.Object, alignment: Alignment) => void;
    updateImageFilter?: ((selectedObjects: SelectedObject, value: FabricFilterType) => void)
    setBorderStyle?: (selectedObject: SelectedObject, newStyle: Exclude<BorderStyle, "custom">) => void
    getBorderStyleFromDashArray?: (strokeDashArray: number[] | null | undefined) => BorderStyle
}
type UseCanvasEventsProps = {
    canvas: fabric.Canvas | null
    onObjectsSelection?: (target: (SelectedObject['object'])[], renderCanvas: boolean) => void
    onObjectsDeselection?: () => void
    onSave?: () => void
    onObjectModified?: (target: fabric.FabricObject[]) => void
    onClear?: () => void
    updateAction: (value: CanvasAction) => void
    menuRef: React.RefObject<HTMLDivElement>
    updateContextMenuPosition: (position: { x: number, y: number } | null) => void
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
    getType: (object: fabric.Object) => string | null
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
type ExportOptions = {
    filename?: string;
    quality?: number;
    multiplier?: number;
    includeGrids?: boolean;
};

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
    ZoomValue,
    Alignment,
    EditorGradient,
    EditorGradientDirection,
    UseSelectionProps,
    BorderStyle,
    Workspace,
    ExportOptions
}