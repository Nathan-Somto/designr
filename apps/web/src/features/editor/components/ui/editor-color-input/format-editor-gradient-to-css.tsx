import { EditorGradient } from "@designr/use-editor";

const formatEditorGradientToCSS = (gradient: EditorGradient): string => {
    const { direction, colors } = gradient;
    const colorStops = colors
        .map(({ color, offset }) => `${color} ${(offset / colors.length) * 100}%`)
        .join(", ");

    return `linear-gradient(${direction.replace('-', ' ')}, ${colorStops})`;
};
export { formatEditorGradientToCSS };