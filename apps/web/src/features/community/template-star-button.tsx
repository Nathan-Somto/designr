import { Button } from "@designr/ui/components/button";
import { StarIcon } from "lucide-react";
type Props = {
    isStarred: boolean;
    onToggle: () => void;
    disabled: boolean
}
export default function StarButton({ isStarred, onToggle, disabled }: Props) {
    return (
        <Button
            onClick={onToggle}
            disabled={disabled}
            size="icon"
            variant="ghost"
            className={isStarred ? "text-yellow-400 hover:text-yellow-400" : "text-white/80 hover:text-white/80"}
        >
            <StarIcon className="size-4" fill={isStarred ? "currentColor" : "none"} />
        </Button>
    )
};