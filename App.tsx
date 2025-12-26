
import React, { useState } from 'react';
import { AppTab } from './types';
import ModelChange from './components/ModelChange';
import VideoCreator from './components/VideoCreator';
import ApiKeyGate from './components/ApiKeyGate';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.MODEL_CHANGE);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.MODEL_CHANGE:
        return <ModelChange />;
      case AppTab.CREATE_VIDEO:
        return <VideoCreator />;
      case AppTab.GALLERY:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <p className="font-medium">Chưa có nội dung trong bộ sưu tập</p>
          </div>
        );
      default:
        return <ModelChange />;
    }
  };

  return (
    <ApiKeyGate>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">F</div>
              <h1 className="text-xl font-bold tracking-tighter uppercase">Fashion Studio</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => setActiveTab(AppTab.MODEL_CHANGE)}
                className={`text-sm font-semibold transition-all ${activeTab === AppTab.MODEL_CHANGE ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
              >
                ĐỔI MẪU
              </button>
              <button 
                onClick={() => setActiveTab(AppTab.CREATE_VIDEO)}
                className={`text-sm font-semibold transition-all ${activeTab === AppTab.CREATE_VIDEO ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
              >
                TẠO VIDEO
              </button>
              <button 
                onClick={() => setActiveTab(AppTab.GALLERY)}
                className={`text-sm font-semibold transition-all ${activeTab === AppTab.GALLERY ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
              >
                BỘ SƯU TẬP
              </button>
            </nav>
            <div className="flex items-center gap-4">
               <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
               </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-6">
          {renderContent()}
        </main>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] glass rounded-3xl border border-gray-100 shadow-2xl p-2 flex items-center justify-between z-50">
           <button 
             onClick={() => setActiveTab(AppTab.MODEL_CHANGE)}
             className={`flex-1 flex flex-col items-center py-2 rounded-2xl transition-all ${activeTab === AppTab.MODEL_CHANGE ? 'bg-black text-white shadow-lg' : 'text-gray-400'}`}
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             <span className="text-[10px] font-bold mt-1">ĐỔI MẪU</span>
           </button>
           <button 
             onClick={() => setActiveTab(AppTab.CREATE_VIDEO)}
             className={`flex-1 flex flex-col items-center py-2 rounded-2xl transition-all ${activeTab === AppTab.CREATE_VIDEO ? 'bg-black text-white shadow-lg' : 'text-gray-400'}`}
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
             <span className="text-[10px] font-bold mt-1">TẠO VIDEO</span>
           </button>
           <button 
             onClick={() => setActiveTab(AppTab.GALLERY)}
             className={`flex-1 flex flex-col items-center py-2 rounded-2xl transition-all ${activeTab === AppTab.GALLERY ? 'bg-black text-white shadow-lg' : 'text-gray-400'}`}
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 12h14M5 16h14"></path></svg>
             <span className="text-[10px] font-bold mt-1">GALLERY</span>
           </button>
        </div>
      </div>
    </ApiKeyGate>
  );
};

export default App;
