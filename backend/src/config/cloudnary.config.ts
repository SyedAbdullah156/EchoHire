import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { env } from "./env.config";

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
});

export const uploadToCloudinary = (
    fileBuffer: Buffer,
    folder: string,
): Promise<any> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            },
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};