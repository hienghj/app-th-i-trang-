
import React, { useRef } from 'react';

interface FileUploaderProps {
  onUpload: (base64: string) => void;
  label: string;
  preview?: string;
  aspect?: '9-16' | 'square';
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload, label, preview, aspect = 'square' }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      onClick={() => inputRef.current?.click()}
      className={`relative border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-black transition-all group overflow-hidden bg-gray-50/50 ${aspect === '9-16' ? 'aspect-9-16' : 'aspect-square'}`}
    >
      <input 
        type="file" 
        ref={inputRef} 
        onChange={handleChange} 
        className="hidden" 
        accept="image/*"
      />
      {preview ? (
        <img src={preview} className="w-full h-full object-cover" alt="Preview" />
      ) : (
        <div className="flex flex-col items-center p-4">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          </div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
