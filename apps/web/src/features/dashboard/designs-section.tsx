'use client';
import { Button } from '@designr/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@designr/ui/components/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@designr/ui/components/table';
import { AlertTriangleIcon, CopyIcon, FileIcon, GlobeIcon, LayoutTemplateIcon, LockIcon, MoreHorizontal, SearchIcon, Trash, XIcon } from 'lucide-react'
import { useParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import React, { use } from 'react'
import { Checkbox } from '@designr/ui/components/checkbox';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@designr/ui/lib/utils';
import Hint from '@designr/ui/components/hint';
import { useConfirm } from '#/hooks/useConfirm';
import { DimensionsMap } from './data';
import { useProjects, UserDesignsData } from '#/hooks/useProjects';
import { PaginatedResponse } from '#/services';
import { CatchResult, promiseCatch } from '#/utils/promise-catch';
import { deleteProjects, duplicateAProject, fetchProjects } from '#/services/projects';
import { toast } from 'sonner';
import { useSettings } from '../settings/settings-provider';
import { handleProjectRedirect } from '#/utils/handle-project-redirect';



/* 
 used for mocking testing with react test library
const mock_data: UserDesignsData[] = [
    {
        id: '123',
        name: 'Self Project',
        canView: 'SELF',
        width: 580,
        height: 450,
        updatedAt: new Date(2025, 3, 16, 10)
    },
    {
        id: '345',
        name: 'Preset Project',
        canView: 'ORG',
        width: 500,
        height: 500,
        updatedAt: new Date(2025, 3, 18, 12)
    },
    {
        id: '567',
        name: 'Public Project',
        canView: 'PUBLIC',
        width: 1104,
        height: 736,
        updatedAt: new Date(2025, 3, 11, 11)
    },
    {
        id: '8911',
        name: 'Public Project',
        canView: 'PUBLIC',
        width: 940,
        height: 788,
        updatedAt: new Date(2025, 3, 12, 11),
        isTemplate: true
    }
]; */
type AnimatedDesignsProps = {
    fetchDesignsPromise: Promise<PaginatedResponse<UserDesignsData> | CatchResult>
}
type DesignsSectionProps = {
    promiseResult: PaginatedResponse<UserDesignsData> | CatchResult
}
function DesignsSection({ promiseResult }: DesignsSectionProps) {
    const result = promiseResult;
    const [deleteDesign, setDeleteDesign] = React.useState<{
        id: string | null,
        open: boolean
    }>({
        id: null,
        open: false
    })
    const onOpenChange = (value: boolean) => {
        setDeleteDesign(prev => ({
            id: value ? prev.id : null,
            open: value
        }))
    }

    const [selected, setSelected] = React.useState<string[]>([]);
    const [isPending, startTransition] = React.useTransition();
    const toggleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };
    const {
        state: {
            userDesigns: {
                data: userDesigns,
                hasMore: hasNextPage,
                page,
                filteredData,
            },
        },
        setSlice,
    } = useProjects();
    const {
        settings
    } = useSettings();
    //get the organization id from the url its a dynamic value called id
    const { id: organizationId } = useParams();
    const { ConfirmDialog } = useConfirm(
        {
            title: "Are you sure?",
            message:
                selected.length > 0 ?
                    'You are about to delete ' + selected.length + ' designs.'
                    : 'You are about to delete this design.',
            open: deleteDesign?.open,
            onOpenChange,
            onConfirm: async () => {
                if (deleteDesign.id) {
                    await deleteProjects([deleteDesign.id]);
                } else {
                    // check length of the selected cannot be more than 10,
                    if (selected.length > 10) {
                        toast.error('You can only delete 10 designs at a time.');
                        return;
                    }
                    await deleteProjects(selected);
                    setSelected([]);
                }
                // update the store
                setSlice({
                    data: userDesigns.filter((project) => {
                        if (selected.length > 0) {
                            return !selected.includes(project.id);
                        }
                        return project.id !== deleteDesign.id;
                    }),
                    slice: 'userDesigns',
                    page,
                    hasMore: hasNextPage,
                    mode: 'replace'
                })
                setDeleteDesign({ id: null, open: false });
            }
        }
    );
    const onMassDelete = () => {
        setDeleteDesign({
            id: null,
            open: true
        })
    }
    const onDuplicate = async (data: UserDesignsData) => {
        startTransition(async () => {
            const res = await promiseCatch(duplicateAProject({
                oldProjectId: data.id
            }))
            if (res === undefined) {
                toast.error('Failed to duplicate design');
                return;
            }
            if (res?.type === 'error') {
                toast.error(res.message);
                return;
            }
            // update the store with the new project(the other data is the same just the change of name and id)
            startTransition(() => {
                setSlice({
                    data: [{
                        ...data,
                        id: res.id,
                        name: res.name
                    }],
                    slice: 'userDesigns',
                    mode: 'prepend'
                })
            })
        })
    }
    const clearSelection = () => setSelected([]);
    const onRedirect = (id: string) => {
        if (isPending) return;
        handleProjectRedirect({
            organizationId: organizationId as string,
            projectId: id,
            openInNewTab: settings?.openDesignsInNewTab ?? false
        })
    }
    React.useEffect(() => {
        if (result?.type === 'success') {
            setSlice({
                data: result.data,
                slice: 'userDesigns',
                page: result.page,
                hasMore: result.page < result.totalPages,
                mode: 'replace'
            })
        }
    }, [result])
    const tableHead = ['Name', 'People', 'Dimensions', 'Modified', '']
    const onLoadMore = async () => {
        if (!hasNextPage) return;
        startTransition(async () => {
            const res = await
                promiseCatch<PaginatedResponse<UserDesignsData>>
                    //@ts-ignore
                    (fetchProjects('mine', page + 1))
            if (res === undefined) {
                toast.error('Failed to load more designs');
                return;
            }
            if (res?.type === 'error') {
                toast.error(res.message);
                return;
            }
            startTransition(() => {
                setSlice({
                    data: res.data,
                    slice: 'userDesigns',
                    page: res.page,
                    hasMore: res.page < res.totalPages,
                    mode: 'append'
                })
            })
        })
    }

    if (result?.type === "error" || result === undefined) {
        return (
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">
                    Recent designs
                </h3>
                <div className="flex flex-col gap-y-4 items-center justify-center h-32">
                    <AlertTriangleIcon className="size-6 text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">
                        Failed to load designs
                    </p>
                </div>
            </div>
        )
    }
    const data = filteredData ?? userDesigns;
    if (
        !data.length
    ) {
        return (
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">
                    Recent designs
                </h3>
                <div className="flex flex-col gap-y-4 items-center justify-center h-32">
                    <SearchIcon className="size-6 text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">
                        No designs found
                    </p>
                </div>
            </div>
        )
    }
    const isDisabled = isPending
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">
                Recent designs
            </h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        {
                            tableHead.map(item => <TableHead key={item}>{item}</TableHead>)
                        }
                    </TableRow>
                </TableHeader>
                <TableBody className=''>
                    {data.map((project) => (
                        <TableRow
                            key={project.id}
                            className={cn(
                                'transition-all  duration-200 overflow-x-auto  no-scrollbar',
                                selected.includes(project.id) && '!bg-primary/20 text-primary border-collapse',
                                isDisabled && 'opacity-50 pointer-events-none',
                            )}
                        >

                            <TableCell
                                aria-disabled={isDisabled}
                                onClick={onRedirect.bind(null, project.id)}
                                className="font-medium flex items-center gap-x-2 cursor-pointer"
                            >
                                <FileIcon className="size-6" />
                                <span className='line-clamp-1'>
                                    {project.name}
                                </span>
                            </TableCell>
                            <TableCell
                            >
                                <div className='bg-muted flex items-center max-w-fit gap-x-2 [&>svg]:!size-3.5 py-1 rounded-2xl text-muted-foreground text-xs px-2 '>
                                    {
                                        project.isTemplate ?
                                            <>
                                                <LayoutTemplateIcon />
                                                Template
                                            </>
                                            :
                                            project.canView !== 'PUBLIC' ?
                                                <>
                                                    <LockIcon />
                                                    Private
                                                </>
                                                :
                                                <>
                                                    <GlobeIcon />
                                                    Public
                                                </>
                                    }
                                </div>
                            </TableCell>
                            <TableCell
                                aria-disabled={isDisabled}
                                onClick={onRedirect.bind(null, project.id)}
                                className="text-xs cursor-pointer"
                            >
                                {
                                    DimensionsMap[`${project.width}x${project.height}`] ?? `${project.width} x ${project.height} px`
                                }

                            </TableCell>
                            <TableCell
                                aria-disabled={isDisabled}
                                onClick={onRedirect.bind(null, project.id)}
                                className=" cursor-pointer"
                            >
                                {formatDistanceToNow(project.updatedAt ?? new Date(), {
                                    addSuffix: true,
                                })}
                            </TableCell>
                            <TableCell
                                aria-disabled={isDisabled}
                                className="flex items-center justify-end">
                                <Checkbox
                                    className="size-6"
                                    checked={selected.includes(project.id)}
                                    onCheckedChange={() => toggleSelect(project.id)}
                                />
                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            disabled={isDisabled}
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <MoreHorizontal className="size-6 text-primary" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-60">
                                        <DropdownMenuItem
                                            disabled={isDisabled}
                                            className="h-10 cursor-pointer"
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                await onDuplicate(project);
                                            }}
                                        >
                                            <CopyIcon className="size-4 mr-2" />
                                            Duplicate
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            disabled={selected.length > 0 || isDisabled}
                                            onClick={() => {
                                                setDeleteDesign({
                                                    id: project.id,
                                                    open: true
                                                })
                                            }}
                                            className="h-10 cursor-pointer text-destructive"
                                        >
                                            <Trash className="size-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {hasNextPage && (
                <div className="w-full flex items-center justify-center pt-4">
                    <Button
                        disabled={isDisabled}
                        onClick={onLoadMore}
                        variant="ghost"
                    >
                        Load more
                    </Button>
                </div>
            )}
            <AnimatePresence>
                {selected.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white shadow-2xl rounded-[16px] px-6 py-3 flex items-center gap-x-4 border border-muted z-50"
                    >
                        <span className="text-sm text-muted-foreground">
                            {selected.length} selected
                        </span>
                        <Hint
                            label='Delete all'
                        >
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={onMassDelete}
                            >
                                <Trash className="size-5" />
                            </Button>
                        </Hint>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={clearSelection}
                        >
                            <XIcon className="size-5" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
            <ConfirmDialog />
        </div>
    );
}
export default function AnimatedDesignSection({
    fetchDesignsPromise
}: AnimatedDesignsProps) {
    const promiseResult = use(fetchDesignsPromise);
    return (
        <motion.section
            initial={{
                opacity: 0
            }}
            animate={{
                opacity: 1
            }}
            transition={{
                duration: 0.35,
                delay: 0.7,
                ease: 'easeIn'
            }}
            id="dashboard__home-design-section"
        >
            <DesignsSection
                promiseResult={promiseResult}
            />
        </motion.section>
    )
}