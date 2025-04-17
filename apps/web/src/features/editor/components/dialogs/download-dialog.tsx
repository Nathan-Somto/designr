import { Button } from '@designr/ui/components/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@designr/ui/components/dialog';
import { Divider } from '@designr/ui/components/divider';
import { XIcon } from 'lucide-react';
import React from 'react';
import { downloadOptions } from '../nav-bar/data';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@designr/ui/components/dropdown-menu';
import { cn } from '@designr/ui/lib/utils';
import { Slider } from '@designr/ui/components/slider';
import { Switch } from '@designr/ui/components/switch';
import { EditorInput } from '../ui/editor-input';
import { BaseEditorCompProps } from '../../types';

type Action = typeof downloadOptions.options[number]['action']
interface Props extends BaseEditorCompProps {
    openProp: boolean;
    // eslint-disable-next-line no-unused-vars
    onOpenChange: (open: boolean) => void;
}

export default function DownloadDialog({
    openProp,
    onOpenChange,
    editor,
}: Props) {
    const [index, setIndex] = React.useState(0);
    const [scale, setScale] = React.useState(1);
    const [quality, setQuality] = React.useState(80);
    const [prettify, setPrettify] = React.useState(false);
    const [isPending, startTransition] = React.useTransition();
    const { Icon, label, action } = downloadOptions.options[index];

    const workspace = editor?.getWorkSpaceProperties();
    const width = workspace?.width || 0;
    const height = workspace?.height || 0;
    const scaledWidth = (width * scale).toFixed(0);
    const scaledHeight = (height * scale).toFixed(0);

    const qualityValue = () => {
        if (quality > 0 && quality <= 45) return 'Small'
        if (quality >= 46 && quality <= 78) return 'Medium'
        return 'Large'
    };
    const handleDownloadAction = async (action: Action) => {
        switch (action) {
            case 'JSON':
                //! export the canvas to json
                await editor?.exportAsJSON({
                    prettifyJSON: prettify
                });
                break;
            case 'PNG':
                await editor?.exportAsPNG({
                    multiplier: scale,
                    quality
                })
                //! export the canvas to png
                break;
            case 'JPG':
                await editor?.exportAsJPG({
                    multiplier: scale,
                    quality
                })
                break;
            case 'SVG':
                //! export the canvas to svg
                await editor?.exportAsSVG({
                    height: scaledHeight,
                    width: scaledWidth
                })
                break;
        }
    }
    const onDownload = async (action: Action) => {
        console.log("clicked");
        startTransition(async () => {
            await handleDownloadAction(action);
        });
    };

    return (
        <Dialog open={openProp} onOpenChange={onOpenChange}>
            <DialogContent className='[&>button]:hidden px-0'>
                <DialogHeader className="flex px-5 !flex-row justify-between items-center space-y-0 space-x-0">
                    <DialogTitle className='text-lg font-semibold'>
                        Download
                    </DialogTitle>
                    <DialogClose>
                        <XIcon className="size-4 text-muted-foreground" />
                    </DialogClose>
                </DialogHeader>
                <Divider className='my-[0.15rem]' />
                <form className='px-6 w-full'>
                    <label className='text-sm font-medium mb-2 block'>
                        File type
                    </label>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className={cn("focus-visible:ring-transparent gap-x-2 text-sm capitalize h-10 w-full border-muted-foreground mb-5 [&>svg]:!size-5 !shadow-none flex bg-transparent text-muted-foreground focus-within:text-primary/70 focus-visible:text-primary/70 focus-within:bg-primary/30 focus-within:border-primary focus-visible:border-primary items-center border hover:border-muted-foreground rounded-md px-2 py-1 transition")}
                        >
                            <Icon />
                            <span className='uppercase'>{label}</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            sideOffset={10}
                            align='center'
                            className='z-[170] py-3 min-w-[300px] w-[80vw] mx-auto max-w-md !space-y-3'
                        >
                            {downloadOptions.options.map(({ Icon, action, label, description }, i) => (
                                <DropdownMenuItem asChild key={action} onSelect={() => setIndex(i)}>
                                    <Button
                                        variant='selection'
                                        className='w-full cursor-pointer [>svg]:!size-6 justify-start text-xs font-medium'
                                    >
                                        <Icon />
                                        <div className='ml-1.5'>
                                            <h3 className='font-semibold text-left text-sm mb-1'>{label}</h3>
                                            <p className='font-medium text-xs'>{description}</p>
                                        </div>
                                    </Button>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {
                        action !== 'JSON' && (
                            <>

                                {/* Size */}
                                <div className='mt-5'>
                                    <label className='text-sm font-medium mb-2 block'>
                                        Size <span className='inline-block -translate-y-1'>x</span> <span>({scale})</span>
                                    </label>
                                    <div className='flex items-center gap-x-4'>
                                        <Slider
                                            min={1}
                                            max={3}
                                            step={0.15}
                                            value={[scale]}
                                            onValueChange={([val]) => setScale(val)}
                                        />
                                        <EditorInput
                                            action='scale (1–3)'
                                            type='float'
                                            property='scale'
                                            value={scale}
                                            min={1}
                                            max={3}
                                            className='border-muted-foreground w-12 h-8'
                                            onChange={(_, val) => setScale(val as number)}
                                        />
                                    </div>
                                    <small className='text-muted-foreground text-xs'>
                                        {scaledWidth} × {scaledHeight}
                                    </small>
                                </div>
                                {action !== 'SVG' && (
                                    <div className='mt-4 space-y-2'>
                                        <label className='text-sm font-medium'>
                                            Quality
                                        </label>
                                        <div className='flex gap-x-4'>
                                            <Slider
                                                min={10}
                                                max={100}
                                                step={1}
                                                value={[quality]}
                                                onValueChange={([val]) => setQuality(val)}
                                            />
                                            <EditorInput
                                                action='quality'
                                                type='int'
                                                property='quality'
                                                value={quality}
                                                min={10}
                                                max={100}
                                                className='border-muted-foreground w-12 h-8'
                                                onChange={(_, val) => setQuality(val as number)}
                                            />
                                        </div>
                                        <small className='text-muted-foreground text-xs'>
                                            {qualityValue()}
                                        </small>
                                    </div>
                                )}
                            </>
                        )
                    }

                    {/* Prettify JSON */}
                    {action === 'JSON' && (
                        <div className='flex items-center mt-5 justify-between'>
                            <p className='text-sm font-medium'>
                                Prettify JSON <span className='text-muted-foreground'>(larger file size)</span>
                            </p>
                            <Switch checked={prettify} onCheckedChange={setPrettify} />
                        </div>
                    )}
                    <Button
                        type="button"
                        className="w-full mt-6"
                        onClick={async () => await onDownload(action)}
                        disabled={isPending}>
                        {isPending ? 'Downloading...' : 'Download'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
