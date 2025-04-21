import { CrownIcon } from "lucide-react";

export default function ProBadge() {
    return <div className="flex items-center gap-1 text-yellow-500 text-xs  bg-yellow-500/10 rounded-md px-2 py-1 backdrop-blur-sm">
        <CrownIcon className="size-3.5" />
        <span className="font-medium">Pro</span>
    </div>
};