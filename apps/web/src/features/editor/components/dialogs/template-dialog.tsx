import { ImageWithShimmer } from '#/components/image-with-shimmer';
import { UpgradeToProButton } from '#/components/sidebar/pro-status';
import ProBadge from '#/features/community/pro-badge';
import { TemplatesFilterBase } from '#/features/community/templates-filter';
import { ExternalProjectsData } from '#/hooks/useProjects';
import { PaginatedResponse } from '#/services';
import { fetchProjects, getTemplateForEditor } from '#/services/projects';
import { promiseCatch } from '#/utils/promise-catch';
import { authClient } from '@designr/auth/client';
import { Avatar, AvatarFallback, AvatarImage } from '@designr/ui/components/avatar';
import { Button } from '@designr/ui/components/button';
import { Dialog, DialogContent } from '@designr/ui/components/dialog';
import { ScrollArea } from '@designr/ui/components/scroll-area';
import { Tabs, TabsContent } from '@designr/ui/components/tabs';
import { cn } from '@designr/ui/lib/utils';
import { Editor } from '@designr/use-editor';
import { ChevronLeftIcon, Loader, UserIcon } from 'lucide-react';
import React from 'react'
interface Props {
    openProp: boolean;
    onOpenChange: (open: boolean) => void;
    defaultTab?: "templates";
    editor: Editor
    templatesCache: PaginatedResponse<ExternalProjectsData> | null,
    setTemplateCache: (data: PaginatedResponse<ExternalProjectsData>) => void;
}
export default function TemplateDialog({
    onOpenChange,
    openProp,
    editor,
    templatesCache,
    setTemplateCache
}: Props) {
    const { data, isPending: isFetchingSession, error: sessionError } = authClient.useSession();
    const [selectedTemplate, setSelectedTemplate] = React.useState<ExternalProjectsData | null>(null);
    const [activeTab, setActiveTab] = React.useState('templates');
    const [templates, setTemplates] = React.useState<ExternalProjectsData[]>([])
    const [filtered, setFiltered] = React.useState<ExternalProjectsData[] | null>(null)
    const [isPromising, startTransition] = React.useTransition()
    const [pageState, setPageState] = React.useState({
        page: 1,
        totalPages: 1
    })
    const [error, setError] = React.useState<null | string>('');
    const [isSelecting, setIsSelecting] = React.useState(false);
    const hasFetchedOnce = React.useRef(false);

    const handleTemplateDataFetch = async (templateId: string) => {
        const res = await promiseCatch(getTemplateForEditor(templateId))
        if (res === undefined) {
            setError("Failed to Load Template")
            return null;
        }
        if (res?.type === 'error') {
            setError(res.message)
            return null;
        }
        return res.template.data as string

    }
    const getTemplates = React.useCallback(async (page = 1) => {
        startTransition(async () => {
            const res = await promiseCatch(fetchProjects('community', page))
            startTransition(async () => {
                if (res?.type === 'error') {
                    setError(res.message)
                    return;
                }
                const newTemplates = res?.data as ExternalProjectsData[] ?? [];
                const combined = page === 1 ? newTemplates : [
                    ...templates,
                    ...newTemplates
                ]
                setTemplates(newTemplates);
                setTemplateCache(
                    {
                        page: res?.page ?? pageState.page,
                        totalPages: res?.page ?? pageState?.totalPages,
                        data: combined,
                        type: 'success'
                    }
                )
                setPageState({
                    page: res?.page ?? pageState.page,
                    totalPages: res?.page ?? pageState?.totalPages
                })
            })
        })
    }, [])
    React.useEffect(() => {
        if (openProp && !hasFetchedOnce.current) {
            if (templatesCache) {
                setTemplates(templatesCache.data)
                setPageState({
                    page: templatesCache.page,
                    totalPages: templatesCache.totalPages
                })
                return;
            }
            getTemplates();
            hasFetchedOnce.current = true;
        }
    }, [openProp])
    React.useEffect(() => {
        if (sessionError) {
            setError(sessionError.message)
        }
    }, [sessionError])
    const onSelect = async () => {
        setIsSelecting(true);
        if (selectedTemplate) {
            const data = await handleTemplateDataFetch(selectedTemplate.id);
            if (data !== null) {
                await editor?.loadFromJson(data);
                onOpenChange(false);
            }
        }
        else {
            console.error('Selected Template cannot be null')
        }
        setIsSelecting(false)
    }
    const onLoadMore = async () => {
        if (pageState.page < pageState.totalPages) {
            await getTemplates(pageState.page + 1);
        }
    }
    const isPending = isPromising || isFetchingSession
    const isDisabled = false;
    const actualData = filtered ?? templates
    return (
        <Dialog open={openProp} onOpenChange={(open) => {
            onOpenChange(open);
        }}>
            <DialogContent className="max-w-5xl max-h-[90vh] overlfow-hidden z-[60000000000] p-0">

                <Tabs value={activeTab} orientation="vertical" onValueChange={setActiveTab} className="grid grid-cols-[160px_1fr] h-[80%]">
                    <TemplatesFilterBase
                        onSelect={(item) => {
                            // filter based on dimensions
                            if (item === null) {
                                setFiltered(null);
                                return;
                            }
                            //@ts-expect-error
                            setFiltered(templates.filter(template => template.dimensions === item))
                        }}
                        orientation='vertical'
                    />
                    <ScrollArea className="px-6 py-3 h-[90vh]">
                        <TabsContent value="templates">
                            <header className='flex py-4 items-center gap-x-3 mb-6'>
                                <h2 className='text-2xl font-medium'>
                                    Check out our rich library of community templates!
                                </h2>
                            </header>
                            <div
                                className={cn('grid gap-5 pb-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-4"', (isPending || error) && 'flex justify-center items-center h-full')}
                            >
                                {
                                    !isPending && !error && actualData.map(template => (
                                        <div
                                            role="button"
                                            onClick={
                                                () => {
                                                    setSelectedTemplate(template);
                                                    setActiveTab('selected')
                                                }
                                            }
                                            style={{
                                                pointerEvents: isDisabled ? 'none' : 'auto',
                                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                opacity: isDisabled ? 0.5 : 1
                                            }}
                                            className="relative group overflow-hidden rounded-md border border-border transition hover:shadow-md">
                                            <figure
                                                className="h-56 relative w-full"
                                            >
                                                <ImageWithShimmer
                                                    src={template.image ?? ''}
                                                    alt={template.name}
                                                    fill
                                                    className="!w-[90%] origin-center object-cover object-center aspect-video h-56"
                                                />
                                            </figure>
                                            <div className="absolute bottom-2 left-3 z-[15]">
                                                {template.isPro && <ProBadge />}
                                            </div>
                                        </div>
                                    ))
                                }
                                {error && <p className="text-destructive rounded-md p-1 bg-destructive/10">{error}</p>}
                                {
                                    isPending && (
                                        <Loader className='animate-spin' />
                                    )
                                }
                                {
                                    !isPending && actualData.length === 0 && (
                                        <p className='text-sm text-muted-foreground'>
                                            No Templates available
                                        </p>
                                    )
                                }
                            </div>
                            {!isPending && actualData.length > 0 && pageState.page < pageState.totalPages && (
                                <div className="flex justify-center mt-4">
                                    <Button variant="outline" onClick={onLoadMore}>
                                        Load More
                                    </Button>
                                </div>
                            )}

                        </TabsContent>
                        <TabsContent value='selected'>
                            <header className='flex items-center gap-x-1  mb-6'>
                                <Button
                                    variant={'ghost'}
                                    size={'shrink'}
                                    onClick={() => {
                                        setActiveTab('templates');
                                        setSelectedTemplate(null)
                                    }}
                                >
                                    <ChevronLeftIcon className='text-lg' />
                                </Button>
                                <h2 className='text-xl font-medium'>
                                    Selected
                                </h2>
                            </header>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ImageWithShimmer
                                    src={selectedTemplate?.image ?? ''}
                                    alt="Preview"
                                    fill
                                    className="rounded-md w-full h-60 object-cover hover:border hover:border-primary"
                                />
                                <div className="flex flex-col justify-between">
                                    <div>

                                        <h3 className="flex text-2xl leading-9 items-center gap-2">
                                            {selectedTemplate?.name}
                                            {selectedTemplate?.isPro && <ProBadge />}
                                        </h3>

                                        <div className="mt-4 flex items-center gap-2">
                                            <Avatar className="h-7 w-7">
                                                <AvatarImage src={selectedTemplate?.createdBy?.image ?? ''} />
                                                <AvatarFallback>
                                                    <UserIcon className="size-3.5" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm text-muted-foreground">
                                                {selectedTemplate?.createdBy?.name || "Anonymous"}
                                            </span>
                                        </div>
                                        <p className='text-sm mt-3 font-medium text-muted-foreground'>
                                            <span className='font-semibold text-black/80'>Note: </span>using a template will overwrite your changes</p>
                                        <div className='flex  items-center mt-5'>
                                            {
                                                !data?.user?.isPro && selectedTemplate?.isPro ? (
                                                    <UpgradeToProButton />
                                                ) : (
                                                    <Button
                                                        disabled={isSelecting}
                                                        onClick={onSelect}
                                                        className="w-full"
                                                    >
                                                        {isSelecting ? <Loader className="animate-spin mr-2" /> : "Use Template"}
                                                    </Button>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
