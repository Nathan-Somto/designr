import { EditorGradientDirection } from "@designr/use-editor";

const GRADIENT_DIRECTIONS: { label: string; value: EditorGradientDirection }[] = [
    { label: "→", value: "to right" },
    { label: "←", value: "to left" },
    { label: "↑", value: "to top" },
    { label: "↓", value: "to bottom" },
    { label: "↗", value: "to top-right" },
    { label: "↖", value: "to top-left" },
    { label: "↘", value: "to bottom-right" },
    { label: "↙", value: "to bottom-left" }
];
export {
    GRADIENT_DIRECTIONS
}