import { useEffect, useState } from 'react';
import Lightbox from '../components/Lightbox';
import { motion } from 'framer-motion';

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const [frontImages, setFrontImages] = useState<string[]>([]);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [blurEffect, setBlurEffect] = useState(false);
  const [showPlusIcon, setShowPlusIcon] = useState(false);
  const [isLaptopView, setIsLaptopView] = useState(false);

  const spring = {
    type: 'spring',
    stiffness: 70,
    damping: 20,
    mass: 0.5,
  } as const;

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLaptopView(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // ✅ Shuffle function
  const shuffleArray = (arr: string[]) => {
    return arr
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  // ✅ Fetch and mix images from both folders
  useEffect(() => {
    Promise.all([
      fetch('/api/fetch-image?folder=jeslin_rindhiya').then((res) => res.json()),
      fetch('/api/fetch-image?folder=group').then((res) => res.json()),
    ]).then(([rindhiyaImages, groupImages]: [string[], string[]]) => {
      const all = [...rindhiyaImages, ...groupImages].filter((file) =>
        file.match(/\.(jpg|jpeg|png|gif)$/i)
      );
      setImages(shuffleArray(all));
    });

    fetch('/api/front?folder=jeslin_front_image')
      .then((r) => r.json())
      .then((data: string[]) => {
        const validFrontImages = data.filter((file) => file.match(/\.(jpg|jpeg|png|gif)$/i));
        setFrontImages(validFrontImages);
      });
  }, []);

  useEffect(() => {
    if (frontImages.length > 0 && !isLaptopView) {
      const interval = setInterval(() => {
        if (!isTransitioning) {
          setIsTransitioning(true);
          setBlurEffect(true);
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % frontImages.length);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [frontImages, isTransitioning, isLaptopView]);

  useEffect(() => {
    const handleScroll = () => {
      const gallery = document.getElementById('gallery');
      if (gallery) {
        const rect = gallery.getBoundingClientRect();
        setShowPlusIcon(rect.top < window.innerHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    setBlurEffect(false);
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  return (
    <div className="bg-black text-gray-100 font-sans overflow-x-hidden">
      {/* 🌟 Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* ✅ Background for Mobile (with transition) */}
        {!isLaptopView && frontImages.length > 0 && (
          <motion.div
            className="absolute inset-0 w-full h-full"
            key={frontImages[currentImageIndex]}
            initial={{ opacity: 0, filter: blurEffect ? 'blur(15px)' : 'blur(0)' }}
            animate={{ opacity: 1, filter: blurEffect ? 'blur(0px)' : 'blur(0)' }}
            exit={{ opacity: 0, filter: 'blur(15px)' }}
            transition={{
              duration: 1.5,
              ease: 'easeInOut',
              onComplete: handleTransitionEnd,
            }}
          >
            <motion.div
              className="w-full h-full flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'spring', stiffness: 90, damping: 30, mass: 1, duration: 1.5 }}
            >
              <img
                src={`/jeslin_front_image/${frontImages[currentImageIndex]}`}
                alt="Featured"
                className="absolute inset-0 w-full h-full object-cover"
                onLoad={handleImageLoad}
                style={{ opacity: isImageLoaded ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* ✅ Background for Laptop (fixed) */}
        {isLaptopView && frontImages.length > 0 && (
          <img
            src={`/laptopbg.png`}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />

        <>
          {!isLaptopView ? (
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="absolute top-20 w-full text-center px-4"
            >
              <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600">
                Hey Bestie!
              </h1>
              <p className="mt-3 text-lg text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600">
                Here’s a little memory lane for your surprise! 💖
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="absolute bottom-10 w-full text-center px-4"
            >
              <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600">
                Welcome to the Celebration!
              </h1>
              <p className="mt-4 text-xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600">
                Here's a special collection just for you – enjoy it in full screen!
              </p>
            </motion.div>
          )}
        </>
      </section>

      {/* 📸 Gallery Section */}
      <section id="gallery" className="min-h-screen px-2 py-12 bg-black">
        <div className="max-w-screen-xl mx-auto">
          <p className="mb-10 text-center text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600">
            Moments that made this day extra special 💖
          </p>

          <div className="columns-3 md:columns-4 gap-2 [column-fill:_balance]">
            {images.length === 0 ? (
              <p>Loading images...</p>
            ) : (
              images.map((img, i) => (
                <motion.div
                  key={img}
                  className="mb-2 break-inside-avoid rounded-lg overflow-hidden border-2 border-white shadow-md"
                  initial={{ opacity: 0, scale: 0.8, y: 40, rotateZ: -4 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0, rotateZ: 0 }}
                  viewport={{ once: false }}
                  transition={{ ...spring, delay: i * 0.08 }}
                >
                  <img
                    src={img}
                    alt={`Memory ${i + 1}`}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-500 ease-[cubic-bezier(.4,0,.2,1)] hover:scale-[1.07] hover:shadow-2xl hover:rotate-[1deg]"
                    onClick={() => setSelectedImg(img)}
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 💡 Lightbox */}
      <Lightbox selectedImg={selectedImg} onClose={() => setSelectedImg(null)} />

      {/* ➕ Plus Icon */}
      {showPlusIcon && (
        <motion.a
          href="/admin"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-pink-600 to-yellow-400 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg hover:scale-110 transition-transform"
          title="Go to Admin Page"
        >
          +
        </motion.a>
      )}
    </div>
  );
}
