import Link from 'next/link';

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans px-4 py-12 relative">

      {/* Title Section */}
      <h1 className="text-6xl sm:text-8xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600 drop-shadow-2xl mb-16">
        Memory Lane 🎉
      </h1>

      {/* Bar Sections */}
      <div className="w-full max-w-screen-sm flex flex-col gap-12">
        {/* Jeslin Rindhiya */}
        <Link href="/jeslin">
          <div className="flex items-center justify-start space-x-6 bg-gray-800 rounded-3xl py-5 px-8 w-full cursor-pointer hover:opacity-95 transition-all duration-300 transform hover:scale-105 shadow-xl">
            <img
              src="/icons/Jeslin_icon.png"
              alt="Jeslin"
              className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600">
              Jeslin Rindhiya ✨
            </div>
          </div>
        </Link>

        {/* Harini */}
        <Link href="/harini">
          <div className="flex items-center justify-start space-x-6 bg-gray-800 rounded-3xl py-5 px-8 w-full cursor-pointer hover:opacity-95 transition-all duration-300 transform hover:scale-105 shadow-xl">
            <img
              src="/icons/Harini_icon.png"
              alt="Harini"
              className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Harini 💖
            </div>
          </div>
        </Link>

        {/* Aloys Jehwin */}
        <Link href="/aloys">
          <div className="flex items-center justify-start space-x-6 bg-gray-800 rounded-3xl py-5 px-8 w-full cursor-pointer hover:opacity-95 transition-all duration-300 transform hover:scale-105 shadow-xl">
            <img
              src="/icons/Aloys_icon.png"
              alt="Aloys"
              className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
              Aloys Jehwin 🌟
            </div>
          </div>
        </Link>
      </div>

      {/* Subtle Background Overlay */}
      <div className="absolute top-0 left-0 right-0 bottom-0 z-[-1] bg-gradient-to-b from-gray-900 via-black to-gray-900 opacity-70" />
    </div>
  );
}
