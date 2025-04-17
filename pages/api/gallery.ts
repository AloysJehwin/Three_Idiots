import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const galleryPath = path.join(process.cwd(), 'public', 'gallery');

  try {
    const files = fs.readdirSync(galleryPath);
    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    res.status(200).json(imageFiles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load gallery images' });
  }
}
