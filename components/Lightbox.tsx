import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { XIcon, DownloadIcon, HeartIcon, TrashIcon } from '@heroicons/react/solid';

interface LightboxProps {
  selectedImg: string | null;
  onClose: () => void;
  onDelete: (imgUrl: string) => void;
  onUpdateFavorite: (imgUrl: string, isFavorite: boolean) => void;
  isFavorite: boolean; // <-- added prop
}

const Lightbox = ({
  selectedImg,
  onClose,
  onDelete,
  onUpdateFavorite,
  isFavorite: isFavoriteProp,
}: LightboxProps) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(isFavoriteProp);

  // Sync prop with local state
  useEffect(() => {
    setIsFavorite(isFavoriteProp);
  }, [isFavoriteProp]);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 1000); // message disappears after 1 second
  };

  const handleDelete = async () => {
    if (!selectedImg) return;
    setLoading(true);

    try {
      const response = await fetch('/api/deleteImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: selectedImg }),
      });

      if (response.ok) {
        onDelete(selectedImg);
        showMessage('Image deleted successfully');
      } else {
        const errorText = await response.text();
        showMessage(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      showMessage('Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedImg) return;

    try {
      const res = await fetch('/api/download-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: selectedImg,
          mode: 'download',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get download URL');

      const link = document.createElement('a');
      link.href = data.url;
      link.setAttribute('download', '');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
      showMessage('Failed to download image');
    }
  };

  const handleToggleFavorite = async () => {
    if (!selectedImg) return;

    const newFavoriteStatus = !isFavorite;

    try {
      const response = await fetch('/api/updateFavorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: selectedImg,
          isFavorite: newFavoriteStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsFavorite(newFavoriteStatus);
        onUpdateFavorite(selectedImg, newFavoriteStatus);
        showMessage(data.message || 'Favorite status updated');
      } else {
        showMessage(data.error || 'Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      showMessage('Failed to update favorite status');
    }
  };

  return selectedImg ? (
    <motion.div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Close button */}
      <button
        className="absolute top-6 right-6 p-2 bg-black/70 text-white rounded-full hover:bg-black/50 transition"
        onClick={onClose}
      >
        <XIcon className="w-6 h-6" />
      </button>

      {/* Image display */}
      <img
        src={selectedImg}
        alt="Selected"
        className="max-w-full max-h-full rounded-lg shadow-2xl"
      />

      {/* Message */}
      {message && (
        <div
          className={`absolute bottom-24 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-center ${
            message.includes('success') ? 'bg-green-500' : 'bg-red-500'
          } text-white shadow-md`}
        >
          {message}
        </div>
      )}

      {/* Buttons */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-6">
        <button
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          onClick={handleDownload}
        >
          <DownloadIcon className="w-6 h-6" />
        </button>
        <button
          className={`p-3 ${isFavorite ? 'bg-red-600' : 'bg-gray-600'} text-white rounded-full hover:bg-red-700 transition`}
          onClick={handleToggleFavorite}
        >
          <HeartIcon className="w-6 h-6" />
        </button>
        <button
          className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
          onClick={handleDelete}
          disabled={loading}
        >
          <TrashIcon className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  ) : null;
};

export default Lightbox;
