import { FabricObject, SerializedObjectProps } from 'fabric';

declare module "fabric" {

    interface FabricObject {
        id?: string;
        name?: string;
        zIndex?: number
    }
    interface SerializedObjectProps {
        id?: string;
        name?: string;
        zIndex?: number;
    }
}