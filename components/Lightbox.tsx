import React from 'react';

interface LightboxProps {
  selectedImg: string | null;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ selectedImg, onClose }) => {
  if (!selectedImg) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <img
        src={selectedImg}
        alt="Preview"
        className="max-h-[90vh] max-w-[95vw] rounded-lg shadow-xl border border-white"
      />
    </div>
  );
};

export default Lightbox;
