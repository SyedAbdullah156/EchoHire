import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isPDF = file.mimetype === "application/pdf";
        return {
            folder: isPDF ? "echohire/resumes" : "echohire/logos",
            resource_type: "auto", // Allows images AND pdfs
            public_id: `${file.fieldname}-${Date.now()}`,
        };
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for PDFs
});

export default upload;
