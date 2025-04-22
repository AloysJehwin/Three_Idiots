import { useEffect, useState } from 'react';
import Lightbox from '../components/Lightbox';
import { motion } from 'framer-motion';

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const frontImages = [
    '/front_image/front_1.png',
    '/front_image/front_1.png',
    '/front_image/front_1.png',
    '/front_image/front_1.png',
    '/front_image/front_1.png',
  ];
  const [currentFrontIndex, setCurrentFrontIndex] = useState(0);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then((data: string[]) => setImages(data))
      .catch(err => console.error('Failed to load gallery', err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrontIndex(prev => (prev + 1) % frontImages.length);
    }, 4000); // Change every 4s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    const section = document.getElementById('gallery-section');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <div className="bg-black text-gray-100 font-sans overflow-x-hidden">
      {/* 🌟 Hero Section Slideshow */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Slideshow Images */}
        <div className="absolute inset-0 w-full h-full z-0">
          {frontImages.map((src, idx) => (
            <motion.img
              key={idx}
              src={src}
              alt={`Slide ${idx}`}
              className="absolute w-full h-full object-cover"
              initial={false}
              animate={{
                opacity: currentFrontIndex === idx ? 1 : 0,
                scale: currentFrontIndex === idx ? 1 : 1.05,
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          ))}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 z-10" />

        {/* Hero Text */}
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

      {/* 📱 Mobile View Gallery - Masonry Style */}
      <section id="gallery-section" className="block md:hidden min-h-screen px-2 py-8 bg-black">
        <div className="text-center text-gray-200 text-xl font-semibold mb-6">Your Memories</div>

        {/* Masonry layout using Tailwind's columns and avoiding breaks */}
        <div className="columns-3 gap-1 space-y-1 px-1">
          {images.map((img, index) => {
            // Define 3 sets of shapes (heights)
            const heightOptions = ['h-32', 'h-40', 'h-48']; // 3 height sets
            const randomHeight = heightOptions[index % heightOptions.length];

            return (
              <motion.div
                key={index}
                className={`relative w-full ${randomHeight} overflow-hidden rounded-md border-2 border-white break-inside-avoid`}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: 'easeInOut',
                  delay: index * 0.05,
                }}
                viewport={{ once: true }}
              >
                <img
                  src={`/gallery/${img}`}
                  alt={`Memory ${index}`}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-500 ease-in-out hover:scale-105"
                  onClick={() => setSelectedImg(`/gallery/${img}`)}
                />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 🖥️ Desktop View Gallery (No Animation) */}
      <section className="hidden md:block min-h-screen px-1 py-10 bg-gradient-to-b from-gray-900 to-black">
        <div className="w-full max-w-screen-xl mx-auto">
          <p className="mb-8 text-center text-lg sm:text-2xl font-semibold text-gray-300">
            Some Photos Here
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {images.map((img, index) => (
              <div key={index}>
                <div className="relative w-full aspect-square overflow-hidden rounded-xl shadow-md border-2 border-white hover:shadow-xl transition-all duration-500 ease-in-out">
                  <img
                    src={`/gallery/${img}`}
                    alt={`Memory ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover cursor-pointer transition-transform duration-700 ease-in-out hover:scale-105 hover:brightness-110"
                    onClick={() => setSelectedImg(`/gallery/${img}`)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 💡 Lightbox */}
      <Lightbox selectedImg={selectedImg} onClose={() => setSelectedImg(null)} />

      {/* Plus Icon */}
      {isVisible && (
        <div
          className="fixed bottom-10 right-10 bg-blue-500 text-white p-4 rounded-full cursor-pointer shadow-lg transition-transform duration-300 hover:scale-110"
          onClick={() => setSelectedImg('/gallery/some-image.jpg')} // Replace with a relevant action
        >
          <span className="text-3xl">+</span>
        </div>
      )}
    </div>
  );
}
