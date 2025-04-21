import { Button } from "@designr/ui/components/button";
import { StarIcon } from "lucide-react";
type Props = {
    isStarred: boolean;
    onToggle: () => void;
}
export default function StarButton({ isStarred, onToggle }: Props) {
    return (
        <Button
            onClick={onToggle}
            size="icon"
            variant="ghost"
            className={isStarred ? "text-yellow-500 hover:text-yellow-500" : "text-muted-foreground hover:text-muted-foreground"}
        >
            <StarIcon className="size-4" fill={isStarred ? "currentColor" : "none"} />
        </Button>
    )
};