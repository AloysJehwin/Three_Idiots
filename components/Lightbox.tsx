import React from 'react';

interface LightboxProps {
  selectedImg: string | null;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ selectedImg, onClose }) => {
  if (!selectedImg) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative max-w-4xl">
        <button
          className="absolute right-2 top-2 text-3xl text-white"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={selectedImg}
          alt="Full Size"
          className="max-h-[90vh] rounded-lg"
        />
      </div>
    </div>
  );
};

export default Lightbox;
