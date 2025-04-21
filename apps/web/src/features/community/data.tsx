import {
    Image,
    Youtube,
    Linkedin,
    FileText,
    BriefcaseBusiness,
    Facebook,
    Twitter,
    File,
    ShapesIcon
} from "lucide-react";

export const dimensionsList = [
    { label: "Social Media", value: "1080x1080", icon: Image, iconColor: "text-pink-500" },
    { label: "YouTube Thumbnail", value: "1280x720", icon: Youtube, iconColor: "text-red-500" },
    { label: "LinkedIn Banner", value: "1584x396", icon: Linkedin, iconColor: "text-blue-500" },
    { label: "Doc", value: "1240x1754", icon: FileText, iconColor: "text-green-500" },
    { label: "Logo", value: "500x500", icon: ShapesIcon, iconColor: "text-yellow-500" },
    { label: "LinkedIn Post", value: "1104x736", icon: Linkedin, iconColor: "text-blue-400" },
    { label: "Facebook Post", value: "940x788", icon: Facebook, iconColor: "text-blue-600" },
    { label: "Business Card", value: "525x300", icon: BriefcaseBusiness, iconColor: "text-amber-600" },
    { label: "Twitter Post", value: "1024x512", icon: Twitter, iconColor: "text-sky-500" },
    { label: "A4", value: "595x842", icon: File, iconColor: "text-zinc-500" },
];
