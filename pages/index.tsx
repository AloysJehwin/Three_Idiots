import { useEffect, useState } from 'react';
import Lightbox from '../components/Lightbox';

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const featuredImagePath = '/front_image/front_1.png';

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then((data: string[]) => setImages(data))
      .catch(err => console.error('Failed to load gallery', err));
  }, []);

  return (
    <div className="bg-pink-100 text-gray-800">
      {/* 🎀 Page Title */}
      <header className="w-full py-4 bg-pink-200 text-center shadow-md sticky top-0 z-50">
        <h1 className="text-2xl sm:text-4xl font-bold text-pink-700">
          🎉 Surprise Party Gallery 🎉
        </h1>
      </header>

      {/* 🌟 Full-Screen Featured Image */}
      <section className="relative w-full h-[100vh] bg-white flex items-center justify-center">
        <img
          src={featuredImagePath}
          alt="Featured"
          className="object-contain h-[80%] max-w-full transition-transform hover:scale-105 cursor-pointer drop-shadow-2xl"
          onClick={() => setSelectedImg(featuredImagePath)}
        />
      </section>

      {/* 📸 Gallery */}
      <section className="min-h-screen px-4 py-10 bg-gradient-to-b from-white to-pink-100">
        <div className="mx-auto max-w-screen-lg">
          <p className="mb-8 text-center text-lg text-gray-700">
            Moments that made this day extra special 💖
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((img, index) => (
              <div key={index} className="overflow-hidden rounded-xl shadow-md">
                <img
                  src={`/gallery/${img}`}
                  alt={`Memory ${index + 1}`}
                  className="w-full h-full object-cover transition-transform hover:scale-105 cursor-pointer"
                  onClick={() => setSelectedImg(`/gallery/${img}`)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 💡 Lightbox */}
      <Lightbox selectedImg={selectedImg} onClose={() => setSelectedImg(null)} />
    </div>
  );
}
