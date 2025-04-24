import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { imageUrl }: { imageUrl: string } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ success: false, error: 'Image URL is required' });
    }

    try {
      await client.connect();
      const database = client.db('your-database-name'); // Replace with your DB name
      const collection = database.collection('favorites');

      const image = await collection.findOne({ imageUrl });

      // If image is found, return its favorite status
      if (image) {
        return res.status(200).json({ success: true, isFavorite: !!image.isFavorite });
      } else {
        // If not found, it’s not a favorite
        return res.status(200).json({ success: true, isFavorite: false });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('MongoDB Error:', error.message);
        return res.status(500).json({ success: false, error: 'Failed to fetch favorite status', details: error.message });
      } else {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: false, error: 'Unexpected error occurred' });
      }
    } finally {
      await client.close();
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
