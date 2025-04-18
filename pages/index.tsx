import Link from 'next/link';

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-10 font-sans">
      <h1 className="text-4xl font-bold mb-8">Memory Lane 🎉</h1>

      <div className="space-y-6">
        <Link href="/harini">
          <div className="text-xl hover:text-pink-400 transition duration-300 cursor-pointer">
            Harini 💖
          </div>
        </Link>

        <Link href="/jeslin">
          <div className="text-xl hover:text-purple-400 transition duration-300 cursor-pointer">
            Jeslin ✨
          </div>
        </Link>

        <Link href="/aloys">
          <div className="text-xl hover:text-blue-400 transition duration-300 cursor-pointer">
            Aloys 🌟
          </div>
        </Link>
      </div>
    </div>
  );
}
