import { Request, Response } from "express";
import crypto from "node:crypto";
import multer from "multer";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "uploads";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const storage = multer.memoryStorage();
export const uploadMenu = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WebP, and AVIF files are accepted."));
    }
  },
});

// Magic bytes for allowed image types (offset: where signature starts in file)
const MAGIC_BYTES: Record<string, { offset: number; bytes: number[] }[]> = {
  "image/jpeg": [{ offset: 0, bytes: [0xFF, 0xD8, 0xFF] }],
  "image/png": [{ offset: 0, bytes: [0x89, 0x50, 0x4E, 0x47] }],
  "image/webp": [{ offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] }], // RIFF
  "image/avif": [{ offset: 4, bytes: [0x66, 0x74, 0x79, 0x70] }], // "ftyp" box at offset 4
};

function verifyMagicBytes(buffer: Buffer, mimetype: string): boolean {
  const signatures = MAGIC_BYTES[mimetype];
  if (!signatures || signatures.length === 0) return true;
  return signatures.some((sig) =>
    sig.bytes.every((byte, i) => buffer[sig.offset + i] === byte)
  );
}

export const handleUpload = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "Please select a file." });
    return;
  }

  // Verify file content matches declared MIME type
  if (!verifyMagicBytes(req.file.buffer, req.file.mimetype)) {
    res.status(400).json({ error: "File content does not match the declared type." });
    return;
  }

  try {
    const filename = crypto.randomUUID() + ".webp";
    const isHero = req.query.type === "hero";

    let sharpInstance = sharp(req.file.buffer);

    if (isHero) {
      // Hero: 16:9 wide banner
      sharpInstance = sharpInstance.resize({ width: 1920, height: 1080, fit: "cover" });
    } else {
      // Product/category: 4:5 vertical card (Instagram-like)
      sharpInstance = sharpInstance.resize({ width: 800, height: 1000, fit: "cover" });
    }

    const buffer = await sharpInstance.webp({ quality: 82 }).toBuffer();

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filename, buffer, { contentType: "image/webp", upsert: false });

    if (error) throw error;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);

    res.json({ url: data.publicUrl });
  } catch (error) {
    console.error("Image processing error:", error);
    res.status(500).json({ error: "An error occurred while processing the image." });
  }
};
