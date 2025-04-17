import { useEffect, useState } from 'react';
import Lightbox from '../components/Lightbox';
import { motion } from 'framer-motion';

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
    <div className="bg-violet-100 text-gray-800">
      {/* 🌟 Hero Section with Fullscreen Image */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Full Background Image */}
        <motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          src={featuredImagePath}
          alt="Featured"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Overlay Gradient to boost text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white/40 z-10" />

        {/* 🎀 Top Floating Greeting */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute top-10 sm:top-16 w-full text-center z-20 px-4"
        >
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white drop-shadow-lg">
            HARINI! 
          </h1>
          <p className="mt-3 text-lg sm:text-2xl text-white drop-shadow">
            Here’s a little memory lane for your surprise! 💖
          </p>
        </motion.div>
      </section>

      {/* 📸 Gallery Section */}
      <section className="min-h-screen px-4 py-10 bg-gradient-to-b from-white to-violet-100">
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
