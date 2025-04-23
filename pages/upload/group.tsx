import { useState } from 'react';

export default function UploadGroup() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file');
        setFile(null);
      } else {
        setError(null);
        setFile(selectedFile);
      }
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'group');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload', true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        setUploadUrl(data.url);
      } else {
        const data = JSON.parse(xhr.responseText);
        setError(data.error || 'Upload failed');
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setError('Upload failed');
    };

    xhr.send(formData);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans px-4 py-12 relative">

      <h1 className="text-4xl sm:text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-600 drop-shadow-2xl mb-16">
        Upload Image to Group Folder 📸
      </h1>

      <form onSubmit={handleFileUpload} className="flex flex-col items-center space-y-6 w-full max-w-2xl">
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="px-6 py-3 text-lg rounded-lg bg-gray-800 text-white border-2 border-gray-600 file:mr-4 w-full"
        />

        {file && (
          <div className="w-full flex justify-center items-center border-2 border-gray-600 p-4 rounded-lg overflow-hidden">
            <img
              src={URL.createObjectURL(file)}
              alt="Selected File"
              className="object-cover rounded-md w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-gradient-to-r from-blue-400 to-green-600 text-white px-8 py-3 text-xl rounded-lg w-64 hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={uploading}
        >
          {uploading ? 'Uploading... ' : 'Upload to Group Folder'}
        </button>
      </form>

      {uploading && (
        <div className="mt-6 w-full text-center max-w-2xl">
          <div className="text-xl text-gray-300">
            Upload Progress: {progress}%
          </div>
          <div className="h-2 w-full bg-gray-300 mt-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-green-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {uploadUrl && (
        <div className="mt-6 flex flex-col items-center justify-center text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-600">
          <h3 className="text-2xl font-bold">Upload Successful! 🎉</h3>
          <p className="text-lg">Your image has been uploaded successfully.</p>
        </div>
      )}

      {error && (
        <div className="mt-6 text-red-400 font-semibold">
          <p>{error}</p>
        </div>
      )}

      <div className="mt-16 max-w-3xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-600">
          Ideas for Uploading Photos 🌟
        </h2>
        <ul className="list-disc pl-6 text-lg space-y-4 text-white">
          <li>Upload images that represent key moments or achievements in your life.</li>
          <li>Consider adding captions or tags to help organize and search the images later.</li>
          <li>Use images that inspire you or remind you of your goals and dreams.</li>
          <li>Think about uploading images for creative projects, hobbies, or personal collections.</li>
          <li>Share photos that have a sentimental value or reflect your journey.</li>
        </ul>
      </div>
    </div>
  );
}
