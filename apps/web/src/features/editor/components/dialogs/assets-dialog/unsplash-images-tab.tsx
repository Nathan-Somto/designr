import { Input } from "@designr/ui/components/input";
import Image from "next/image";

// eslint-disable-next-line no-unused-vars
export function UnsplashImagesTab({ onSelect }: { onSelect: (image: string) => void }) {
    const unsplashImages = [
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=600&h=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1626808642875-0aa545482dfb?w=350&h=350&fit=crop',
        'https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=350&h=350&fit=crop',
        'https://images.unsplash.com/photo-1505968409348-bd000797c92e?w=350&h=350&fit=crop',
    ];

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-lg text-left font-bold mb-2">
                    Select an Unsplash Image
                </h2>
            </div>
            <Input placeholder="Search Unsplash..." />
            <div className="grid grid-cols-4 gap-4 !mt-8">
                {unsplashImages.map((img, index) => (
                    <div
                        key={img}
                        className="rounded-md cursor-pointer overflow-hidden"
                        onClick={() => onSelect(img)}
                    >
                        <Image
                            src={img}
                            alt={`unsplash-${index + 1} photo`}
                            height={350}
                            width={350}
                            className="w-full h-32 object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
