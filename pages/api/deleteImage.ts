// /pages/api/imageDelete.ts
import { S3Client, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { NextApiRequest, NextApiResponse } from 'next';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { imageUrl, mode } = req.body;
  if (!imageUrl) return res.status(400).json({ error: 'Missing imageUrl' });

  const url = new URL(imageUrl);
  const key = decodeURIComponent(url.pathname.substring(1));

  try {
    if (mode === 'download') {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        ResponseContentDisposition: 'attachment',
      });

      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 }); // 1 minute
      return res.status(200).json({ url: signedUrl });
    } else {
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
      });

      await s3.send(command);
      return res.status(200).json({ message: 'Image deleted successfully' });
    }
  } catch (error) {
    console.error('S3 operation error:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}
