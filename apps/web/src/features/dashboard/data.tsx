import { ImageIcon, YoutubeIcon, LinkedinIcon, FileTextIcon, UploadIcon, RulerIcon, ShapesIcon } from "lucide-react";

export const editorPresets = [
    {
        label: "Logo",
        icon: ShapesIcon,
        bg: "bg-red-100",
        size: "500 x 500",
        iconColor: 'text-red-800'
    },
    {
        label: "Social Media",
        icon: ImageIcon,
        bg: "bg-blue-100",
        size: "1080 x 1080",
        iconColor: 'text-blue-800'
    },
    {
        label: "YouTube Thumbnail",
        icon: YoutubeIcon,
        bg: "bg-yellow-100",
        size: "1280 x 720",
        iconColor: 'text-yellow-800'
    },
    {
        label: "LinkedIn Banner",
        icon: LinkedinIcon,
        bg: "bg-violet-100",
        size: "1584 x 396",
        iconColor: 'text-violet-800'
    },
    {
        label: "Doc",
        icon: FileTextIcon,
        bg: "bg-green-100",
        size: "1240 x 1754",
        iconColor: 'text-green-800'
    },
    {
        label: "Custom Size",
        icon: RulerIcon,
        bg: "bg-muted",
        iconColor: "text-muted-foreground",
        custom: true,
    },
    {
        label: "Import",
        icon: UploadIcon,
        bg: "bg-muted",
        iconColor: "text-muted-foreground",
        import: true,
    },
];
type Dimensions = Record<`${number}x${number}`, string>
export const DimensionsMap: Dimensions = {
    '1080x1080': 'Social Media',
    '1280x720': 'Youtube Thumbnail',
    '1584x396': 'LinkedIn Banner',
    '1240x1754': 'Doc',
    '500x500': 'Logo',
    '1104x736': 'Linkedin Post',
    '940x788': 'Facebook Post',
    '525x300': 'Business Card',
    '1024x512': 'Twitter Post',
    '595x842': 'A4'
}