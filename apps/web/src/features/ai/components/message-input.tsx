import React from 'react'
import { Textarea } from '@designr/ui/components/textarea'
import { Button } from '@designr/ui/components/button'
import { SendHorizontalIcon, LoaderIcon } from 'lucide-react'
import { AiActions } from '../types'
type Props = {
    placeholder: string;
    onGenerate: (prompt: string, type: AiActions) => Promise<void>;
    type: AiActions;
    disabled?: boolean;
    isPending?: boolean;
}
export default function MessageInput({
    onGenerate,
    placeholder,
    type,
    isPending
}: Props) {
    // should be positioned at the bottom of its container and take full width.
    // for the text to design input there should be a small message underneath telling the user that the images generated will be placeholders.
    const [prompt, setPrompt] = React.useState('');
    const getWordCount = (text: string) => {
        return text.trim().split(/\s+/).filter(Boolean).length;
    };

    const wordCount = getWordCount(prompt);
    const maxWords = 2000;
    const isOverLimit = wordCount > maxWords;

    return (
        <div className=" absolute bottom-0 pb-3 w-[calc(100%-200px)] mx-auto inset-x-0">

            <div className="relative bg-background rounded-xl shadow-md">
                <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={placeholder}
                    className="w-full resize-none min-h-11 p-3 focus-visible:ring-0  pr-14 shadow-none outline-none rounded-md  text-sm border-none"
                    disabled={isOverLimit}
                    rows={3}
                    style={{ overflow: 'hidden' }}
                />
                <div className='flex justify-between pb-2 items-center px-2 mt-2.5'>
                    <div className="text-right text-xs text-muted-foreground">
                        {wordCount} / {maxWords} words
                    </div>
                    <Button
                        size="icon"
                        className=" rounded-full size-8"
                        disabled={isPending || prompt.trim() === '' || isOverLimit}
                        onClick={async () => {
                            await onGenerate(prompt, type);
                            setPrompt('');
                        }}
                    >
                        {isPending ? (
                            <LoaderIcon className="h-4 w-4 animate-spin" />
                        ) : (
                            <SendHorizontalIcon className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            {type === 'text_to_design' && (
                <p className="text-xs text-muted-foreground mt-2">
                    Images generated in the design will use placeholders from {' '}
                    <a href="https://placeholder.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">placeholder.com</a>.
                </p>
            )}
        </div>
    );

}
