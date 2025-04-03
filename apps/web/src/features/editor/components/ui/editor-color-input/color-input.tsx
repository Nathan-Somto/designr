import { Popover, PopoverContent, PopoverTrigger } from "@designr/ui/components/popover";
import { formatEditorGradientToCSS } from "./format-editor-gradient-to-css";
import { EditorGradient } from "@designr/use-editor";
import { EditorColorInputPopoverContent } from "./popover-content";
import Hint from "@designr/ui/components/hint";
import { cn } from "@designr/ui/lib/utils";
interface EditorColorInputProps {
    action: string;
    value: string | EditorGradient;
    supportsGradient?: boolean;
    property: string;
    // eslint-disable-next-line no-unused-vars
    onChange: (key: string, newValue: string | EditorGradient) => void;
    className?: string;

}
function EditorColorInput({
    action,
    value,
    property,
    supportsGradient,
    onChange,
    className
}: EditorColorInputProps) {
    return (
        <Popover>
            <Hint
                label={action}
                className="z-[50000]"
            >
                <div className={cn(`flex bg-transparent text-muted-foreground overflow-hidden focus-within:text-primary/70 focus-visible:text-primary/70 
                    items-center border-transparent border hover:border-muted-foreground rounded-md px-2 py-1 
                    focus-within:bg-primary/30 relative focus-within:border-primary focus-visible:border-primary transition`, className)}>
                    {/* Color Preview Button */}
                    <PopoverTrigger asChild>
                        <button className="size-[18px] absolute left-2 border-muted border-2 rounded-md flex-shrink-0"
                            style={{ background: typeof value === "string" ? value : formatEditorGradientToCSS(value) }}
                        />
                    </PopoverTrigger>
                    <input contentEditable={false} value={
                        typeof value === 'string' ? value : 'Linear'
                    } className="ml-[26px] text-xs outline-none bg-transparent" />
                </div>
            </Hint>

            {/* Popover Content */}
            <PopoverContent
                className="z-[2000]"
                align="center"
                side="left"
                sideOffset={32}
            >
                <EditorColorInputPopoverContent
                    value={value}
                    supportsGradient={supportsGradient}
                    onChange={(newColor) => {
                        onChange(property, newColor);
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}
export default EditorColorInput;
