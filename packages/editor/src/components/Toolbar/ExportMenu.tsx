import { DropdownMenuTrigger, DropdownMenu, DropdownMenuItem, DropdownMenuContent } from '@repo/ui/components/dropdown-menu'
import { useCanvas } from '@/hooks/useCanvas';
import { exportMenu } from './data';
import ActionLabel from '@repo/ui/components/hint';
function ExportMenu() {
    const { canvas } = useCanvas();
    const createLink = (url: string, filename: string) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    }
    const handleAction = (action: typeof exportMenu['options'][number]['action']) => {
        switch (action) {
            case 'PNG': {
                const dataURL = canvas?.toDataURL({
                    format: 'png',
                    quality: 1,
                    multiplier: 2,
                });
                if (!dataURL) return;
                createLink(dataURL, 'canvas.png');
                break;
            }
            case 'JSON': {
                const data = JSON.stringify(canvas?.toDatalessJSON());
                createLink(`data:text/json;charset=utf-8,${encodeURIComponent(data)}`, 'canvas.json');
                break;
            }
            case 'SVG': {
                const data = canvas?.toSVG();
                if (!data) return;
                createLink(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(data)}`, 'canvas.svg');
                break;
            }
            default:
                break;
        }
    }
    return (
        <DropdownMenu>
            <ActionLabel label={exportMenu['label']}>
                <DropdownMenuTrigger asChild>
                    <button className="flex h-10 text-[15px] px-2 items-center justify-center gap-1.5 rounded-md transition-transform duration-200 hover:bg-blue-200 text-black">
                        {exportMenu.Icon()}
                    </button>
                </DropdownMenuTrigger>
            </ActionLabel>
            <DropdownMenuContent className='min-w-28 px-4 py-3' align='end'>
                {exportMenu['options'].map(({ label, Icon, description, action }) => (
                    <DropdownMenuItem
                        key={label}
                        onClick={() => handleAction(action)}
                        className='cursor-pointer hover:!bg-blue-50 hover:!text-black/70'
                    >
                        <Icon />
                        <div className='ml-2'>
                            <h3 className='text-[15.5px] leading-5 tracking-normal font-medium'>{label}</h3>
                            <p className='text-xs opacity-70'>{description}</p>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ExportMenu