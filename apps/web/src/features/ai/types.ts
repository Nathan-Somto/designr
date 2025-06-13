import { AI_ACTIONS } from "#/constants/ai-actions";

type AiActions = keyof typeof AI_ACTIONS
type Payload = {
    type: AiActions;
    content: string;
    /** the content can be json or an image url for the ai generated image. */
}
interface CommonPayload {
    prompt: string;
    timestamp: Date;
};
interface ImageGenerationPayload extends CommonPayload {
    secureImageUrl?: string;
    imageBuffer?: string;
};

interface TextToDesignPayload extends CommonPayload {
    json?: string;
    pngPreview?: string;
};

export type { AiActions, TextToDesignPayload, ImageGenerationPayload, Payload };
