
import React, { useEffect, useState } from 'react';

interface ApiKeyGateProps {
  children: React.ReactNode;
}

// Fix: Use the existing AIStudio type as indicated by the error message to ensure type compatibility
declare global {
  interface Window {
    aistudio: AIStudio;
  }
}

const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ children }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    const selected = await window.aistudio.hasSelectedApiKey();
    setHasKey(selected);
  };

  const handleOpenSelect = async () => {
    await window.aistudio.openSelectKey();
    // Proceed regardless to avoid race condition
    setHasKey(true);
  };

  if (hasKey === null) return null;

  if (!hasKey) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-6 text-center z-50">
        <div className="max-w-md w-full space-y-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white text-2xl font-bold">V</div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Veo Video Studio</h1>
          <p className="text-gray-500">To use high-quality video generation, you must select a paid Google Cloud project API key.</p>
          <div className="pt-4">
            <button
              onClick={handleOpenSelect}
              className="w-full bg-black text-white font-medium py-4 px-6 rounded-xl hover:bg-gray-800 transition-all shadow-lg"
            >
              Chọn API Key & Bắt đầu
            </button>
            <p className="mt-4 text-sm text-gray-400">
              Cần thiết cho mô hình Veo 3.1. Xem <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline">tài liệu thanh toán</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ApiKeyGate;
