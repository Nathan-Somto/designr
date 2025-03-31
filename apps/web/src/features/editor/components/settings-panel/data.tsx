import { AngleIcon, DashIcon, DimensionsIcon, FontSizeIcon, HeightIcon, LetterSpacingIcon, LineHeightIcon, OpacityIcon, ShadowOuterIcon, WidthIcon } from "@designr/ui/react-icons";
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, BoxSelectIcon, CaseLowerIcon, CaseSensitiveIcon, CaseUpperIcon, CircleIcon, FilterIcon, MoveHorizontalIcon, MoveVerticalIcon, SquareIcon, Strikethrough, TypeIcon, Underline, X } from "lucide-react";
import { ButtonSelect, InputSelect, OptionsSelect, SettingsSection } from "../../types";
//===== Position Settings ===========//
export const position: SettingsSection<
    'y' | 'x' | 'width' | 'height' | 'diameter' | 'angle' | 'cornerSize'
> = {
    label: 'Position',
    inputs: [
        {
            action: 'X axis',
            type: 'int',
            Icon: () => <X size={18} />,
            config: {
                x: 0
            }
        },
        {
            action: 'Y axis',
            type: 'int',
            Icon: () => <span className="text-lg font-inter">Y</span>,
            config: {
                y: 0
            }
        },
        {
            action: 'Width',
            type: 'float',
            Icon: () => <MoveHorizontalIcon height={18} width={18} />,
            config: {
                width: 100
            }
        },
        {
            action: 'Height',
            type: 'float',
            Icon: () => <MoveVerticalIcon height={18} width={18} />,
            config: {
                height: 100
            }
        },
        {
            action: 'Diameter',
            type: 'float',
            Icon: () => <CircleIcon size={18} />,
            config: {
                diameter: 100
            }
        },
        {
            action: 'Angle',
            type: 'float',
            Icon: () => <AngleIcon height={18} width={18} />,
            config: {
                angle: 0
            }
        },
        {
            action: 'Corner Radius',
            type: 'int',
            Icon: () => <BoxSelectIcon />,
            config: {
                cornerSize: 0
            }
        }
    ]
}
//===== Position Settings ===========//
//======= Text Settings ===========//
export const TextAlignment: ButtonSelect<'textAlign'> = {
    label: 'Alignment',
    options: [{
        Icon: () => <AlignLeftIcon size={18} />,
        action: 'Left',
        config: {
            textAlign: 'left'
        }
    },
    {
        Icon: () => <AlignCenterIcon size={18} />,
        action: 'Center',
        config: {
            textAlign: 'center'
        }
    },
    {
        Icon: () => <AlignRightIcon size={18} />,
        action: 'Right',
        config: {
            textAlign: 'right'
        }
    }]
}
export const letterSpacing: InputSelect<'letterSpacing'> = {
    action: "Letter Spacing",
    type: "int",
    Icon: () => <LetterSpacingIcon />,
    config: {
        letterSpacing: 0
    }

}
export const lineHeight: InputSelect<'lineHeight'> =
{
    action: "Line Height",
    type: "float",
    Icon: () => <LineHeightIcon />,
    config: {
        lineHeight: 1.2
    }
}
export const decoration: ButtonSelect<'textDecoration'> = {
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
export const casing: ButtonSelect<'textTransform'> = {
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
    action: 'Font Family',
    type: 'select',
    config: {
        fontFamily: 'Arial'
    },
    options: ['Arial', 'Times New Roman', 'Courier New', 'Verdana', 'Comic Sans MS', 'Impact', 'Georgia', 'Trebuchet MS', 'Tahoma', 'Lucida Console'],

}
export const fontWeight: OptionsSelect<'fontWeight'> =
{
    action: 'Font Weight',
    type: 'select',
    config: {
        fontWeight: 'normal'
    },
    options: ['normal', 'bold', 'lighter', 'bolder'],
    Icon: () => <TypeIcon />
}
export const fontSize: InputSelect<'fontSize'> =
{
    action: 'Font Size',
    type: 'int',
    config: {
        fontSize: 16
    },
    Icon: () => <FontSizeIcon />,
}
export const fontStyle =
{
    label: 'Font Style',
    type: 'select',
    config: {
        fontStyle: 'normal'
    },
    options: ['normal', 'italic', 'oblique'],

}
//======= Text Settings ===========//
//====== Appearance Settings ============//
export const filter: OptionsSelect<'filter'> = {
    action: 'Image filter',
    type: 'select',
    config: {
        filter: 'greyscale'
    },
    options: [
        "greyscale",
        "polaroid"
        , "sepia"
        , "kodachrome"
        , "contrast"
        , "brightness"
        , "brownie"
        , "vintage"
        , "technicolor"
        , "pixelate"
        , "invert"
        , "blur"
        , "sharpen"
        , "emboss"
        , "removecolor"
        , "blacknwhite"
        , "vibrance"
        , "blendcolor"
        , "huerotate"
        , "resize"
        , "gamma"
        , "saturation"
    ],
    Icon: () => <FilterIcon size={18} />
}
export const opacity: InputSelect<'opacity'> = {
    action: 'Opacity',
    type: 'int',
    Icon: () => <OpacityIcon />,
    config: {
        opacity: 100
    }
}
export const fill: InputSelect<'fill'> = {
    action: 'Fill',
    type: 'color',
    Icon: () => <SquareIcon size={18} />,
    config: {
        fill: '#000000'
    }
}
//====== Appearance Settings ============//
//====== Effect Settings ============//
export const effects = {
    label: 'Effects',
    inputs: [
        {
            Icon: () => <SquareIcon size={18} />,
            type: 'color',
            config: {
                "shadow.color": '#000000'
            },
            action: 'Shadow Color',
        } as InputSelect<'shadow.color'>,
        {
            Icon: () => <SquareIcon size={18} />,
            type: 'int',
            config: {
                "shadow.offsetX": 0
            },
            action: 'Shadow X',
        } as InputSelect<'shadow.offsetX'>,
        {
            Icon: () => <span className="text-lg font-inter">Y</span>,
            type: 'int',
            config: {
                "shadow.offsetY": 0
            },
            action: 'Shadow Y',
        } as InputSelect<'shadow.offsetY'>,
        {
            Icon: () => <ShadowOuterIcon />,
            type: 'int',
            config: {
                "shadow.blur": 0
            },
            action: 'Shadow Blur',
        } as InputSelect<'shadow.blur'>,

    ]
}
//====== Effect Settings ============//

//====== Workspace Settings ============//
export const workspace = {
    selects: {
        action: "File Sizes",
        type: 'select',
        config: {
            height: 100,
            width: 100
        },
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
        }],
        Icon: () => <DimensionsIcon height={18} width={18} />
    },
    /* width, height and color */
    inputs: [
        {
            action: 'Width',
            type: 'float',
            Icon: () => <WidthIcon height={18} width={18} />,
            config: {
                width: 100
            }
        } as InputSelect<'width'>,
        {
            action: 'Height',
            type: 'float',
            Icon: () => <HeightIcon height={18} width={18} />,
            config: {
                height: 100
            }
        } as InputSelect<'height'>,
        {
            action: 'Grid Height',
            type: 'int',
            Icon: () => <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.14998 14V1H0.849976V14H2.14998ZM6.14998 14V1H4.84998V14H6.14998ZM10.15 1V14H8.84998V1H10.15ZM14.15 14V1H12.85V14H14.15Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>,
            config: {
                gridHeight: 100
            }
        },
        {
            action: 'Grid Width',
            type: 'int',
            Icon: () => <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 12.85L1 12.85L1 14.15L14 14.15L14 12.85ZM14 8.85002L1 8.85002L1 10.15L14 10.15L14 8.85002ZM1 4.85003L14 4.85003L14 6.15003L1 6.15002L1 4.85003ZM14 0.850025L1 0.850025L1 2.15002L14 2.15002L14 0.850025Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>,
            config: {
                gridWidth: 100
            }
        }
    ]
}
//====== Workspace Settings ============//