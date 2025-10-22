
import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  label: string;
  onImageUpload: (base64Image: string) => void;
  imagePreview: string | null;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onImageUpload, imagePreview }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError("File is too large. Please select an image under 4MB.");
        return;
      }
      setError(null);
      try {
        const base64 = await fileToBase64(file);
        onImageUpload(base64);
      } catch (err) {
        setError("Could not read the file. Please try another image.");
      }
    }
  }, [onImageUpload]);

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-semibold text-slate-700 mb-4">{label}</h3>
      <div className="w-full h-64 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 transition-colors duration-300 hover:border-indigo-400 hover:bg-indigo-50 relative overflow-hidden">
        {imagePreview ? (
          <img src={imagePreview} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Click to upload</p>
            <p className="text-xs">PNG, JPG, WEBP</p>
          </div>
        )}
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label={`Upload ${label}`}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};
