import type { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk';

// Load AWS credentials from environment variables
const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS environment variables are missing.');
}

// Configure AWS SDK
const s3 = new AWS.S3({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = 'three-idiots-bucket'; // Your S3 bucket name

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const folder = req.query.folder as string;

  if (!folder) {
    return res.status(400).json({ error: 'Missing folder name in query parameter' });
  }

  try {
    const params = {
      Bucket: BUCKET_NAME,
      Prefix: folder.endsWith('/') ? folder : `${folder}/`, // Ensure folder ends with "/"
      MaxKeys: 100,
    };

    const data = await s3.listObjectsV2(params).promise();

    if (!data.Contents || data.Contents.length === 0) {
      return res.status(404).json({ error: 'No images found in the specified folder.' });
    }

    const imageUrls = data.Contents
      .filter(item => item.Key && !item.Key.endsWith('/')) // Exclude folders
      .map(item => `https://${BUCKET_NAME}.s3.${s3.config.region}.amazonaws.com/${item.Key}`);

    res.status(200).json(imageUrls);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images from S3' });
  }
}
