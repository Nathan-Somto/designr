import { useEffect, useState, useTransition } from "react";
import { Dialog, DialogContent } from "@designr/ui/components/dialog";
import { Input } from "@designr/ui/components/input";
import { Button } from "@designr/ui/components/button";
import Hint from "@designr/ui/components/hint";
import { toast } from "sonner";
import { createANewProject } from "#/services/projects";
import { promiseCatch } from "#/utils/promise-catch";
import { handleProjectRedirect } from "#/utils/handle-project-redirect";
import { useSettings } from "#/features/settings/settings-provider";
import { useProjects } from "#/hooks/useProjects";
import { useParams } from "next/navigation";
import { Badge } from "@designr/ui/components/badge";
import { DimensionsMap } from "../data";

interface UseCreateProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultWidth?: number;
    defaultHeight?: number;
    defaultName?: string;
    defaultData?: string | null;
}

export function useCreateProjectDialog({
    open,
    onOpenChange,
    defaultHeight = 0,
    defaultWidth = 0,
    defaultName = '',
    defaultData = null,
}: UseCreateProjectDialogProps) {
    const [width, setWidth] = useState<number>(defaultWidth);
    const [height, setHeight] = useState<number>(defaultHeight);
    const [name, setName] = useState<string>(defaultName);
    const [initialData, setInitialData] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    useEffect(() => {
        setWidth(defaultWidth);
        setHeight(defaultHeight);
        setName(defaultName);
        setInitialData(defaultData);
    }, [defaultWidth, defaultHeight, defaultName, defaultData
    ]);
    const { id: organizationId } = useParams();
    const { settings } = useSettings();
    const { setSlice } = useProjects();

    const onProjectCreate = async () => {
        startTransition(async () => {
            if (width === 0 || height === 0) {
                toast.error("Width or height cannot be set to 0");
                return;
            }

            let localName = name;
            if (localName === '') {
                const date = new Date();
                const formattedDate = date.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }).replace(/\//g, '-');
                localName = `Untitled (${formattedDate})`;
            }

            const res = await promiseCatch(
                createANewProject({
                    height,
                    width,
                    name: localName,
                    initialData
                })
            );

            if (res?.type === 'error') {
                toast.error(res.message);
                return;
            }

            if (!res?.id || typeof organizationId !== 'string') {
                toast.error("Something went wrong, please try again");
                return;
            }

            setSlice({
                slice: 'userDesigns',
                data: [{
                    id: res.id,
                    name: res.name,
                    canView: 'SELF',
                    height,
                    width,
                    isTemplate: false,
                    updatedAt: new Date(),
                }],
                mode: 'prepend',
            });

            handleProjectRedirect({
                openInNewTab: settings?.openDesignsInNewTab ?? false,
                organizationId,
                projectId: res?.id ?? '',
            });

            onOpenChange(false);
        });
    };

    const dialog = (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm">
                <div>
                    <h3 className="text-lg mb-4 font-semibold text-foreground">
                        Create a new design
                    </h3>
                    <div className="grid mb-6 grid-cols-2 gap-2">
                        <div className="col-span-2">
                            <label
                                htmlFor='project-name'
                                className='text-sm text-muted-foreground'
                            >
                                Project Name
                                <Hint label="This is optional, if not provided we will use Untitled as the name">
                                    <span className="text-xs text-muted-foreground ml-1">(optional)</span>
                                </Hint>
                            </label>
                            <Input
                                id='project-name'
                                placeholder="Enter Project Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="project-width" className='text-sm text-muted-foreground'>Width</label>
                            <Input
                                id="project-width"
                                placeholder="Enter Width"
                                value={width}
                                type="number"
                                onChange={(e) => setWidth(parseInt(e.target.value))}
                            />
                        </div>
                        <div>
                            <label htmlFor="project-height" className='text-sm text-muted-foreground'>Height</label>
                            <Input
                                id="project-height"
                                placeholder="Enter Height"
                                value={height}
                                type="number"
                                onChange={(e) => setHeight(parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                    <div>
                        {

                        }
                        <div
                            className="text-sm text-muted-foreground mb-2"
                            id="preset-label"
                        >
                            <p className="inline-block mr-2">
                                Preset:
                            </p>
                            <Badge
                                variant={
                                    DimensionsMap[`${width}x${height}`] ? 'selection' : 'secondary'
                                }
                                className="text-xs"
                            >
                                {initialData ?
                                    `
                                Imported Design
                                ` : DimensionsMap[`${width}x${height}`] ?? "Custom Size"}
                            </Badge>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                        You can change the width and height later in the editor.
                    </p>
                    <Button
                        className="w-full"
                        disabled={!width || !height || isPending}
                        onClick={onProjectCreate}
                    >
                        {isPending ? "Creating..." : "Create Design"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );

    return { dialog, setWidth, setHeight, setName };
}
