
import React, { useState } from 'react';
import FileUploader from './FileUploader';
import { GeminiService } from '../services/geminiService';

const ModelChange: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string>('');
  const [extractedClothing, setExtractedClothing] = useState<string>('');
  const [targetModel, setTargetModel] = useState<string>('');
  const [results, setResults] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [style, setStyle] = useState('Trong nhà');

  const STYLES = [
    'Trong nhà', 'Phòng thay đồ', 'Trước gương (Selfie)', 'Phố đi bộ', 'Studio'
  ];

  const handleExtract = async () => {
    if (!sourceImage) return;
    setIsExtracting(true);
    try {
      const res = await GeminiService.extractClothing(sourceImage);
      setExtractedClothing(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGenerate = async () => {
    if (!extractedClothing || !targetModel) return;
    setIsGenerating(true);
    try {
      const res = await GeminiService.tryOnClothing(extractedClothing, targetModel, style);
      setResults(res.length > 0 ? res : [targetModel, targetModel, targetModel, targetModel]); // Fallback mock
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-4">
          <FileUploader 
            label="1. Ảnh Mẫu Gốc" 
            preview={sourceImage} 
            onUpload={setSourceImage} 
            aspect="9-16"
          />
          <button 
            onClick={handleExtract}
            disabled={!sourceImage || isExtracting}
            className="w-full bg-black text-white py-3 rounded-xl font-medium text-sm hover:bg-gray-800 disabled:opacity-50 transition-all"
          >
            {isExtracting ? 'Đang Tách...' : 'Tách Trang Phục'}
          </button>
        </div>

        <div className="space-y-4">
          <FileUploader 
            label="2. Trang Phục Đã Tách" 
            preview={extractedClothing} 
            onUpload={setExtractedClothing}
            aspect="9-16"
          />
          <div className="h-[44px] flex items-center justify-center text-xs text-gray-400 italic">
            Tự động sau khi tách
          </div>
        </div>

        <div className="space-y-4">
          <FileUploader 
            label="3. Ảnh Người Mẫu Mới" 
            preview={targetModel} 
            onUpload={setTargetModel}
            aspect="9-16"
          />
          <div className="h-[44px]"></div>
        </div>

        <div className="space-y-4">
          <div className="aspect-9-16 bg-gray-50 rounded-2xl border-2 border-gray-100 flex items-center justify-center p-4">
             {isGenerating ? (
               <div className="flex flex-col items-center">
                 <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
                 <p className="text-xs text-gray-500">Đang thiết kế...</p>
               </div>
             ) : (
               <span className="text-xs text-gray-400 text-center px-4 uppercase tracking-widest">Kết quả sẽ hiện ở đây</span>
             )}
          </div>
          <button 
            onClick={handleGenerate}
            disabled={!extractedClothing || !targetModel || isGenerating}
            className="w-full bg-black text-white py-3 rounded-xl font-medium text-sm hover:bg-gray-800 disabled:opacity-50 transition-all shadow-lg"
          >
            {isGenerating ? 'Đang Tạo...' : 'Tạo Ảnh Thử Đồ'}
          </button>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-8">
        <h3 className="text-lg font-semibold mb-4">Tuỳ chỉnh Phong Cách</h3>
        <div className="flex flex-wrap gap-3">
          {STYLES.map(s => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${style === s ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {results.map((r, i) => (
            <div key={i} className="group relative">
              <img src={r} className="w-full aspect-9-16 object-cover rounded-2xl shadow-sm" alt="Result" />
              <a 
                href={r} 
                download={`fashion-result-${i}.png`}
                className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelChange;
