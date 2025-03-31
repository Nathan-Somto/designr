import { Popover, PopoverContent, PopoverTrigger } from "@designr/ui/components/popover";
import { formatEditorGradientToCSS } from "./format-editor-gradient-to-css";
import { EditorGradient } from "@designr/use-editor";
import { ObjectLike } from "#/features/editor/types";
import { EditorColorInputPopoverContent } from "./popover-content";
import Hint from "@designr/ui/components/hint";
interface EditorColorInputProps<O extends ObjectLike> {
    action: string;
    value: string | EditorGradient;
    supportsGradient?: boolean;
    config: O;
    onChange: (newValue: string | EditorGradient) => void;

}
function EditorColorInput<O extends ObjectLike>({
    action,
    value,
    config,
    supportsGradient,
    onChange
}: EditorColorInputProps<O>) {
    console.log("config", config);
    return (
        <Popover>
            <Hint
                label={action}
                className="z-[50000]"
            >
                <div className="flex bg-transparent text-muted-foreground focus-within:text-primary/70 focus-visible:text-primary/70 
                    items-center border-transparent border hover:border-muted-foreground rounded-md px-2 py-1 
                    focus-within:bg-primary/30 focus-within:border-primary focus-visible:border-primary transition">
                    {/* Color Preview Button */}
                    <PopoverTrigger asChild>
                        <button className="w-6 h-6 rounded-md"
                            style={{ background: typeof value === "string" ? value : formatEditorGradientToCSS(value) }}
                        />
                    </PopoverTrigger>
                    <span className="ml-2 text-xs">{typeof value === 'string' ? value : 'Linear'}</span>
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
                        onChange(newColor);
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}
export default EditorColorInput;
