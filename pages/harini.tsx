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
    <div className="bg-black text-gray-100 font-sans overflow-x-hidden">
      {/* 🌟 Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-800 overflow-hidden">
        <motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          src="/front_image/front_1.png"
          alt="Featured"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 z-10" />

        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute top-20 w-full text-center z-20 px-4"
        >
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white drop-shadow-lg">
            Hey Bestie!
          </h1>
          <p className="mt-3 text-lg sm:text-2xl text-gray-200 drop-shadow-md">
            Here’s a little memory lane for your surprise! 💖
          </p>
        </motion.div>
      </section>

      {/* 📱 Mobile View Gallery */}
      <section className="block md:hidden min-h-screen px-2 py-8 bg-black">
        <div className="text-center text-gray-200 text-xl font-semibold mb-6">Your Memories</div>
        <div className="grid grid-cols-2 gap-[2px]">
          {images.map((img, index) => (
            <motion.div
              key={index}
              className="p-[1px]"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.02 }}
              viewport={{ once: true }}
            >
              <img
                src={`/gallery/${img}`}
                alt={`Mobile ${index}`}
                className="rounded-lg w-full h-full object-cover cursor-pointer transition-transform duration-500 ease-in-out hover:scale-105"
                onClick={() => setSelectedImg(`/gallery/${img}`)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🖥️ Desktop View Gallery */}
      <section className="hidden md:block min-h-screen px-1 py-10 bg-gradient-to-b from-gray-900 to-black">
        <div className="w-full max-w-screen-xl mx-auto">
          <p className="mb-8 text-center text-lg sm:text-2xl font-semibold text-gray-300">
            Some Photos Here
          </p>

          <div className="grid grid-cols-12 gap-[3px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {images.map((img, index) => {
              const shapeOptions = [
                'col-span-6 row-span-1',
                'col-span-6 row-span-2',
                'col-span-6 row-span-1',
                'col-span-12 row-span-1',
                'col-span-6 row-span-3',
                'col-span-6 row-span-1',
                'col-span-6 row-span-2',
              ];
              const shapeClass = shapeOptions[index % shapeOptions.length];

              return (
                <motion.div
                  key={index}
                  className={`p-[1.5px] ${shapeClass}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.04, ease: "easeInOut" }}
                  viewport={{ once: true }}
                >
                  <div className="relative w-full h-full overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-500 ease-in-out">
                    <img
                      src={`/gallery/${img}`}
                      alt={`Memory ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-700 ease-in-out hover:scale-105 hover:brightness-110"
                      onClick={() => setSelectedImg(`/gallery/${img}`)}
                    />
                  </div>
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
