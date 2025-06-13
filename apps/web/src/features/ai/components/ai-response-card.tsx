/* eslint-disable @next/next/no-img-element */
import { Button } from '@designr/ui/components/button';
import Hint from '@designr/ui/components/hint';
import { format } from 'date-fns';
import { DownloadIcon, CopyIcon, RefreshCcwIcon, CheckCircleIcon } from 'lucide-react';
import { AiActions, ImageGenerationPayload, Payload, TextToDesignPayload } from '../types';


type Props = {
    type: AiActions;
    data: ImageGenerationPayload | TextToDesignPayload;
    onUse: (payload: Payload) => Promise<void>
    onRegenerate: (prompt: string) => void;
    onDownload?: (imageUrl: string, contentType: "buffer" | "string") => void;
    onCopyJson?: (json: string) => Promise<void>;
};

export default function AiResponseCard({
    type,
    data,
    onUse,
    onRegenerate,
    onDownload,
    onCopyJson
}: Props) {
    const isImage = type === 'generate_image';
    const imageUrl = isImage
        ? (data as ImageGenerationPayload).secureImageUrl ??
        `data:image/png;base64,${(data as ImageGenerationPayload).imageBuffer}`
        : (data as TextToDesignPayload).pngPreview ?? '';
    const isBuffer = isImage ? (data as ImageGenerationPayload).secureImageUrl === undefined : false;
    return (
        <div className="flex w-full space-y-10 py-4 px-6">
            <div className="max-w-sm  flex flex-col items-start">
                <div className="rounded-lg px-4 py-2 bg-primary text-primary-foreground text-sm shadow-sm">
                    {data.prompt}
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                    {format(new Date(data.timestamp), 'PPpp')}
                </span>
            </div>

            <div className="flex-1 space-y-2 flex flex-col items-end">
                <div className="rounded-lg overflow-hidden border shadow-md bg-background p-2">
                    <img
                        src={imageUrl === '' ? 'https://placehold.co/320x320?text=No+Preview' : imageUrl}
                        alt="Generated preview"
                        className="rounded-md size-[320px] object-contain"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap justify-end">
                    <Hint
                        label="Regenerate the design with a new prompt."
                        className='!z-[99999999999999]'
                    >
                        <Button variant="ghost" size='icon' onClick={async () => onRegenerate(data.prompt)}>
                            <RefreshCcwIcon className='size-4' />
                        </Button>
                    </Hint>
                    <Hint
                        className='!z-[99999999999999]'
                        label={isImage ? "Use this image in your design." : "Use this generated design in your project."}
                    >
                        <Button variant={'ghost'} size='icon' onClick={async () => await onUse({
                            type,
                            content: isImage ? imageUrl : (data as TextToDesignPayload).json ?? ''
                        })}>
                            <CheckCircleIcon
                                className='size-4'
                            />
                        </Button>
                    </Hint>

                    {isImage ? (
                        <>

                            <Hint
                                className='!z-[99999999999999]'
                                label="Download the generated image."
                            >
                                <Button variant={'ghost'} size="icon" onClick={() => onDownload?.(imageUrl, isBuffer ? 'buffer' : 'string')}>
                                    <DownloadIcon className='size-4' />
                                </Button>
                            </Hint>
                        </>
                    ) : (
                        <>
                            <Hint
                                className='!z-[99999999999999]'
                                label="Copy the generated design JSON."
                            >
                                <Button variant={'ghost'} size='icon' onClick={async () => await onCopyJson?.((data as TextToDesignPayload).json ?? '')}>
                                    <CopyIcon className='size-4' />
                                </Button>
                            </Hint>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
