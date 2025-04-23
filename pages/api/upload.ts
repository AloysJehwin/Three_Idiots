import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// AWS S3 Setup
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Multer setup
const upload = multer({ storage: multer.memoryStorage() });

// Helper function to handle multer middleware
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
};

// Disable Next.js built-in body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Extend NextApiRequest type to include 'file'
interface NextApiRequestWithFile extends NextApiRequest {
  file: any;
}

// API Route Handler
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      // Run middleware to handle file upload
      await runMiddleware(req, res, upload.single('file'));

      const { folder } = req.body;
      const file = (req as NextApiRequestWithFile).file;

      if (!file || !folder) {
        return res.status(400).json({ error: 'File and folder are required' });
      }

      // Create S3 upload params
      const key = `${folder}/${Date.now()}-${file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      // Upload to S3
      await s3.send(command);

      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      res.status(200).json({ message: 'Upload successful', url: fileUrl });
    } catch (err) {
      console.error('Error in middleware:', err);
      res.status(500).json({ error: 'Multer middleware error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default handler;
