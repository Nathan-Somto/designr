import { AngleIcon, DashIcon, DimensionsIcon, FontSizeIcon, HeightIcon, LetterSpacingIcon, LineHeightIcon, OpacityIcon, ShadowOuterIcon, WidthIcon } from "@designr/ui/react-icons";
import { AlignCenterHorizontal, AlignCenterIcon, AlignCenterVerticalIcon, AlignHorizontalJustifyEndIcon, AlignHorizontalJustifyStartIcon, AlignLeftIcon, AlignRightIcon, AlignVerticalJustifyEndIcon, AlignVerticalJustifyStartIcon, BoxSelectIcon, CaseLowerIcon, CaseSensitiveIcon, CaseUpperIcon, CircleIcon, FilterIcon, ItalicIcon, MenuIcon, MoveHorizontalIcon, MoveVerticalIcon, SlashIcon, SquareIcon, StretchHorizontal, StretchVertical, Strikethrough, TypeIcon, Underline, X } from "lucide-react";
import { ButtonSelect, InputSelect, OptionsSelect, SettingsSection } from "../../types";
//===== Alignment Settings ===========//
export const alignment: ButtonSelect<'align'> = {
    label: 'Alignment',
    options: [{
        Icon: () => <AlignHorizontalJustifyStartIcon size={18} />,
        action: 'Align horizontal left',
        config: {
            property: 'align',
            value: 'left'
        }
    },
    {
        Icon: () => <AlignCenterHorizontal size={18} />,
        action: 'Align Horizontal Center',
        config: {
            property: 'align',
            value: 'centerH'
        }
    },
    {
        Icon: () => <AlignHorizontalJustifyEndIcon size={18} />,
        action: 'Align Horizontal Right',
        config: {
            property: 'align',
            value: 'right'
        }
    },
    {
        Icon: () => <AlignVerticalJustifyStartIcon size={18} />,
        action: 'Align Vertical Top',
        config: {
            property: 'align',
            value: 'top'
        }
    },
    {
        Icon: () => <AlignCenterVerticalIcon size={18} />,
        action: 'Align Vertical Center',
        config: {
            property: 'align',
            value: 'centerV'
        }
    },
    {
        Icon: () => <AlignVerticalJustifyEndIcon size={18} />,
        action: 'Align Vertical Bottom',
        config: {
            property: 'align',
            value: 'bottom'
        }
    }
    ]

}
//===== Element Settings ===========//
export const element: SettingsSection<
    'y' | 'x' | 'width' | 'height' | 'diameter' | 'angle' | 'cornerSize'
> = {
    label: 'Position',
    inputs: [
        {
            action: 'X axis',
            type: 'int',
            Icon: () => <X size={18} />,
            config: {
                property: 'x',
                value: 0
            }
        },
        {
            action: 'Y axis',
            type: 'int',
            Icon: () =>
                <svg xmlns="http://www.w3.org/2000/svg" strokeWidth={'0.1'} width="18px" height="18px" viewBox="0 0 128 128" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet">
                    <path d="M114.89 16.69a2.36 2.36 0 0 0-2.09-1.25H90.5c-.77 0-1.5.38-1.94 1.02L64 51.74L39.43 16.45a2.346 2.346 0 0 0-1.94-1.02h-22.3c-.87 0-1.67.48-2.08 1.25s-.36 1.71.12 2.43l36.58 54.56v44.58c0 1.29 1.05 2.33 2.34 2.33h23.71c1.29 0 2.34-1.04 2.34-2.33V73.68l36.57-54.56c.48-.72.53-1.66.12-2.43z" fill="currentColor" />
                </svg>,
            config: {
                property: 'y',
                value: 0
            }
        },
        {
            action: 'Width',
            type: 'float',
            Icon: () => <MoveHorizontalIcon height={18} width={18} />,
            config: {
                property: 'width',
                value: 100
            }
        },
        {
            action: 'Height',
            type: 'float',
            Icon: () => <MoveVerticalIcon height={18} width={18} />,
            config: {
                property: 'height',
                value: 100
            }
        },
        {
            action: 'Diameter',
            type: 'float',
            Icon: () => <CircleIcon size={18} />,
            config: {
                property: 'diameter',
                value: 100
            }
        },
        {
            action: 'Angle',
            type: 'float',
            Icon: () => <AngleIcon height={18} width={18} />,
            config: {
                property: 'angle',
                value: 0
            }
        },
        {
            action: 'Corner Radius',
            type: 'int',
            Icon: () => <BoxSelectIcon height={18} width={18} />,
            config: {
                property: 'cornerSize',
                value: 0
            }
        }
    ]
}
//===== Element Settings ===========//
//==== Transform Settings =======//
export const transform: SettingsSection<'scaleX' | 'scaleY' | 'skewX' | 'skewY'> = {
    label: 'Transform',
    inputs: [
        {
            action: 'Scale X',
            type: 'float',
            Icon: () => <StretchHorizontal size={18} />,
            config: {
                property: 'scaleX',
                value: 1
            }
        },
        {
            action: 'Scale Y',
            type: 'float',
            Icon: () => <StretchVertical size={18} />,
            config: {
                property: 'scaleY',
                value: 1
            }
        },
        {
            action: 'Skew X',
            type: 'float',
            Icon: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.125 -0.125 4 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" id="Skew-X--Streamline-Tabler" height="20" width="20">
                <path d="M0.625 0.81328125v2.1234375a0.15625 0.15625 0 0 0 0.185 0.15359375l2.1875 -0.41015625A0.15625 0.15625 0 0 0 3.125 2.5265625000000003V1.2234375a0.15625 0.15625 0 0 0 -0.1275 -0.15359375l-2.1875 -0.41015625A0.15625 0.15625 0 0 0 0.625 0.81328125z" stroke-width="0.25"></path>
            </svg>,
            config: {
                property: 'skewX',
                value: 0
            }
        },
        {
            action: 'Skew Y',
            type: 'float',
            Icon: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" id="Skew-Y--Streamline-Tabler" height="20" width="20">
                <path d="M2.70375 11.875h9.592500000000001a0.625 0.625 0 0 0 0.60125 -0.796875l-2.143125 -7.5A0.625 0.625 0 0 0 10.153749999999999 3.125H4.8462499999999995a0.625 0.625 0 0 0 -0.600625 0.453125l-2.143125 7.5A0.625 0.625 0 0 0 2.70375 11.875z" stroke-width="1"></path>
            </svg>,
            config: {
                property: 'skewY',
                value: 0
            }
        }
    ]
}
//======= Text Settings ===========//
export const TextAlignment: ButtonSelect<'textAlign'> = {
    label: 'Alignment',
    options: [{
        Icon: () => <AlignLeftIcon size={18} />,
        action: 'Left',
        config: {
            property: 'textAlign',
            value: 'left'
        }
    },
    {
        Icon: () => <AlignCenterIcon size={18} />,
        action: 'Center',
        config: {
            property: 'textAlign',
            value: 'center'
        }
    },
    {
        Icon: () => <AlignRightIcon size={18} />,
        action: 'Right',
        config: {
            property: 'textAlign',
            value: 'right'
        }
    }]
}
export const letterSpacing: InputSelect<'letterSpacing'> = {
    action: "Letter Spacing",
    type: "int",
    Icon: () => <LetterSpacingIcon />,
    config: {
        property: 'letterSpacing',
        value: 0.1
    }

}
export const lineHeight: InputSelect<'lineHeight'> =
{
    action: "Line Height",
    type: "float",
    Icon: () => <LineHeightIcon />,
    config: {
        property: 'lineHeight',
        value: 1.5
    }
}
export const decoration: ButtonSelect<'textDecoration'> = {
    label: 'Text Decoration',
    options: [
        {
            Icon: () => <DashIcon height={18} width={18} />,
            action: 'None',
            config: {
                property: 'textDecoration',
                value: 'none'
            }
        }, {
            Icon: () => <Underline size={18} />,
            action: 'Underline',
            config: {
                property: 'textDecoration',
                value: 'underline'
            }
        },
        {
            Icon: () => <Strikethrough size={18} />,
            action: 'Line Through',
            config: {
                property: 'textDecoration',
                value: 'line-through'
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
                property: 'textTransform',
                value: 'uppercase'
            }
        },
        {
            Icon: () => <CaseLowerIcon size={18} />,
            action: 'Lower Case',
            config: {
                property: 'textTransform',
                value: 'lowercase'
            }
        },
        {
            Icon: () => <CaseSensitiveIcon size={18} />,
            action: 'Capitalize',
            config: {
                property: 'textTransform',
                value: 'capitalize'
            }
        }
    ]
}
export const fontFamily: OptionsSelect<'fontFamily'> =

{
    action: 'Font Family',
    type: 'select',
    config: {
        property: 'fontFamily',
        value: 'Arial'
    },
    options: ['Arial', 'Times New Roman', 'Courier New', 'Verdana', 'Comic Sans MS', 'Impact', 'Georgia', 'Trebuchet MS', 'Tahoma', 'Lucida Console'],
    Icon: () => <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" id="Font-Family--Streamline-Radix" height="18" width="1">
        <path d="M2.6666666666666665 4.8C2.6666666666666665 3.3054506666666668 3.838784 2.1333333333333333 5.333333333333333 2.1333333333333333h7.998933333333333c0.29461333333333334 0 0.5344 0.238784 0.5344 0.5333333333333333s-0.23882666666666666 0.5333333333333333 -0.5333333333333333 0.5333333333333333H9.271936l-0.30650666666666665 0.911552c-0.23082666666666668 0.6858026666666666 -0.545152 1.6185493333333334 -0.8791253333333333 2.606250666666667 -0.08354133333333333 0.24706133333333333 -0.168352 0.49769599999999997 -0.25342933333333334 0.748864H9.066666666666666c0.29454933333333333 0 0.5333333333333333 0.238784 0.5333333333333333 0.5333333333333333s-0.238784 0.5333333333333333 -0.5333333333333333 0.5333333333333333H7.471007999999999c-0.465952 1.3711253333333333 -0.8957013333333333 2.6253866666666665 -1.1158186666666665 3.2411733333333337 -0.34316800000000003 0.96 -0.800928 1.5435733333333335 -1.3766186666666667 1.8551466666666667 -0.5376639999999999 0.2910933333333333 -1.0942613333333333 0.2906666666666667 -1.4758719999999999 0.29034666666666664l-0.036031999999999995 0c-0.3240106666666666 0 -0.5866666666666667 -0.26272 -0.5866666666666667 -0.5866666666666667 0 -0.32405333333333336 0.262656 -0.5866666666666667 0.5866666666666667 -0.5866666666666667 0.41794133333333333 0 0.6970666666666666 -0.010133333333333333 0.9533226666666667 -0.14880000000000002 0.23540266666666665 -0.12746666666666667 0.5456853333333334 -0.42208 0.8303253333333332 -1.2183466666666667 0.19709866666666667 -0.5513600000000001 0.5670186666666667 -1.6287573333333334 0.9813653333333333 -2.8461866666666666H4.8c-0.29454933333333333 0 -0.5333333333333333 -0.238784 -0.5333333333333333 -0.5333333333333333s0.238784 -0.5333333333333333 0.5333333333333333 -0.5333333333333333h1.7939946666666666c0.12736 -0.37562666666666666 0.2554133333333333 -0.753888 0.38079999999999997 -1.1247040000000001 0.33373866666666663 -0.9870293333333334 0.6478933333333334 -1.919232 0.8786026666666666 -2.604704L8.034048 3.2H5.333333333333333c-0.9054506666666666 0 -1.6 0.6945493333333334 -1.6 1.6 0 0.29454933333333333 -0.238784 0.5333333333333333 -0.5333333333333333 0.5333333333333333s-0.5333333333333333 -0.238784 -0.5333333333333333 -0.5333333333333333Z" fill="#000000" stroke-width="1.0667"></path>
    </svg>

}
export const fontWeight: OptionsSelect<'fontWeight'> =
{
    action: 'Font Weight',
    type: 'select',
    config: {
        property: 'fontWeight',
        value: 'normal'
    },
    options: ['normal', 'bold', 'lighter', 'bolder'],
    Icon: () => <TypeIcon />
}
export const fontSize: InputSelect<'fontSize'> =
{
    action: 'Font Size',
    type: 'int',
    config: {
        property: 'fontSize',
        value: 16
    },
    Icon: () => <FontSizeIcon />,
}
export const fontStyle: ButtonSelect<'fontStyle'> =
{
    label: 'Font Style',
    options: [{
        Icon: () => <TypeIcon />,
        action: 'Normal',
        config: {
            property: 'fontStyle',
            value: 'normal'
        }
    },
    {
        Icon: () => <ItalicIcon />,
        action: 'Italic',
        config: {
            property: 'fontStyle',
            value: 'italic'
        }
    },
    {
        Icon: () => <SlashIcon />,
        action: 'Oblique',
        config: {
            property: 'fontStyle',
            value: 'oblique'
        }
    }
    ]

}
//======= Text Settings ===========//
//====== Appearance Settings ============//
export const filter: OptionsSelect<'filter'> = {
    action: 'Filter',
    type: 'select',
    config: {
        property: 'filter',
        value: 'greyscale'
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
        property: 'opacity',
        value: 100
    }
}
export const fill: InputSelect<'fill'> = {
    action: 'Fill',
    type: 'color',
    Icon: () => <SquareIcon size={18} />,
    config: {
        property: 'fill',
        value: '#000000'
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
                property: 'shadow.color',
                value: '#000000'
            },
            action: 'Shadow Color',
        } as InputSelect<'shadow.color'>,
        {
            Icon: () => <SquareIcon size={18} />,
            type: 'int',
            config: {
                property: 'shadow.offsetX',
                value: 0
            },
            action: 'Shadow X',
        } as InputSelect<'shadow.offsetX'>,
        {
            Icon: () => <svg xmlns="http://www.w3.org/2000/svg" strokeWidth={'0.1'} width="18px" height="18px" viewBox="0 0 128 128" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet">
                <path d="M114.89 16.69a2.36 2.36 0 0 0-2.09-1.25H90.5c-.77 0-1.5.38-1.94 1.02L64 51.74L39.43 16.45a2.346 2.346 0 0 0-1.94-1.02h-22.3c-.87 0-1.67.48-2.08 1.25s-.36 1.71.12 2.43l36.58 54.56v44.58c0 1.29 1.05 2.33 2.34 2.33h23.71c1.29 0 2.34-1.04 2.34-2.33V73.68l36.57-54.56c.48-.72.53-1.66.12-2.43z" fill="currentColor" />
            </svg>,
            type: 'int',
            config: {
                property: 'shadow.offsetY',
                value: 0
            },
            action: 'Shadow Y',
        } as InputSelect<'shadow.offsetY'>,
        {
            Icon: () => <ShadowOuterIcon />,
            type: 'int',
            config: {
                property: 'shadow.blur',
                value: 0
            },
            action: 'Shadow Blur',
        } as InputSelect<'shadow.blur'>,

    ]
}
//====== Effect Settings ============//
//==== Stroke Settings =====//
export const stroke = {
    label: 'stroke',
    inputs: [
        {
            action: 'Stroke Color',
            config: {
                property: 'strokeColor',
                value: '#000'
            },
            type: 'color'
        } as InputSelect<'strokeColor'>,
        {
            action: 'Stroke Width',
            config: {
                property: 'strokeWidth',
                value: 0
            },
            Icon: () => <MenuIcon size={18} />,
            type: 'int'
        } as InputSelect<'strokeWidth'>,
    ],
    select: {
        options: [
            'dashed',
            'dotted',
            "groove",
            "solid",
            'double'
        ],
        action: 'Stroke Style',
        config: {
            property: 'borderStyle',
            value: 'solid'
        },
    } as OptionsSelect<'borderStyle'>
}
//====== Workspace Settings ============//
export const workspace = {
    selects: {
        action: "File Sizes",
        type: 'select',
        config: {
            property: 'dimension',
            value: '525x300'
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
                property: 'width',
                value: 100
            }
        } as InputSelect<'width'>,
        {
            action: 'Height',
            type: 'float',
            Icon: () => <HeightIcon height={18} width={18} />,
            config: {
                property: 'height',
                value: 100
            }
        } as InputSelect<'height'>,
        {
            action: 'Grid Height',
            type: 'int',
            Icon: () => <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.14998 14V1H0.849976V14H2.14998ZM6.14998 14V1H4.84998V14H6.14998ZM10.15 1V14H8.84998V1H10.15ZM14.15 14V1H12.85V14H14.15Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>,
            config: {
                property: 'gridHeight',
                value: 100
            }
        },
        {
            action: 'Grid Width',
            type: 'int',
            Icon: () => <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 12.85L1 12.85L1 14.15L14 14.15L14 12.85ZM14 8.85002L1 8.85002L1 10.15L14 10.15L14 8.85002ZM1 4.85003L14 4.85003L14 6.15003L1 6.15002L1 4.85003ZM14 0.850025L1 0.850025L1 2.15002L14 2.15002L14 0.850025Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>,
            config: {
                property: 'gridWidth',
                value: 100
            }
        }
    ]
}
//====== Workspace Settings ============//