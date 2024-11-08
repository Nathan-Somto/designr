import { AngleIcon, DashIcon, FontSizeIcon, HeightIcon, LetterSpacingIcon, LineHeightIcon,  ShadowOuterIcon,  TransparencyGridIcon, WidthIcon } from "@radix-ui/react-icons";
import { AlignLeft, AlignCenter, AlignRight, Underline, Strikethrough, CaseUpperIcon, CaseLowerIcon, CaseSensitiveIcon, CircleIcon, BoxSelectIcon, X } from "lucide-react";
import { BaseProps, InputProps, SelectedObject, TextButtons } from "./types";
// For Text Settings

export const Alignment: TextButtons = {
    label: 'Alignment',
    options: [{
        Icon: () => <AlignLeft size={18} />,
        action: 'Left',
        config: {
            textAlign: 'left'
        }
    },
    {
        Icon: () => <AlignCenter size={18} />,
        action: 'Center',
        config: {
            textAlign: 'center'
        }
    },
    {
        Icon: () => <AlignRight size={18} />,
        action: 'Right',
        config: {
            textAlign: 'right'
        }
    }]
}
export const letterSpacing = {
    label: "Letter Spacing",
    type: "int",
    Icon: () => <LetterSpacingIcon />,
    value: 0

}
export const lineHeight =
{
    label: "Line Height",
    type: "float",
    Icon: () => <LineHeightIcon />,
    value: 1.2
}
export const decoration: TextButtons = {
    label: 'Text Decoration',
    options: [
        {
            Icon: () => <DashIcon height={18} width={18} />,
            action: 'None',
            config: {
                textDecoration: 'none'
            }
        }, {
            Icon: () => <Underline size={18} />,
            action: 'Underline',
            config: {
                textDecoration: 'underline'
            }
        },
        {
            Icon: () => <Strikethrough size={18} />,
            action: 'Line Through',
            config: {
                textDecoration: 'strike-through'
            }
        },
    ]
}
export const casing: TextButtons = {
    label: 'Text Casing',
    options: [
        {
            Icon: () => <CaseUpperIcon size={18} />,
            action: 'Upper Case',
            config: {
                textTransform: 'uppercase'
            }
        },
        {
            Icon: () => <CaseLowerIcon size={18} />,
            action: 'Lower Case',
            config: {
                textTransform: 'lowercase'
            }
        },
        {
            Icon: () => <CaseSensitiveIcon size={18} />,
            action: 'Capitalize',
            config: {
                textTransform: 'capitalize'
            }
        }
    ]
}
export const fontFamily =

{
    label: 'Font Family',
    type: 'select',
    options: ['Arial', 'Times New Roman', 'Courier New', 'Verdana', 'Comic Sans MS', 'Impact', 'Georgia', 'Trebuchet MS', 'Tahoma', 'Lucida Console'],

}
export const fontWeight =
{
    label: 'Font Weight',
    type: 'select',
    options: ['normal', 'bold', 'lighter', 'bolder'],
}
export const fontSize =
{
    label: 'Font Size',
    type: 'int',
    value: 16,
    Icon: () => <FontSizeIcon />,
}
export const fontStyle =
{
    label: 'Font Style',
    type: 'select',
    options: ['normal', 'italic', 'oblique'],

}
//Ends for Text settings

// For Position Settings
export const position: {
    label: string
    inputs: (InputProps & Pick<BaseProps<SelectedObject>, 'selectedObjectProp'>)[]
} = {
    label: 'Position',
    inputs: [
        {
            label: 'X',
            type: 'int',
            value: 0,
            Icon: () => <X size={18} />,
            selectedObjectProp: 'x'
        },
        {
            label: 'Y',
            type: 'int',
            value: 0,
            Icon: () => <span className="text-lg">Y</span>,
            selectedObjectProp: 'y'
        },
        {
            label: 'Width',
            type: 'float',
            value: 100,
            Icon: () => <WidthIcon height={18} width={18} />,
            selectedObjectProp: 'width'
        },
        {
            label: 'Height',
            type: 'float',
            value: 100,
            Icon: () => <HeightIcon height={18} width={18} />,
            selectedObjectProp: 'height'
        },
        {
            label: 'Diameter',
            type: 'float',
            value: 100,
            Icon: () => <CircleIcon size={18} />,
            selectedObjectProp: 'diameter'
        },
        {
            label: 'Angle',
            type: 'float',
            Icon: () => <AngleIcon height={18} width={18} />,
            value: 0,
            selectedObjectProp: 'angle'
        },
        {
            label: 'Corner Radius',
            type: 'int',
            value: 0,
            Icon: () => <BoxSelectIcon />,
            selectedObjectProp: 'cornerSize'
        }
    ]
}
// For Image Settings
export const filters = [
    "none",
    "polaroid",
    "sepia",
    "kodachrome",
    "contrast",
    "brightness",
    "greyscale",
    "brownie",
    "vintage",
    "technicolor",
    "pixelate",
    "invert",
    "blur",
    "sharpen",
    "emboss",
    "removecolor",
    "blacknwhite",
    "vibrance",
    "blendcolor",
    "huerotate",
    "resize",
    "saturation",
    "gamma",
];
// For Apperance Settings
export const appearance = {
    label: "Appearance",
    inputs: [
        {
            label: "Fill",
            type: "string" as const,
            value: "#000000",
            selectedObjectProp: 'fill' as BaseProps<SelectedObject>['selectedObjectProp'],
            renderType: "color",
        },
        {
            label: 'Opacity (0-1)',
            type: 'float' as const,
            value: 1,
            selectedObjectProp: 'opacity'  as BaseProps<SelectedObject>['selectedObjectProp'],
            Icon: () => <TransparencyGridIcon height={20} width={20} />
        },
    ],
}
//Ends for Apperance settings
// for Shadow Settings
export const shadow = {
    label: 'Shadow',
    inputs: [
        {
            label: 'Shadow Color',
            type: 'string',
            value: '#000000',
            selectedObjectProp: 'shadow.color' as const,
            renderType: 'color'
        },
        {
            label: 'Shadow X',
            type: 'int' as const,
            value: 0,
            selectedObjectProp: 'shadow.offsetX' as const,
            Icon: () => <X/>
        },
        {
            label: 'Shadow Y',
            type: 'int' as const,
            value: 0,
            selectedObjectProp: 'shadow.offsetY' as const,
            Icon: () => <span className="text-lg">Y</span>,
        },
        {
            label: 'Shadow Blur',
            type: 'int' as const,
            value: 0,
            selectedObjectProp: 'shadow.blur' as const,
            Icon: () => <ShadowOuterIcon/>
        },
    ]
}
export const workspace = {
    label: 'Workspace',
    description:"Make Changes to the workspace",
    colorInputs: [{
        label: 'Background',
        type: 'string',
        value: '#ffffff',
        renderType: 'color',
        workspaceProp: 'backgroundColor'
    },],
    inputs: [       
        {
            label: 'Width',
            type: 'float',
            value: 100,
            Icon: () => <WidthIcon height={18} width={18} />,
            workspaceProp: 'width'
        },
        {
            label: 'Height',
            type: 'float',
            value: 100,
            Icon: () => <HeightIcon height={18} width={18} />,
            workspaceProp: 'height'
        },
        
    ],
    selects: [{
        label: "Sizes",
        type: 'select',
        workspaceProp: 'dimension',
        options: [{
            label: "Business Card(525x300)",
            value: '525x300'
        },
        {
            label: "A4(595x842)",
            value: '595x842'
        },
        {
            label: "LinkedIn Post(1104x736)",
            value: '1104x736'
        },
        {
            label: "Youtube Thumbnail(1280x720)",
            value: '1280x720'
        },
        {
            label: "Facebook Post(940x788)",
            value: '940x788'
        },
        {
            label: "Instagram Post(1080x1080)",
            value: '1080x1080'
        },
        {
            label: "Twitter Post(1024x512)",
            value: '1024x512'
        }]}]
} as const