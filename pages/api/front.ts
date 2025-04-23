import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const folderName = req.query.folder as string;

  if (!folderName) {
    return res.status(400).json({ error: 'Missing folder name in query parameter' });
  }

  const frontImagePath = path.join(process.cwd(), 'public', folderName);

  try {
    const files = fs.readdirSync(frontImagePath);
    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    res.status(200).json(imageFiles);
  } catch (error) {
    res.status(500).json({ error: `Failed to load image files from folder "${folderName}"` });
  }
}
