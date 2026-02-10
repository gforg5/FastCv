import React, { useState, useEffect } from 'react';
import ProfileSetup from './components/ProfileSetup';
import Generator from './components/Generator';
import { ResumeProfile, CVRecord } from './types';
import { Zap, Sparkles, X, Terminal, MapPin, Cpu, Info, FileText, History, Copy, Share2, Trash2, Edit, ArrowLeft } from 'lucide-react';

const STORAGE_KEY = 'fastcv_base_profile';
const HISTORY_KEY = 'fastcv_history';

const App: React.FC = () => {
  const [baseProfile, setBaseProfile] = useState<ResumeProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Modals state
  const [showDevProfile, setShowDevProfile] = useState(false);
  const [showAboutApp, setShowAboutApp] = useState(false);
  const [showRecords, setShowRecords] = useState(false);
  const [historyRecords, setHistoryRecords] = useState<CVRecord[]>([]);

  // Load saved profile and history on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBaseProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved profile", e);
      }
    }
    loadHistory();
    setIsLoaded(true);
  }, []);

  const loadHistory = () => {
    const hist = localStorage.getItem(HISTORY_KEY);
    if (hist) {
      try {
        setHistoryRecords(JSON.parse(hist));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  };

  const handleProfileSaved = (profile: ResumeProfile) => {
    setBaseProfile(profile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    if (!baseProfile) {
      // Focus the text area if already on the setup page
      const textarea = document.getElementById('raw-profile-input');
      if (textarea) {
        textarea.focus();
        textarea.classList.add('ring-4', 'ring-brand-500/40');
        setTimeout(() => textarea.classList.remove('ring-4', 'ring-brand-500/40'), 500);
      }
      return;
    }
    if (confirm("Are you sure you want to return to the Home Page? This will clear your current base profile so you can start fresh.")) {
      setBaseProfile(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleLoadRecord = (record: CVRecord) => {
    setBaseProfile(record.profile);
    setShowRecords(false);
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm("Delete this saved CV?")) {
      const updated = historyRecords.filter(r => r.id !== id);
      setHistoryRecords(updated);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    }
  };

  const handleClearAllRecords = () => {
    if (historyRecords.length > 0 && confirm("Are you sure you want to permanently delete ALL saved CV records? This cannot be undone.")) {
      setHistoryRecords([]);
      localStorage.removeItem(HISTORY_KEY);
    }
  };

  const handleDuplicateRecord = (record: CVRecord) => {
    const newRecord: CVRecord = {
      ...record,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      targetJob: record.targetJob + ' (Copy)'
    };
    const updated = [newRecord, ...historyRecords];
    setHistoryRecords(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  const handleCopyRecord = (record: CVRecord) => {
    const text = `Target Job: ${record.targetJob}\nName: ${record.profile.fullName}\nSummary: ${record.profile.summary}`;
    navigator.clipboard.writeText(text);
    alert("CV basic text copied to clipboard!");
  };

  const handleShareRecord = async (record: CVRecord) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Resume for ${record.targetJob}`,
          text: `Check out my resume tailored for ${record.targetJob}!`,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      handleCopyRecord(record);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex items-center gap-2 text-brand-600">
          <Zap className="fill-brand-600" size={32} />
          <span className="text-2xl font-bold">FastCV</span>
        </div>
      </div>
    );
  }

  // Extracted Navbar for reuse and consistency
  const NavigationBar = () => (
    <nav className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white/60 backdrop-blur-xl rounded-full shadow-lg border border-slate-200/80 hover:shadow-xl transition-all duration-300">
      <button onClick={() => setShowRecords(true)} className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 flex items-center gap-2">
        <History size={16} /> <span className="hidden sm:inline">Records</span>
      </button>
      <div className="w-px h-6 bg-slate-200"></div>
      <button onClick={handleReset} className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm text-slate-600 hover:bg-slate-900 hover:text-white transition-all duration-300 flex items-center gap-2">
        <FileText size={16} /> <span className="hidden sm:inline">New CV</span>
      </button>
      <div className="w-px h-6 bg-slate-200"></div>
      <button onClick={() => setShowDevProfile(true)} className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm text-slate-600 hover:bg-brand-500 hover:text-white transition-all duration-300 flex items-center gap-2">
        <Terminal size={16} /> <span className="hidden sm:inline">Developer</span>
      </button>
      <div className="w-px h-6 bg-slate-200"></div>
      <button onClick={() => setShowAboutApp(true)} className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm text-slate-600 hover:bg-emerald-500 hover:text-white transition-all duration-300 flex items-center gap-2">
        <Info size={16} /> <span className="hidden sm:inline">About</span>
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative selection:bg-brand-500/30 selection:text-brand-900">
      {!baseProfile ? (
        <div className="container mx-auto px-4 py-8 sm:py-10 max-w-5xl flex-1 flex flex-col z-10">
          
          <header className="mb-8 sm:mb-10 flex flex-col items-center justify-center text-center">
             <div 
                onClick={() => window.location.reload()} 
                className="flex items-center gap-3 text-brand-600 mb-6 cursor-pointer transform hover:scale-105 transition-all duration-300 group"
                title="Reload Home Page"
             >
               <div className="p-3 bg-white rounded-2xl shadow-xl shadow-brand-500/10 border border-brand-100 group-hover:shadow-brand-500/20 transition-all">
                 <Zap className="fill-brand-600 group-hover:animate-pulse" size={36} />
               </div>
               <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 group-hover:text-brand-600 transition-colors">FastCV</h1>
             </div>
             <NavigationBar />
          </header>

          <div className="flex-1 flex items-center justify-center animate-in fade-in duration-700 slide-in-from-bottom-8">
            <ProfileSetup onProfileSaved={handleProfileSaved} />
          </div>

          {/* Global Footer */}
          <footer className="mt-16 py-8 text-center border-t border-slate-200">
             <div className="flex flex-col items-center justify-center gap-1.5">
               <p className="text-sm font-medium text-slate-500">
                 &copy; {new Date().getFullYear()} <strong className="text-slate-700">Sayed Mohsin Ali</strong>. All rights reserved.
               </p>
               <p className="text-xs text-slate-400 font-medium">
                 Crafted with precision for professionals.
               </p>
               
               {/* Fixed Footer Animation - Small, Glowing, Fancy */}
               <div className="group relative flex items-center justify-center min-h-[24px] w-full cursor-default overflow-hidden mt-1">
                 <span className="absolute transform transition-all duration-500 group-hover:-translate-y-8 group-hover:opacity-0 flex items-center gap-1 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                   Made with <span className="text-red-500 text-[10px] animate-pulse">❤️</span> in PK
                 </span>
                 <span className="absolute transform translate-y-8 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 text-[10px] uppercase tracking-widest font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-brand-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] whitespace-nowrap">
                   Pakhtunistan, Khyber Pakhtunkhwa
                 </span>
               </div>

             </div>
          </footer>
        </div>
      ) : (
        <Generator 
          baseProfile={baseProfile} 
          onReset={handleReset} 
          onShowDevProfile={() => setShowDevProfile(true)}
          onShowAboutApp={() => setShowAboutApp(true)}
          onShowRecords={() => {
            loadHistory();
            setShowRecords(true);
          }}
          onUpdateHistory={loadHistory}
        />
      )}

      {/* Records / History Modal */}
      {showRecords && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={() => setShowRecords(false)}></div>
           
           <div className="bg-slate-50 w-full max-w-[600px] h-[80vh] sm:h-auto sm:max-h-[85vh] rounded-[2rem] shadow-[0_0_60px_rgba(0,0,0,0.2)] border border-slate-200 relative flex flex-col transform transition-all animate-in zoom-in-95 duration-500 z-10 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-20">
                <div className="flex items-center gap-3 sm:gap-4">
                  <button onClick={() => setShowRecords(false)} className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-all group shadow-sm">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> <span className="hidden sm:inline">Back</span>
                  </button>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hidden sm:block">
                      <History size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">Saved CVs</h2>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-1">Your tailored records</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {historyRecords.length > 0 && (
                    <button onClick={handleClearAllRecords} className="text-red-500 hover:text-white hover:bg-red-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-red-100 flex items-center gap-1.5 shadow-sm">
                      <Trash2 size={14} /> <span className="hidden sm:inline">Clear All</span>
                    </button>
                  )}
                  <button onClick={() => setShowRecords(false)} className="text-slate-400 hover:text-slate-800 p-2.5 bg-slate-50 rounded-full border border-slate-200 hover:bg-slate-100 transition-all shadow-sm">
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {historyRecords.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                    <History size={48} className="mb-4 opacity-20" />
                    <p className="font-medium">No records found yet.</p>
                  </div>
                ) : (
                  historyRecords.map((record) => (
                    <div key={record.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{record.targetJob}</h3>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">{record.date}</p>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => handleLoadRecord(record)} className="flex-1 sm:flex-none px-4 py-2 bg-brand-50 text-brand-700 hover:bg-brand-600 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5">
                             <Edit size={14} /> Open
                           </button>
                           <button onClick={() => handleDuplicateRecord(record)} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors" title="Duplicate">
                             <Copy size={16} />
                           </button>
                           <button onClick={() => handleShareRecord(record)} className="p-2 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors" title="Share/Copy Text">
                             <Share2 size={16} />
                           </button>
                           <button onClick={() => handleDeleteRecord(record.id)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title="Delete">
                             <Trash2 size={16} />
                           </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {record.profile.summary}
                      </p>
                    </div>
                  ))
                )}
              </div>
           </div>
        </div>
      )}

      {/* Pro Level Fancy Developer Modal */}
      {showDevProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={() => setShowDevProfile(false)}></div>
           
           {/* Modal Content */}
           <div className="bg-slate-900 w-[90vw] sm:w-full max-w-[440px] rounded-[2.5rem] shadow-[0_0_80px_rgba(20,184,166,0.15)] border border-slate-700/60 relative flex flex-col items-center p-6 sm:p-10 transform transition-all animate-in zoom-in-95 duration-500 ease-out z-10 overflow-hidden group">
              
              {/* Background Glows */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl group-hover:bg-brand-500/30 transition-all duration-700"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all duration-700"></div>

              {/* Back & Close Buttons */}
              <button onClick={() => setShowDevProfile(false)} className="absolute top-4 left-4 sm:top-5 sm:left-5 text-slate-300 hover:text-white z-20 px-3 py-1.5 bg-slate-800/80 rounded-lg backdrop-blur-md border border-slate-700 hover:bg-slate-700 transition-all shadow-lg flex items-center gap-1.5 text-xs font-bold group/back">
                <ArrowLeft size={14} className="group-hover/back:-translate-x-1 transition-transform" /> Back
              </button>

              <button onClick={() => setShowDevProfile(false)} className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-white z-20 p-2 sm:p-2.5 bg-slate-800/80 rounded-full backdrop-blur-md border border-slate-700 hover:bg-slate-700 hover:scale-110 transition-all shadow-lg">
                <X size={18} />
              </button>
              
              {/* Profile Image */}
              <div className="relative mb-5 mt-8 sm:mt-4 z-10 group/img w-24 h-24 sm:w-28 sm:h-28">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-500 to-emerald-500 rounded-[2rem] blur-xl opacity-40 group-hover/img:opacity-100 group-hover/img:blur-2xl transition-all duration-700"></div>
                <div className="w-full h-full rounded-[2rem] bg-slate-800 p-1 relative z-10 transform group-hover/img:scale-110 group-hover/img:-rotate-3 transition-transform duration-500 shadow-2xl">
                   <img 
                      src="https://raw.githubusercontent.com/gforg5/Nano-Lens/refs/heads/main/1769069098374.png" 
                      alt="Sayed Mohsin Ali" 
                      className="w-full h-full object-cover rounded-[1.75rem]"
                   />
                </div>
              </div>
              
              <div className="text-center relative z-10">
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">Sayed Mohsin Ali</h2>
                
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-5 shadow-inner">
                  <Terminal size={14} /> Systems Developer
                </div>
                
                <p className="text-slate-300 leading-relaxed text-xs sm:text-sm font-medium mb-6 px-2">
                  A visionary <strong className="text-white">Systems Developer</strong> crafting high-performance, AI-driven applications. I transform complex logic into beautiful, seamless user experiences.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-2.5 text-slate-400 bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50 shadow-inner text-xs sm:text-sm mb-6 w-full">
                  <MapPin size={16} className="text-brand-400" />
                  <span className="font-medium">Khyber Pakhtunkhwa, <strong className="text-slate-200">PK</strong></span>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2">
                  {['React & Next.js', 'AI Integration', 'Architecture', 'UI/UX'].map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-xl text-[9px] sm:text-[10px] font-black text-slate-200 shadow-sm uppercase tracking-wider">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
           </div>
        </div>
      )}

      {/* Pro Level Fancy About Modal */}
      {showAboutApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={() => setShowAboutApp(false)}></div>
           
           {/* Modal Content */}
           <div className="bg-white w-[90vw] sm:w-full max-w-[440px] rounded-[2.5rem] shadow-[0_0_80px_rgba(255,255,255,0.1)] border border-slate-200 relative flex flex-col items-center p-6 sm:p-10 transform transition-all animate-in zoom-in-95 duration-500 ease-out z-10 overflow-hidden group">
              
              {/* Background Glows */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-100 rounded-full blur-3xl group-hover:bg-brand-200 transition-all duration-700"></div>
              
              {/* Back & Close Buttons */}
              <button onClick={() => setShowAboutApp(false)} className="absolute top-4 left-4 sm:top-5 sm:left-5 text-slate-600 hover:text-slate-900 z-20 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 hover:bg-slate-200 transition-all shadow-sm flex items-center gap-1.5 text-xs font-bold group/back">
                <ArrowLeft size={14} className="group-hover/back:-translate-x-1 transition-transform" /> Back
              </button>

              <button onClick={() => setShowAboutApp(false)} className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-800 z-20 p-2 sm:p-2.5 bg-slate-50 rounded-full border border-slate-200 hover:bg-slate-100 hover:scale-110 transition-all shadow-sm">
                <X size={18} />
              </button>
              
              {/* Main Page Logo inside About Modal */}
              <div className="relative mb-6 mt-8 sm:mt-4 z-10 group/icon w-24 h-24 sm:w-28 sm:h-28">
                <div className="absolute inset-0 bg-brand-400 rounded-3xl blur-xl opacity-30 group-hover/icon:opacity-60 group-hover/icon:blur-2xl transition-all duration-700"></div>
                <div className="w-full h-full p-4 bg-white rounded-3xl shadow-xl shadow-brand-500/20 border border-brand-100 flex items-center justify-center relative z-10 transform group-hover/icon:scale-110 group-hover/icon:rotate-6 transition-transform duration-500">
                   <Zap className="fill-brand-600 text-brand-600" size={48} />
                </div>
              </div>
              
              <div className="text-center relative z-10">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter mb-2">FastCV</h2>
                
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-6 shadow-inner">
                  <Sparkles size={12} className="text-brand-500" /> AI-Powered Resume Builder
                </div>
                
                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm font-medium mb-8 px-2">
                  FastCV eliminates repetitive typing. Enter your base details <strong className="text-slate-900">just once</strong>, and our advanced AI engine will instantly tailor your resume perfectly for any target job title in seconds.
                </p>
                
                <div className="grid grid-cols-2 gap-3 w-full">
                   <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center hover:bg-white hover:shadow-md transition-all">
                      <Cpu size={24} className="text-brand-500 mb-2" />
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-700">Smart AI Engine</span>
                   </div>
                   <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center hover:bg-white hover:shadow-md transition-all">
                      <FileText size={24} className="text-emerald-500 mb-2" />
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-700">Instant Tailoring</span>
                   </div>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;