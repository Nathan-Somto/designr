export type UploadedImage ={
    id: string;
    url: string;
}
//Todo: refactor this to types package
export type CanvasData = {
    json: string;
    height: number;
    width: number;
    thumbnail: string;
}
// all marked as optional till the package is fully developed.
export type AppProps = {
    userId?: string; // currently logged in user id
    appLogo?: string;
    initialData?: CanvasData;
    onUploadImage?: (file: File) => Promise<UploadedImage>;
    onLoadUnsplashImages?: () => Promise<string[]>;
    onProFeatureClick?: () => void;
    onSaveCallback?: (userId: string, data:CanvasData) => void;
    onPublishTemplate?: (userId: string, data: CanvasData) => void;
    loadTemplates?: () => Promise<CanvasData[]>; // gets all templates
    onGenerateImageClick?:(userId?: string, prompt: string) =>  Promise<string>; // generates image from prompt
}