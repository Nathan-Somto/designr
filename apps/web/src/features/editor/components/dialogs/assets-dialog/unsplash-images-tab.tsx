'use client';

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Input } from "@designr/ui/components/input";
import { Button } from "@designr/ui/components/button";
import { ApiErrorResponse, ApiSuccessResponse } from "#/services";
import { Random } from "unsplash-js/dist/methods/photos/types";
import { Nullable } from "unsplash-js/dist/helpers/typescript";
import { Loader } from "lucide-react";
import { ImageWithShimmer } from "#/components/image-with-shimmer";


interface Props {
    onSelect: (url: string) => void;
}
interface PrettifiedImagesData {

    url: string;
    alt: Nullable<string>;
    id: string;
    name: Nullable<string>;

}
export function UnsplashImagesTab({ onSelect }: Props) {
    const [images, setImages] = useState<PrettifiedImagesData[]>([]);
    const [filtered, setFiltered] = useState<PrettifiedImagesData[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const perPage = 10;

    useEffect(() => {
        const getImages = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/unsplash", {
                    cache: 'force-cache',
                    next: {
                        revalidate: 8640
                    }
                });
                const data: ApiSuccessResponse<{
                    images: Random[]
                }> | ApiErrorResponse = await res.json();
                if (data.type === "success") {
                    const urls = data.images.map(img => ({
                        url: img.urls.small,
                        alt: img.alt_description,
                        id: img.id,
                        name: img.description ?? img.alt_description
                    }));
                    setImages(urls);
                    setFiltered(urls);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError("Something went wrong while fetching images.");
            } finally {
                setLoading(false);
            }
        };

        getImages();
    }, []);

    useEffect(() => {
        const lower = search.toLowerCase();
        setFiltered(images.filter(url => url.name?.toLowerCase().includes(lower)));
        setPage(1);
    }, [search, images]);

    const paginated = useMemo(() => {
        const start = (page - 1) * perPage;
        return filtered.slice(start, start + perPage);
    }, [filtered, page]);
    //console.log("images length:", images.length)
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-lg font-bold">Select an Unsplash Image</h2>
            </div>
            <Input
                placeholder="Search Unsplash..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            {loading && <div className="h-full w-full flex justify-center items-center " >
                <Loader className="animate-spin" />
            </div>}
            {error && <p className="text-destructive rounded-md p-1 bg-destructive/10">{error}</p>}
            {!loading && !error && (
                <>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        {paginated.map((img) => (
                            <div
                                key={img.id}
                                className="rounded-md cursor-pointer overflow-hidden"
                                onClick={() => onSelect(img.url)}
                            >
                                <ImageWithShimmer
                                    src={img.url}
                                    alt={`${img.alt}`}
                                    width={350}
                                    height={350}
                                    className="w-full h-32 object-cover"

                                />
                            </div>
                        ))}
                    </div>

                    {/* {filtered.length > perPage && ( */}
                    <div className="flex justify-between pt-4">
                        <Button
                            onClick={() => setPage(p => Math.max(p - 1, 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-muted-foreground text-sm">{page + ' / ' + images.length / perPage}</span>
                        <Button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page * perPage >= images.length}
                        >
                            Next
                        </Button>
                    </div>
                    {/* )} */}
                </>
            )}
        </div>
    );
}
