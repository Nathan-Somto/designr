export const isUppercase = (str: string) => {
    return str === str.toUpperCase();
}
export const isLowercase = (str: string) => {
    return str === str.toLowerCase();
}
export const isCapitalized = (str: string) => {
    // handle spaces
    const words = str.split(' ')
    return words.every((word) => {
        return word.charAt(0).toUpperCase() === word.charAt(0);
    });
}
export const toCapitalize = (str: string) => {
    return str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}