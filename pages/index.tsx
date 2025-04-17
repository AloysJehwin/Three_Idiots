import { useEffect, useState } from 'react';
import Lightbox from '../components/Lightbox';
import { motion } from 'framer-motion';

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then((data: string[]) => setImages(data))
      .catch(err => console.error('Failed to load gallery', err));
  }, []);

  return (
    <div className="bg-violet-100 text-gray-800 font-sans overflow-x-hidden">
      {/* 🌟 Hero Section with Fullscreen Image */}
      <section className="relative w-full h-screen flex items-center justify-center bg-gradient-to-b from-violet-100 to-white overflow-hidden">
        <motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          src="/front_image/front_1.png"
          alt="Featured"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white/40 z-10" />

        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute top-20 w-full text-center z-20 px-4"
        >
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white drop-shadow-lg">
            Hey Bestie!
          </h1>
          <p className="mt-3 text-lg sm:text-2xl text-white drop-shadow-md">
            Here’s a little memory lane for your surprise! 💖
          </p>
        </motion.div>
      </section>

      {/* 📸 Gallery Section */}
      <section className="min-h-screen px-0 py-10 bg-gradient-to-b from-white to-violet-100">
        <div className="w-full max-w-screen-xl mx-auto">
          <p className="mb-8 text-center text-lg sm:text-2xl font-semibold text-gray-700">
            Moments that made this day extra special 💖
          </p>

          {/* Gallery Grid Layout */}
          <div className="grid grid-cols-12 gap-2 auto-rows-[200px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {images.map((img, index) => {
              const shapeOptions = [
                'col-span-6 row-span-2', // Tall portrait
                'col-span-6 row-span-3', // Wide landscape
                'col-span-6 row-span-6', // Square-ish
                'col-span-6 row-span-4', // Mid landscape
                'col-span-6 row-span-3', // Big box
              ];

              const randomShape = shapeOptions[index % shapeOptions.length];

              return (
                <motion.div
                  key={index}
                  className={`relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all ${randomShape}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <img
                    src={`/gallery/${img}`}
                    alt={`Memory ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedImg(`/gallery/${img}`)}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 💡 Lightbox */}
      <Lightbox selectedImg={selectedImg} onClose={() => setSelectedImg(null)} />
    </div>
  );
}
