import * as z from "zod";

export const userSettingsSchema = z.object({
    theme: z.enum(["light", "dark"]).default("light"),
    gridEnabled: z.boolean().default(true),
    defaultHeight: z.number().min(100).max(10000).default(500),
    defaultWidth: z.number().min(100).max(10000).default(450),
    defaultExportFormat: z.enum(["png", "jpg", "svg"]).default("png"),
    timeZone: z.string().default("UTC"),
    openDesignsInNewTab: z.boolean().default(false),
    layout: z.object({
        layersPanel: z.enum(["left", "right"]).default("right"),
        settingsPanel: z.enum(["left", "right"]).default("left"),
        zoomControls: z.enum(["bottom-left", "bottom-right"]).default("bottom-left"),
        aiPanel: z.enum(["bottom-left", "bottom-right"]).default("bottom-right"),
    }).default({
    })
});
export type UserSettings = z.infer<typeof userSettingsSchema>

export const userSettingsDefaults = {
    theme: 'light',
    defaultExportFormat: 'png',
    gridEnabled: false,
    defaultHeight: 500,
    defaultWidth: 450,
    timeZone: 'UTC',
    openDesignsInNewTab: false,
    layout: {
        layersPanel: 'right',
        settingsPanel: 'left',
        zoomControls: 'bottom-left',
        aiPanel: 'bottom-right'
    }
} satisfies UserSettings