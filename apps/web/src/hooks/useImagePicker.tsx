import { useRef, useState } from "react";
type UseImagePickerProps = {
    maxSizeMB?: number;
    onGetImage?: ((image: string) => void) | ((image: string) => Promise<void>);
}
export function useImagePicker(props: UseImagePickerProps | void = {
    maxSizeMB: 5,
    onGetImage: () => { }
}) {
    const [dataUrl, setDataUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    if (typeof props !== 'object') {
        throw new Error('props must be an object')
    }
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const regex = /(png|jpeg|jpg|svg)$/i;
        // Check file type
        if (!regex.test(file.type)) {
            setError("Image should be in png, jpeg, jpg or svg format.");
            return;
        }

        // Check file size
        if (file.size > (props?.maxSizeMB ?? 5) * 1024 * 1024) {
            setError(`File is too large. Max size is ${props?.maxSizeMB ?? 0}MB.`);
            return;
        }

        setError(null);
        const reader = new FileReader();
        reader.onload = async () => {
            setDataUrl(reader.result as string)
            await props.onGetImage?.(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const onImagePickerClick = () => {
        inputRef.current?.click();
    };

    return {
        dataUrl,
        error,
        onImagePickerClick,
        InputElement: () => (
            <input
                ref={inputRef}
                type="file"
                /* accept the image file types we are testing for */
                accept="image/png, image/jpeg, image/jpg, image/svg"
                className="hidden"
                onChange={handleFileChange}
            />
        ),
    };
}
