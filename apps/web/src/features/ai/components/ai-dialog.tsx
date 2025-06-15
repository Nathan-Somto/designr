import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@designr/ui/components/dialog';
import { ScrollArea } from '@designr/ui/components/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@designr/ui/components/tabs';
import { ImageIcon, LayoutDashboardIcon, SparklesIcon } from 'lucide-react';
import React from 'react'
import MessageInput from './message-input';
import { toast } from 'sonner';
import AiResponseCard from './ai-response-card';
import { v4 } from 'uuid';
import { AiActions, ImageGenerationPayload, Payload, TextToDesignPayload } from '../types';
import SuggestionGrid from './suggestion-grid';
import { imageGenerationPrompts, textToDesignPrompts } from '../data';
import { z } from 'zod';
import { AI_ACTIONS } from '#/constants/ai-actions';
import baseDesign from './base-design.json';
import { uploadImageToCloudinary } from '#/services/cloudinary';
import { saveUserMedia } from '#/services/projects';
import { useEditorStore } from '#/features/editor/hooks/useEditorStore';
import { authClient } from '@designr/auth/client';
import { Loader } from 'lucide-react';
import { ProOnlyMessageWall } from '#/components/sidebar/pro-status';
import { EventBus } from '#/utils/event-bus';
import { UserMedia } from '#/hooks/useUserMedia';
import { USER_MEDIA_EVENT } from '#/constants/events';
type ActiveTab = AiActions;
type Props = {
    onUse: (payload: Payload) => Promise<void>;
    onOpenChange: (open: boolean) => void;
    openProp?: boolean;
}
export default function AiDialog({
    onUse,
    onOpenChange,
    openProp: open,
}: Props) {
    const { data, isPending: isCheckingUserSession } = authClient.useSession();
    const { editor } = useEditorStore();
    const [activeTab, setActiveTab] = React.useState<ActiveTab>('text_to_design');
    const [imageGenMessages, setImageGenMessages] = React.useState<ImageGenerationPayload[]>([]);
    const [designGenMessages, setDesignGenMessages] = React.useState<TextToDesignPayload[]>([]);
    const [isPending, startTransition] = React.useTransition();
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const handleUse = React.useCallback(async (payload: Payload) => {
        await onUse(payload);
        onOpenChange(false);
    }, [editor])
    function handleDownload(url: string, filename: string = 'ai_output.png') {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    }
    const onDownload = (imageUrl: string, contentType: 'buffer' | 'string') => {
        const url =
            contentType === 'string' ? imageUrl :
                `data:image/png;base64,${imageUrl}`;
        handleDownload(url);
    };
    const onCopyJson = async (json: string) => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(json, null, 2));
            toast.success('Copied JSON to clipboard!');
        } catch {
            toast.error('Failed to copy.');
        }
    };
    const handleGenerate = React.useCallback(async (prompt: string, type: AiActions) => {
        if (prompt.trim() === '') return;
        let top = 26;
        let left = 415;
        let data;
        startTransition(async () => {
            if (canvasRef.current === null) return;
            if (editor === null) return;
            try {
                switch (type) {
                    case 'generate_image':
                        data = {
                            height: 1024,
                            width: 1024,
                            prompt: prompt.trim(),
                            negative_prompt: '',
                        } satisfies z.infer<typeof AI_ACTIONS['generate_image']['schema']>;
                        break;
                    case 'text_to_design':
                        data = {
                            prompt: `
    You are a JSON-generating assistant. The JSON you generate must be **fully compatible with Fabric.js**. 
    Instructions:
    - Output only a single JSON object with one property: "objects", which is an array.
    - Do not include other Fabric properties like "version" or "background".
    - All elements must be offset using: top: ${top} and left: ${left}.
    - If any image is used, use a placeholder from https://placehold.co/.
    - Each object inside the "objects" array must contain exactly the following properties:
      - type =  "Group" | "Circle" | "Rect" | "Triangle" | "Image" | "Textbox" | "Polygon" | "Rect"
      - left
      - top
      - width
      - height
      - fill
      - stroke
      - strokeWidth
      - scaleX
      - scaleY
      - angle
      - opacity
      - objects of type = "Textbox" must contain a text field.
      - objects of type = "Image" must contain a src field. 
    Base your generation on the following user prompt:
    ${prompt.trim()}`.trim(),
                            version: 'latest',
                        } satisfies z.infer<typeof AI_ACTIONS['text_to_design']['schema']>;
                        break;
                }

                const res = await fetch(`/api/ai/${type}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`AI request failed: ${errorText}`);
                }

                const response = await res.json();
                console.log("the response  from AI:", response);
                if (response.type !== 'success') {
                    throw new Error('AI did not return a successful response.');
                }

                if (response.contentType === 'application/json') {
                    const parsed = typeof response.result === 'string' ? JSON.parse(response.result) : response.result;
                    if (!parsed.objects || !Array.isArray(parsed.objects)) {
                        throw new Error('Invalid JSON structure: expected an object with an "objects" array.');
                    }
                    const jsonData = {
                        ...baseDesign,
                        objects: [
                            ...baseDesign.objects,
                            ...parsed.objects
                        ],
                    };
                    console.log("the json data: ", jsonData);
                    const pngPreview = await editor.loadJsonAndExportAsPNG(JSON.stringify(jsonData), canvasRef.current)
                    setDesignGenMessages(prev => [
                        ...prev,
                        {
                            prompt,
                            json: JSON.stringify(jsonData, null, 2),
                            timestamp: new Date(),
                            pngPreview: pngPreview ?? '',
                        },
                    ]);
                }

                if (response.contentType === 'image/png') {
                    let imageBuffer = response.result as string;
                    //console.log("the result:", response);

                    //console.log("the buffer: ", imageBuffer);
                    const formData = new FormData();
                    // append the data 
                    imageBuffer = `data:image/png;base64,${imageBuffer}`;
                    formData.set('file', imageBuffer);
                    const secureImageUrl = await uploadImageToCloudinary(formData);
                    if (typeof secureImageUrl != 'string') throw new Error('Cloudinary upload failed.');

                    setImageGenMessages(prev => [
                        ...prev,
                        {
                            prompt,
                            secureImageUrl,
                            imageBuffer,
                            timestamp: new Date(),
                        },
                    ]);
                    const res = await saveUserMedia([
                        {
                            mediaType: 'IMG',
                            url: secureImageUrl
                        }
                    ]);
                    // Emit the event with the user media data from the ai.
                    EventBus.emit<{
                        userMedia: UserMedia
                    }>(USER_MEDIA_EVENT, {
                        userMedia: {
                            id: res.data[0].id,
                            mediaType: 'IMG',
                            url: secureImageUrl
                        }
                    })
                }
            } catch (err: any) {
                console.log(err);
                toast.error(err.message || 'Something went wrong during generation');
            }
        })
    }, [editor]);
    const handleRegenerate = async (prompt: string) => {
        // edit the prompt to contain a note that this is a regeneration.
        if (!prompt) return;
        // let it be detailed and clear that this is a regeneration.
        const newPrompt = `${prompt.trim()}\n\nThis is a regeneration of the previous design. Please ensure the design is unique and creative.`;
        handleGenerate(newPrompt, activeTab);

    }
    const handleSuggestionClick = async (suggestion: string) => {
        if (!suggestion) return;
        const prompt = suggestion.trim();
        if (prompt === '') return;
        handleGenerate(prompt, activeTab);
    }
    //console.log("designGenMessages:", designGenMessages);
    //console.log("editor: ", editor);
    //console.log("is pro: ", data?.user.isPro)
    return (
        <Dialog
            modal={false}
            open={open}
            onOpenChange={(open) => {
                onOpenChange(open);
            }}>
            <DialogContent className="!w-screen !max-w-none  h-screen overlfow-hidden z-[6000] p-0 [&>button]:!z-[80]">
                <canvas
                    ref={canvasRef}
                    className='hidden size-0' />
                {
                    isCheckingUserSession ?
                        <div className="flex items-center justify-center bg-white/10 backdrop-blur-sm  h-full w-full absolute inset-0">
                            <Loader className="size-8 animate-spin text-primary" />
                            <span className="ml-2 text-lg">Checking your subscription status...</span>
                        </div>
                        : (
                            <>
                                <Tabs
                                    value={activeTab}
                                    orientation="vertical"
                                    onValueChange={(value) => {
                                        setActiveTab(value as ActiveTab);
                                    }}
                                    className="grid grid-cols-[200px_1fr] h-full">
                                    <TabsList aria-orientation="vertical" className="flex-col gap-y-4 px-2 py-6 border-r h-screen justify-start ">
                                        <TabsTrigger value="text_to_design" className="w-full justify-start">
                                            <LayoutDashboardIcon className='size-4 mr-2 flex-shrink-0' />
                                            Text to Design
                                        </TabsTrigger>
                                        <TabsTrigger value={"generate_image" as ActiveTab} className='w-full justify-start'>
                                            <ImageIcon className='size-4 mr-2 flex-shrink-0' />
                                            Image Generation
                                        </TabsTrigger>
                                    </TabsList>

                                    <ScrollArea className="px-0 py-3 relative h-[90vh]">
                                        <DialogHeader
                                            className='fixed !flex-row top-0 backdrop-blur-sm bg-white/10 z-5 border-b h-12 items-center px-6 ml-[200px]  w-[calc(100%-200px)] inset-x-0'
                                        >
                                            <SparklesIcon className="size-[16px] text-[#5b4dc5] fill-[#5b4dc5] mr-2" />
                                            <DialogTitle className="text-base font-semibold">
                                                Designr AI
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="h-16" />
                                        <TabsContent value="text_to_design">
                                            {
                                                designGenMessages.length > 0 ? (
                                                    designGenMessages.map(item => (
                                                        <AiResponseCard
                                                            type='text_to_design'
                                                            key={v4()}
                                                            onUse={handleUse}
                                                            onRegenerate={handleRegenerate}
                                                            onCopyJson={onCopyJson}
                                                            data={{ ...item }}
                                                        />
                                                    ))
                                                ) : (
                                                    <SuggestionGrid
                                                        data={textToDesignPrompts}
                                                        onSelect={handleSuggestionClick}
                                                        isPending={isPending}
                                                    />
                                                )
                                            }
                                        </TabsContent>
                                        <TabsContent value={"generate_image" as ActiveTab}>
                                            {
                                                imageGenMessages.length > 0 ? (
                                                    imageGenMessages.map(item => (
                                                        <AiResponseCard
                                                            type='generate_image'
                                                            key={v4()}
                                                            onUse={onUse}
                                                            onRegenerate={() => { }}
                                                            onCopyJson={onCopyJson}
                                                            onDownload={(url) => onDownload(url, 'buffer')}
                                                            data={{ ...item }}
                                                        />
                                                    ))
                                                ) : (
                                                    <SuggestionGrid
                                                        data={imageGenerationPrompts}
                                                        onSelect={handleSuggestionClick}
                                                        isPending={isPending}
                                                    />
                                                )
                                            }
                                        </TabsContent>
                                        <div className='h-24' />
                                        <MessageInput
                                            type={activeTab}
                                            placeholder={
                                                activeTab === 'text_to_design' ? 'Describe your design...' : 'Describe the image you want to generate...'
                                            }
                                            isPending={isPending}
                                            onGenerate={handleGenerate}
                                        />
                                    </ScrollArea>
                                </Tabs>
                                {!data?.user.isPro && (
                                    <ProOnlyMessageWall />
                                )
                                }
                            </>
                        )
                }
            </DialogContent>
        </Dialog>

    )
}


