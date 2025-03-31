import { Button } from '@designr/ui/components/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuItem } from '@designr/ui/components/dropdown-menu'
import { ChevronDownIcon } from 'lucide-react'
import { actionMenuItems } from '../data'
import React from 'react'
import { useRouter } from 'next/navigation'
import { LINKS } from '#/constants/links'
type Action = typeof actionMenuItems[number]['action']
export default function ActionMenu() {
    const router = useRouter();
    const handleAction = (
        action: Action
    ) => {
        switch (action) {
            case 'new':
                // executes new file action
                break;
            case 'dashboard':
                router.push(LINKS.DASHBOARD)
                break;
            case 'template':
                // open a modal to load a template
                break;
            case 'issue':
                // open a new tab to report an issue (github issues)
                window.open(process.env.NEXT_PUBLIC_ISSUE_URL, '_blank')
                break;
        }
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={'selection'}
                    className='font-medium'
                    size='shrink'
                >
                    D
                    {/* on hover the chevron should go down a bit */}
                    <span>
                        <ChevronDownIcon
                            className={`
                            size-4 hover:translate-y-1
                            transition-transform
                            ease-out duration-200
                            `} />
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                sideOffset={10}
                align='end'
                alignOffset={10}
                className='ml-8'
            >
                {actionMenuItems.map(({ Icon, action, label }, index) => (
                    <React.Fragment key={action}>
                        <Button
                            variant={'selection'}
                            className='w-full justify-start text-xs font-medium'
                            onClick={() => handleAction(action)}
                        >
                            <Icon />
                            {label}
                        </Button>
                        {index < actionMenuItems.length - 1 && <DropdownMenuSeparator />}
                    </React.Fragment>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
