import { useRef, useState } from "react";

type FileType =
    | "png"
    | "jpeg"
    | "jpg"
    | "svg"
    | "json"
    | "pdf"
    | "doc"
    | "docx"
    | "txt"
    | "csv";

type UseFilePickerProps = {
    maxSizeMB?: number;
    acceptedTypes?: FileType[];
    onGetFile?: (dataUrl: string, file: File) => void | Promise<void>;
};

const MIME_MAP: Record<FileType, string> = {
    png: "image/png",
    jpeg: "image/jpeg",
    jpg: "image/jpg",
    svg: "image/svg+xml",
    json: "application/json",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    txt: "text/plain",
    csv: "text/csv",
};

/**
 * @description:  A custom hook for handling  file picking and uploading.
 * @param {number} maxSizeMB - The maximum file size in MB.
 * @param {function} onGetFile - A callback function that is called with the file data URL.
 * @returns {object} - An object containing the file data URL, error message, and a function to trigger the file picker.
 */
export function useFilePicker({
    maxSizeMB = 5,
    acceptedTypes = ["png", "jpeg", "jpg", "svg", "json", "pdf", "docx"],
    onGetFile = () => { },
}: UseFilePickerProps = {}) {
    const [dataUrl, setDataUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const acceptedMimeTypes = acceptedTypes.map(type => MIME_MAP[type]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!acceptedMimeTypes.includes(file.type)) {
            setError(`Unsupported file type: ${file.type}`);
            return;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`File is too large. Max size is ${maxSizeMB}MB.`);
            return;
        }

        setError(null);
        const reader = new FileReader();
        reader.onload = async () => {
            const result = reader.result as string;
            setDataUrl(result);
            await onGetFile?.(result, file);
        };

        reader.readAsDataURL(file);
    };

    const onFilePickerClick = () => {
        inputRef.current?.click();
    };

    return {
        dataUrl,
        error,
        onFilePickerClick,
        InputElement: () => (
            <input
                ref={inputRef}
                type="file"
                accept={acceptedMimeTypes.join(", ")}
                className="hidden"
                onChange={handleFileChange}
            />
        ),
    };
}
