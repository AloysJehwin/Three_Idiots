import { useEffect, useState } from 'react';

export default function Home() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/fetch-image') // Request to fetch images from S3
      .then((response) => response.json())
      .then((data) => setImages(data)) // Store image URLs in state
      .catch((error) => console.error('Error fetching images:', error));
  }, []);

  return (
    <div className="gallery">
      {images.length === 0 ? (
        <p>Loading images...</p>
      ) : (
        images.map((image, index) => (
          <img key={index} src={image} alt={`Image ${index + 1}`} />
        ))
      )}
    </div>
  );
}
