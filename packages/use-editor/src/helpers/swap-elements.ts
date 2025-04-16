export const swapElements = <T>(arr: T[], i1: number, i2: number) => {
    [arr[i1], arr[i2]] = [arr[i2], arr[i1]];
}