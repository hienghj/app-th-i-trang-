
import React, { useState, useEffect } from 'react';
import FileUploader from './FileUploader';
import { GeminiService } from '../services/geminiService';
// Fix: Always use direct import for GoogleGenAI
import { GoogleGenAI } from "@google/genai";

const VideoCreator: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string>('');
  const [backgroundPrompt, setBackgroundPrompt] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [operation, setOperation] = useState<any>(null);
  const [isExtending, setIsExtending] = useState(false);

  const handleGenerateAIPrompt = async (withVoice: boolean) => {
    if (!sourceImage) return;
    setIsGeneratingPrompt(true);
    try {
      const res = await GeminiService.generateFashionPrompt(sourceImage, withVoice);
      setPrompt(res || '');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const pollVideoOperation = async (op: any) => {
    // Fix: Create a new instance right before calling to ensure the latest API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let currentOp = op;
    while (!currentOp.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      currentOp = await ai.operations.getVideosOperation({ operation: currentOp });
    }
    const downloadLink = currentOp.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setVideoUrl(url);
    setOperation(currentOp);
    setIsGeneratingVideo(false);
    setIsExtending(false);
  };

  const handleCreateVideo = async () => {
    if (!sourceImage || !prompt) return;
    setIsGeneratingVideo(true);
    try {
      const op = await GeminiService.createFashionVideo(sourceImage, prompt);
      await pollVideoOperation(op);
    } catch (e) {
      console.error(e);
      setIsGeneratingVideo(false);
    }
  };

  const handleExtendVideo = async () => {
    if (!operation) return;
    setIsExtending(true);
    setIsGeneratingVideo(true);
    try {
      const op = await GeminiService.extendVideo(operation, prompt + " The sequence continues with the model walking closer to the camera.");
      await pollVideoOperation(op);
    } catch (e) {
      console.error(e);
      setIsGeneratingVideo(false);
      setIsExtending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10 pb-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <FileUploader 
            label="Tải Ảnh Sản Phẩm" 
            preview={sourceImage} 
            onUpload={setSourceImage}
            aspect="9-16"
          />
          <button 
            className="w-full border border-gray-200 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
            onClick={() => setBackgroundPrompt("Modern minimalist studio background with soft lighting")}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            Thay Đổi Background (AI)
          </button>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">1. Tạo Kịch Bản</h3>
            <div className="flex gap-3">
              <button 
                onClick={() => handleGenerateAIPrompt(true)}
                className="flex-1 py-2 rounded-lg bg-gray-100 text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all"
              >
                AI Có Thoại
              </button>
              <button 
                onClick={() => handleGenerateAIPrompt(false)}
                className="flex-1 py-2 rounded-lg bg-gray-100 text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all"
              >
                AI Không Thoại
              </button>
            </div>
            
            <div className="relative">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Tự nhập prompt hoặc dùng AI để tạo kịch bản..."
                className="w-full h-40 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-black outline-none resize-none"
              />
              {isGeneratingPrompt && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-2xl">
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
             <button 
               onClick={handleCreateVideo}
               disabled={!sourceImage || !prompt || isGeneratingVideo}
               className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 disabled:opacity-50 transition-all shadow-xl"
             >
               {isGeneratingVideo ? 'Đang Tạo Video (Veo 3.1)...' : 'Tạo Video 9:16'}
             </button>
          </div>
        </div>
      </div>

      {videoUrl && (
        <div className="mt-12 space-y-6 flex flex-col items-center">
          <div className="max-w-[320px] w-full aspect-9-16 bg-black rounded-3xl overflow-hidden shadow-2xl relative border-8 border-white">
            <video 
              src={videoUrl} 
              className="w-full h-full object-cover" 
              controls 
              autoPlay 
              loop 
            />
          </div>
          <div className="flex gap-4">
            <a 
              href={videoUrl} 
              download="fashion-video.mp4"
              className="px-8 py-3 bg-white border border-gray-200 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-gray-50 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Tải Xuống 1080p
            </a>
            <button 
              onClick={handleExtendVideo}
              disabled={isGeneratingVideo}
              className="px-8 py-3 bg-black text-white rounded-full font-medium text-sm flex items-center gap-2 hover:bg-gray-800 shadow-lg disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Nối Tiếp Video (16s)
            </button>
          </div>
        </div>
      )}

      {isGeneratingVideo && !videoUrl && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
               <h4 className="text-xl font-bold">Đang kiến tạo kiệt tác</h4>
               <p className="text-gray-500 text-sm">Veo 3.1 đang xử lý video chất lượng 1080p. Quá trình này có thể mất vài phút.</p>
            </div>
            <div className="space-y-1">
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-black animate-pulse" style={{width: '60%'}}></div>
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">VEO 3.1 ENGINE</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCreator;
