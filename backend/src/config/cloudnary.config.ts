// src/routes/upload.ts
import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadBufferToCloudinary = (buffer: Buffer, options: Record<string, unknown> = {}) =>
  new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });

router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const result = await uploadBufferToCloudinary(file.buffer, { folder: 'your-folder' });
    return res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
