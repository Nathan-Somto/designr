export function randomPosition({
    height,
    width
}: {
    height?: number,
    width?: number
}) {
    if (!height || !width) return {
        top: 0,
        left: 0
    }
    return {
        top: Math.random() * (height),
        left: Math.random() * (width),
    };
}