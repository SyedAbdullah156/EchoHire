import multer from "multer";

// Hold the file in memory (RAM) as a Buffer
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 8 * 1024 * 1024, // 8MB to accommodate base64 encoded images
    },
});

export default upload;