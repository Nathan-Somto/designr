/* eslint-disable no-unused-vars */
import { Dialog, DialogContent } from "@designr/ui/components/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@designr/ui/components/tabs";
import React from "react";
import { UploadedImagesTab } from "./uploaded-images-tab";
import { UnsplashImagesTab } from "./unsplash-images-tab";
import SelectedImageTab from "./selected-image-tab";
import { TransformImageTab } from "./transform-image-tab";
import { ScrollArea } from "@designr/ui/components/scroll-area";
import { IconsTab } from "./icons-tab";
import { useUserMedia } from "#/hooks/useUserMedia";
import { LoadMore } from "#/components/load-more";
interface Props {
    openProp: boolean;
    onOpenChange: (open: boolean) => void;
    defaultTab: "uploaded" | "unsplash" | "icons";
    onSelect: (image: string | null, type: 'url' | 'svg') => void;
    openCount: 0 | 1;
}
export function AssetsDialog({
    defaultTab,
    onOpenChange,
    onSelect,
    openProp,
    openCount
}: Props) {
    const {
        userMedia: uploadedImages,
        isFetching,
        error,
        appendUserMedia,
        removeUserMedia,
        page,
        totalPages
    } = useUserMedia({
        shouldFetch: openCount === 1
    });
    const [open, setOpen] = React.useState(false);
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
    const [activeTab, setActiveTab] = React.useState('uploaded');
    React.useEffect(() => {
        setOpen(openProp);
        setActiveTab(defaultTab);
    }, [openProp, defaultTab]);
    return (
        <Dialog open={open} onOpenChange={(open) => {
            setOpen(open);
            onOpenChange(open);
        }}>
            <DialogContent className="max-w-5xl max-h-[90vh] overlfow-hidden z-[60000000000] p-0">

                <Tabs value={activeTab} orientation="vertical" onValueChange={setActiveTab} className="grid grid-cols-[160px_1fr] h-[80%]">
                    <TabsList aria-orientation="vertical" className="flex-col gap-y-4 px-2 py-6 border-r h-[90vh] justify-start ">
                        <TabsTrigger value="uploaded" className="w-full">Uploaded</TabsTrigger>
                        <TabsTrigger value="unsplash" className="w-full">Unsplash</TabsTrigger>
                        <TabsTrigger value="icons" className="w-full">Icons</TabsTrigger>
                    </TabsList>

                    <ScrollArea className="px-6 py-3 h-[90vh]">
                        <TabsContent value="uploaded">
                            <UploadedImagesTab
                                data={uploadedImages}
                                onSelect={(image) => {
                                    setSelectedImage(image);
                                    setActiveTab('selected');
                                }}
                                loading={isFetching}
                                error={error}
                                onDelete={removeUserMedia}
                            />
                            <LoadMore
                                onLoadMore={appendUserMedia}
                                hasNext={
                                    page < totalPages
                                }
                                isDisabled={isFetching || totalPages === 0}
                                loading={isFetching}
                            />
                        </TabsContent>
                        <TabsContent value="unsplash">
                            <UnsplashImagesTab onSelect={(image) => {
                                setSelectedImage(image);
                                setActiveTab('selected');
                            }} />
                        </TabsContent>
                        <TabsContent value="icons">
                            <IconsTab
                                onSelect={(svg) => {
                                    onSelect(svg, 'svg');
                                    setOpen(false);
                                }}
                            />

                        </TabsContent>
                        <TabsContent value="selected">
                            <SelectedImageTab
                                selectedImage={selectedImage}
                                onSelect={(image) => {
                                    setSelectedImage(image);
                                    onSelect(image, 'url');
                                    setOpen(false);
                                }}
                                onBack={() => setActiveTab('uploaded')}
                                onTransform={() => setActiveTab('transform')}
                            />
                        </TabsContent>
                        <TabsContent value="transform">
                            <TransformImageTab
                                imageUrl={selectedImage as string}
                                onBack={() => setActiveTab('selected')}
                                onSave={() => {
                                    setOpen(false);
                                }}
                            />
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
