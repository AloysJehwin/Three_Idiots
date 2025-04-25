import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const steps = [
  { text: "Remove the bow carefully, Found a HERE Tag? Tear the wrapper diagonally", emoji: "🎁", highlight: "Enjoyed the butterflies" },
  { text: "Pull the invite card in the top right, Turn the invite card", emoji: "🎬", highlight: "The most awaited moment" },
  { text: "Turn on NFC mode in the mobile and page in the center", emoji: "🌟", highlight: "Enjoying the moment, aren’t you?" },
  { text: "If you don't have NFC click the link below", emoji: "😄", highlight: "You did it! Celebrate!" },
];

export default function SurpriseInstructions() {
  const [stepIndex, setStepIndex] = useState(0);
  const [highlightMessage, setHighlightMessage] = useState('');
  const isLastStep = stepIndex === steps.length - 1;
  const [title, setTitle] = useState('');
  const fullTitle = "✨ Let the Magic Begin!";

  useEffect(() => {
    let i = 0;
    const type = () => {
      if (i < fullTitle.length) {
        setTitle(prev => prev + fullTitle[i]);
        i++;
        setTimeout(type, 80);
      }
    };
    type();
  }, []);

  const handleNext = () => {
    if (!isLastStep) {
      setStepIndex(stepIndex + 1);
      showHighlightMessage();
    } else {
      launchConfetti();
    }
  };

  const showHighlightMessage = () => {
    setHighlightMessage(steps[stepIndex].highlight);
    setTimeout(() => setHighlightMessage(''), 3000); // Hide after 3 seconds
  };

  const launchConfetti = () => {
    confetti({
      particleCount: 300,
      spread: 160,
      origin: { y: 0.6 },
      angle: 60,
      colors: ['#ffcc00', '#ff5a36', '#ff4081', '#03a9f4', '#4caf50'],
    });
  };

  return (
    <>
      <Head>
        <title>🎉 Magical Surprise Time!</title>
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-6 relative overflow-hidden">
        
        {/* Fluid animated background */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_2px,_transparent_2px)] opacity-50 z-0 animate-pulse" />
        
        {/* Glowing particles effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_20px,_transparent_20px)] animate-pulse z-0" />
        
        {/* Typewriter Header */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 drop-shadow-xl z-10"
        >
          {title}
        </motion.h1>
        
        {/* Progress dots */}
        <div className="flex gap-3 mb-4 z-10">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className={`w-4 sm:w-5 h-4 sm:h-5 rounded-full transition duration-300 ${index <= stepIndex ? 'bg-pink-400' : 'bg-white/30'}`}
            />
          ))}
        </div>

        {/* Highlight Message Card */}
        {highlightMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="absolute top-24 sm:top-32 left-1/2 transform -translate-x-1/2 w-full sm:w-96 p-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-3xl shadow-2xl z-10"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl text-purple-500">
                🎉
              </div>
              <p className="text-lg sm:text-xl font-semibold text-center">{highlightMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Step Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="relative bg-white bg-opacity-80 border border-white/20 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full mb-8 transform hover:scale-[1.05] transition-all duration-300 z-10"
            style={{ top: "-30px" }} // Move the step card higher
          >
            <div className="absolute top-[-25px] left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 text-white text-4xl rounded-full w-16 h-16 flex items-center justify-center shadow-xl ring-4 ring-white/40 animate-bounce">
              {steps[stepIndex].emoji}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-8 mb-3 text-center">Step {stepIndex + 1}</h2>
            <p className="text-lg sm:text-xl font-medium text-gray-900 text-center">{steps[stepIndex].text}</p>
          </motion.div>
        </AnimatePresence>

        {/* Next Button */}
        {!isLastStep ? (
          <motion.button
            onClick={handleNext}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.1 }}
            className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 px-10 py-4 rounded-full font-semibold shadow-lg text-white hover:opacity-90 transition z-10"
          >
            Next →
          </motion.button>
        ) : (
          <motion.a
            href="https://three-idiots.vercel.app/" // Change this URL to your destination
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 px-10 py-4 rounded-full font-semibold shadow-lg text-white hover:opacity-90 transition z-10"
          >
            Visit the Surprise Page 🎉
          </motion.a>
        )}

        {/* Final Goodbye Message */}
        {isLastStep && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-10 text-xl font-semibold bg-transparent text-white py-2 px-6 rounded-lg z-10"
          >
            <p className="text-center">💖 It's time to say goodbye. Thank you for all the beautiful memories. I’ll miss you!</p>
            <p className="text-center mt-2">Take care, and our paths will cross again soon! ✨</p>
          </motion.div>
        )}

        {/* Footer */}
        <footer className="absolute bottom-4 text-xs sm:text-sm text-white/50 z-10">
          Made with 💖 by Aloys
        </footer>
      </div>
    </>
  );
}
