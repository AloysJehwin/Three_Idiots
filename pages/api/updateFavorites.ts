import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || ''; // Ensure the URI is correctly set in your .env file
const client = new MongoClient(uri);

export const config = { runtime: "nodejs" };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { imageUrl, isFavorite }: { imageUrl: string; isFavorite: boolean } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ success: false, error: 'Image URL is required' });
    }

    try {
      await client.connect();
      const database = client.db('your-database-name'); // Replace with your actual database name
      const collection = database.collection('favorites');

      // Check if the image already exists in the MongoDB collection
      const image = await collection.findOne({ imageUrl });

      if (image) {
        // If image exists, update its favorite status
        const result = await collection.updateOne(
          { imageUrl },
          { $set: { isFavorite } } // Update the favorite status
        );
        console.log('Update result:', result);
        return res.status(200).json({ success: true, message: `Image favorite status updated to ${isFavorite ? 'Favorite' : 'Not Favorite'}` });
      } else {
        // If image doesn't exist, insert it as a new image with the favorite status
        const result = await collection.insertOne({ imageUrl, isFavorite });
        console.log('Insert result:', result);
        return res.status(200).json({ success: true, message: 'Image added and marked as ' + (isFavorite ? 'Favorite' : 'Not Favorite') });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('MongoDB Error:', error.message);
        return res.status(500).json({ success: false, error: 'Failed to update favorite status', details: error.message });
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
