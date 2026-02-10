import React, { useState, useEffect } from 'react';
import ProfileSetup from './components/ProfileSetup';
import Generator from './components/Generator';
import { ResumeProfile } from './types';
import { Zap, Sparkles, X, Code2, Terminal, MapPin, Cpu } from 'lucide-react';

const STORAGE_KEY = 'fastcv_base_profile';

const App: React.FC = () => {
  const [baseProfile, setBaseProfile] = useState<ResumeProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDevProfile, setShowDevProfile] = useState(false);

  // Load saved profile on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBaseProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved profile", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const handleProfileSaved = (profile: ResumeProfile) => {
    setBaseProfile(profile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to edit your base profile? You will need to extract details again.")) {
      setBaseProfile(null);
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
      {!baseProfile ? (
        <div className="container mx-auto px-4 py-10 max-w-5xl flex-1 flex flex-col z-10">
          
          <header className="mb-10 flex flex-col items-center justify-center text-center">
             <div className="flex items-center gap-3 text-brand-600 mb-6">
               <div className="p-3 bg-brand-100 rounded-2xl shadow-sm">
                 <Zap className="fill-brand-600" size={36} />
               </div>
               <h1 className="text-5xl font-black tracking-tighter text-slate-900">FastCV</h1>
             </div>
             
             {/* Extreme Level Developer Badge - Clickable */}
             <div 
                onClick={() => setShowDevProfile(true)}
                className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-slate-900 border border-slate-700 shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] transform hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 text-slate-400 text-xs font-semibold uppercase tracking-widest group-hover:text-slate-300 transition-colors">Developed by</span>
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-300 font-black text-sm tracking-wide group-hover:from-emerald-300 group-hover:to-brand-400 transition-all">
                  Sayed Mohsin Ali
                </span>
                <span className="relative z-10 text-white text-xs px-3 py-1 rounded-full bg-brand-600/20 border border-brand-500/30 font-bold flex items-center gap-1.5 group-hover:bg-brand-500 group-hover:border-brand-400 transition-all shadow-inner">
                  <Sparkles size={12} className="text-brand-300 group-hover:text-white" />
                  Systems Developer
                </span>
             </div>
          </header>

          <div className="flex-1 flex items-center justify-center">
            <ProfileSetup onProfileSaved={handleProfileSaved} />
          </div>

          {/* Global Footer */}
          <footer className="mt-16 py-8 text-center border-t border-slate-200">
             <div className="flex flex-col items-center justify-center gap-3">
               <p className="text-slate-500 font-medium text-sm flex flex-col gap-1">
                 <span>
                   &copy; {new Date().getFullYear()} <strong className="text-slate-700">Sayed Mohsin Ali</strong>. All rights reserved.
                 </span>
                 <span className="text-xs text-slate-400">
                   Crafted with precision for professionals.
                 </span>
               </p>
               {/* Made with love + Flags */}
               <p className="text-xs font-bold text-slate-600 mt-1 bg-white px-5 py-2 rounded-full inline-flex items-center gap-1.5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                 Made with <span className="text-red-500 animate-pulse mx-0.5">❤️</span> in Khyber Pakhtunkhwa 🇵🇰 <span className="text-red-600 font-black ml-1 tracking-wide">🟥 Pakhtunistan</span>
               </p>
             </div>
          </footer>
        </div>
      ) : (
        <Generator baseProfile={baseProfile} onReset={handleReset} onShowDevProfile={() => setShowDevProfile(true)} />
      )}

      {/* Pro Level Fancy Developer Modal */}
      {showDevProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 no-print">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl transition-opacity" onClick={() => setShowDevProfile(false)}></div>
           
           {/* Modal Content */}
           <div className="bg-slate-900 rounded-[2.5rem] max-w-2xl w-full shadow-[0_0_60px_rgba(0,0,0,0.6)] border border-slate-700 relative overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-300 z-10">
              
              <button onClick={() => setShowDevProfile(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white z-20 p-2.5 bg-slate-800/80 rounded-full backdrop-blur-md border border-slate-700 hover:bg-slate-700 hover:scale-110 transition-all shadow-lg">
                <X size={20} />
              </button>
              
              {/* Header Graphic */}
              <div className="h-44 bg-gradient-to-br from-slate-800 via-brand-900 to-slate-900 relative overflow-hidden border-b border-slate-700/50">
                 {/* Abstract patterns */}
                 <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-400 via-transparent to-transparent"></div>
                 <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent"></div>
                 
                 {/* Grid Pattern overlay */}
                 <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              </div>
              
              {/* Body Content */}
              <div className="px-8 pb-10 pt-0 relative">
                 {/* Avatar / Icon Placeholder */}
                 <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-brand-500 to-emerald-600 p-1 shadow-[0_0_30px_rgba(20,184,166,0.3)] absolute -top-14 left-8 transform hover:scale-105 hover:-rotate-3 transition-all duration-300 z-10">
                    <div className="w-full h-full bg-slate-900 rounded-[1.35rem] flex items-center justify-center overflow-hidden relative">
                       <div className="absolute inset-0 bg-brand-500/10"></div>
                       <Code2 size={48} className="text-brand-400 drop-shadow-md" />
                    </div>
                 </div>
                 
                 <div className="mt-16 ml-2">
                   <h2 className="text-4xl font-black text-white tracking-tight mb-2">Sayed Mohsin Ali</h2>
                   <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 font-bold uppercase tracking-widest text-xs mb-8">
                     <Terminal size={14} /> Systems Developer
                   </div>
                   
                   <div className="space-y-5 text-slate-300 leading-relaxed text-[15px] font-medium">
                      <p>
                        A visionary <strong className="text-white">Systems Developer</strong> specializing in crafting high-performance, AI-driven web applications and robust digital ecosystems. 
                        With a deep passion for clean architecture and bleeding-edge technologies, I transform complex technical challenges into seamless, intuitive user experiences.
                      </p>
                      <p className="flex items-center gap-3 text-slate-400 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 shadow-inner">
                        <MapPin size={20} className="text-red-400 flex-shrink-0" />
                        <span>Based in the historic region of <strong className="text-slate-200">Khyber Pakhtunkhwa 🇵🇰</strong>, blending global tech standards with local resilience.</span>
                      </p>
                   </div>
                   
                   <div className="mt-8 pt-8 border-t border-slate-800">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Cpu size={14} /> Core Expertise
                      </h3>
                      <div className="flex flex-wrap gap-2.5">
                        {['React & Next.js', 'TypeScript', 'Node.js', 'AI / LLM Integration', 'System Architecture', 'UI/UX Engineering'].map(skill => (
                          <span key={skill} className="px-4 py-2 bg-slate-800/80 border border-slate-700 hover:border-brand-500/50 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200 transition-colors shadow-sm cursor-default">
                            {skill}
                          </span>
                        ))}
                      </div>
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
