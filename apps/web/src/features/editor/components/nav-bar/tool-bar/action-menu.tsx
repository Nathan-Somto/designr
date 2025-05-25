import { Button } from '@designr/ui/components/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator } from '@designr/ui/components/dropdown-menu'
import { ChevronDownIcon } from 'lucide-react'
import { actionMenuItems } from '../data'
import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { LINKS } from '#/constants/links'
import { createANewProject } from '#/services/projects'
import { useSettings } from '#/features/settings/settings-provider'
import { userSettingsDefaults } from '@designr/db/user-settings'
import { promiseCatch } from '#/utils/promise-catch'
import { toast } from 'sonner'
import { handleProjectRedirect } from '#/utils/handle-project-redirect'
type Action = typeof actionMenuItems[number]['action']
export default function ActionMenu() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition()
    const { settings } = useSettings();
    const handleAction = async (
        action: Action
    ) => {
        switch (action) {
            case 'new':
                // executes new a project action
                startTransition(async () => {
                    const date = new Date();
                    const formattedDate = date.toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    }).replace(/\//g, '-');
                    const res = await promiseCatch(createANewProject({
                        height: settings?.defaultHeight ?? userSettingsDefaults?.defaultHeight,
                        width: settings?.defaultWidth ?? userSettingsDefaults?.defaultWidth,
                        name: `Untitled (${formattedDate})`
                    }))
                    if (res === undefined) {
                        toast.error('Failed to Create project');
                    }
                    if (res?.type === 'error') {
                        toast.error(res.message);
                        return;
                    }
                    handleProjectRedirect({
                        openInNewTab: settings?.openDesignsInNewTab ?? false,
                        organizationId: res?.organizationId ?? '',
                        projectId: res?.id ?? ''
                    })
                })
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
                    disabled={isPending}
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
                className='ml-8 !z-[80] relative'
            >
                {actionMenuItems.map(({ Icon, action, label }, index) => (
                    <React.Fragment key={action}>
                        <Button
                            disabled={isPending}
                            variant={'selection'}
                            className='w-full justify-start text-xs font-medium'
                            onClick={async () => await handleAction(action)}
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
