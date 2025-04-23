// pages/api/s3url.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextApiRequest, NextApiResponse } from "next";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// ✅ Define the handler function
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { filename, folder, type } = req.query;

  if (!filename || !folder || !type) {
    return res.status(400).json({ error: "Missing required query params" });
  }

  const key = `${folder}/${Date.now()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    ContentType: type as string,
  });

  try {
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 }); // valid for 1 min
    return res.status(200).json({ url: signedUrl, key });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return res.status(500).json({ error: "Failed to generate signed URL" });
  }
}

// ✅ Default export is MANDATORY
export default handler;
