/* eslint-disable turbo/no-undeclared-env-vars */
'use server';
import { promiseCatch } from "#/utils/promise-catch"
import { BadRequestError, UnauthorizedError } from "@designr/api-errors";

const uploadImageToCloudinary = async (formData: FormData) => {

    return promiseCatch((async () => {
        const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
        const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;
        const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
        //console.log("api key:", CLOUDINARY_API_KEY);
        //console.log("upload preset: ", CLOUDINARY_UPLOAD_PRESET);
        //console.log("cloud name:", CLOUDINARY_CLOUD_NAME);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET!);
        //formData.append("api_key", CLOUDINARY_API_KEY!);
        if (!CLOUDINARY_CLOUD_NAME) {
            throw new UnauthorizedError("Cloudinary cloud name is not set.");
        }
        if (!CLOUDINARY_API_KEY || !CLOUDINARY_UPLOAD_PRESET) {
            throw new UnauthorizedError("Cloudinary API key or upload preset is not set.");
        }
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData,
        }
        )
        //console.log("response: ", response);
        if (!response.ok) {
            throw new BadRequestError(`Cloudinary upload failed: ${response.statusText}`);
        }
        const data = await response.json();
        //console.log("the data: ", data);
        return (data?.secure_url ?? data?.url) as string;
    })()
    )

}
export { uploadImageToCloudinary }