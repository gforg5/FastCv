import React, { useState } from 'react';
import { parseRawProfile } from '../services/aiService';
import { ResumeProfile } from '../types';
import { Loader2, FileText, Upload, Sparkles } from 'lucide-react';

interface ProfileSetupProps {
  onProfileSaved: (profile: ResumeProfile) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onProfileSaved }) => {
  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async () => {
    if (!rawText.trim()) {
      setError("Please paste some details first.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const parsedProfile = await parseRawProfile(rawText);
      onProfileSaved(parsedProfile);
    } catch (err: any) {
      setError(err.message || "Failed to parse details. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Fancy About Section */}
      <div className="mb-8 p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl text-white relative overflow-hidden border border-slate-700/50">
        <div className="absolute -top-10 -right-10 p-8 opacity-5 transform rotate-12 pointer-events-none">
           <FileText size={240} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="p-4 bg-brand-500/20 rounded-2xl backdrop-blur-sm border border-brand-400/30">
            <Sparkles className="text-brand-300" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-emerald-300">
              About FastCV
            </h2>
            <p className="text-slate-300 leading-relaxed max-w-2xl text-sm md:text-base font-medium">
              FastCV is an intelligent, high-speed resume generator. Simply provide your base profile details <strong>just once</strong>. 
              After that, enter any target job title, and our AI will instantly tailor, reorder, and optimize your resume perfectly for that specific role. No more repetitive typing!
            </p>
          </div>
        </div>
      </div>

      {/* Input Form Box */}
      <div className="p-8 bg-white rounded-3xl shadow-xl border border-slate-200 relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 mb-6 shadow-inner border border-brand-100 transform -rotate-3 hover:rotate-0 transition-all duration-300">
            <Upload size={28} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Setup Your Base Profile</h2>
          <p className="text-slate-500 font-medium">
            Paste your existing resume, LinkedIn summary, or just type your details below. 
          </p>
        </div>

        <div className="space-y-5 relative z-10">
          <textarea
            className="w-full h-72 p-5 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-y font-mono text-sm shadow-inner leading-relaxed"
            placeholder="e.g., John Doe&#10;john@email.com&#10;Software Engineer at TechCorp (2020-Present). I build React apps...&#10;Skills: JavaScript, TypeScript, React..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          
          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              {error}
            </div>
          )}

          <button
            onClick={handleExtract}
            disabled={isProcessing}
            className="w-full py-4 px-6 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={22} />
                Analyzing & Extracting Details...
              </>
            ) : (
              <>
                <FileText size={22} />
                Save Base Profile & Continue
              </>
            )}
          </button>
        </div>
        
        {/* Adjusted bottom text to be extremely small, single line, with required text */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
          Powered by Advanced AI Models (Mohsin Web-Systems)
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
