import React, { useState, useEffect } from 'react';
import { ResumeProfile, CVRecord } from '../types';
import { tailorProfileForJob, generateCoverLetter } from '../services/aiService';
import CVTemplate from './CVTemplate';
import { Zap, Download, Settings, Loader2, Sparkles, History, FileText, Terminal, Info, Edit3, Mail, X } from 'lucide-react';

interface GeneratorProps {
  baseProfile: ResumeProfile;
  onReset: () => void;
  onShowDevProfile: () => void;
  onShowAboutApp: () => void;
  onShowRecords: () => void;
  onUpdateHistory: () => void;
}

const Generator: React.FC<GeneratorProps> = ({ 
  baseProfile, 
  onReset, 
  onShowDevProfile, 
  onShowAboutApp, 
  onShowRecords,
  onUpdateHistory 
}) => {
  const [targetJob, setTargetJob] = useState('');
  const [currentCV, setCurrentCV] = useState<ResumeProfile>(baseProfile);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'resume' | 'cover-letter'>('resume');
  
  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<ResumeProfile>(baseProfile);

  // When baseProfile changes (e.g., loaded from history), update currentCV
  useEffect(() => {
    setCurrentCV(baseProfile);
    setEditForm(baseProfile);
    setTargetJob(''); // reset target job since we loaded a specific profile
    setActiveTab('resume');
  }, [baseProfile]);

  const saveToHistory = (jobTitle: string, tailoredProfile: ResumeProfile) => {
    const newRecord: CVRecord = {
      id: Date.now().toString(),
      targetJob: jobTitle,
      date: new Date().toLocaleDateString(),
      profile: tailoredProfile
    };
    const hist = localStorage.getItem('fastcv_history');
    const records: CVRecord[] = hist ? JSON.parse(hist) : [];
    localStorage.setItem('fastcv_history', JSON.stringify([newRecord, ...records]));
    onUpdateHistory(); // notify parent
  };

  const handleGenerate = async () => {
    if (!targetJob.trim()) {
      setError("Please enter a job title.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const tailored = await tailorProfileForJob(baseProfile, targetJob);
      setCurrentCV(tailored);
      setEditForm(tailored);
      saveToHistory(targetJob, tailored);
      setActiveTab('resume');
    } catch (err: any) {
      setError(err.message || "Failed to generate CV. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!targetJob.trim()) {
      setError("Please enter a job title to generate a cover letter.");
      return;
    }

    setIsGeneratingLetter(true);
    setError(null);

    try {
      const letter = await generateCoverLetter(currentCV, targetJob);
      const updatedCV = { ...currentCV, coverLetter: letter };
      setCurrentCV(updatedCV);
      setEditForm(updatedCV);
      saveToHistory(targetJob + " (w/ Letter)", updatedCV);
      setActiveTab('cover-letter');
    } catch (err: any) {
      setError(err.message || "Failed to generate cover letter.");
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const handleSaveEdit = () => {
    setCurrentCV(editForm);
    setIsEditing(false);
    // Optionally save the edited version to history so it's not lost
    if (targetJob.trim()) {
       saveToHistory(targetJob + " (Edited)", editForm);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Sidebar - Controls (Hidden on print) */}
      <div className="w-full lg:w-[400px] bg-white border-r border-slate-200 flex flex-col no-print z-10 shadow-2xl lg:shadow-none">
        <div className="p-6 border-b border-slate-100 flex-1 overflow-y-auto">
          
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black tracking-tight text-brand-600 flex items-center gap-2">
              <Zap className="fill-brand-600" size={24} />
              FastCV
            </h1>
            <button 
              onClick={onReset}
              className="text-slate-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
              title="Clear & Start Over"
            >
              <Settings size={20} />
            </button>
          </div>

          {/* Generator Navbar */}
          <div className="grid grid-cols-4 gap-2 mb-8 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/60">
             <button onClick={onShowRecords} className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 hover:text-indigo-600 transition-all">
                <History size={16} className="mb-1" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Records</span>
             </button>
             <button onClick={onReset} className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 hover:text-slate-900 transition-all">
                <FileText size={16} className="mb-1" />
                <span className="text-[9px] font-bold uppercase tracking-wider">New CV</span>
             </button>
             <button onClick={onShowDevProfile} className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 hover:text-brand-600 transition-all">
                <Terminal size={16} className="mb-1" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Developer</span>
             </button>
             <button onClick={onShowAboutApp} className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 hover:text-emerald-600 transition-all">
                <Info size={16} className="mb-1" />
                <span className="text-[9px] font-bold uppercase tracking-wider">About</span>
             </button>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 rounded-2xl border border-slate-200/60 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Profile Data</h2>
              <button onClick={() => setIsEditing(true)} className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 hover:bg-brand-100 px-2 py-1 rounded-md transition-colors flex items-center gap-1">
                <Edit3 size={10} /> Edit Manual
              </button>
            </div>
            <p className="text-sm text-slate-700 mb-3 truncate">Ready for <strong className="font-bold text-slate-900">{currentCV.fullName}</strong></p>
            <div className="flex flex-wrap gap-2">
              <span className="text-[11px] font-semibold bg-white border border-slate-200 px-2 py-1 rounded-md text-brand-700 shadow-sm">
                {currentCV.experience?.length || 0} Roles
              </span>
              <span className="text-[11px] font-semibold bg-white border border-slate-200 px-2 py-1 rounded-md text-brand-700 shadow-sm">
                {currentCV.skills?.length || 0} Skills
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="targetJob" className="block text-sm font-bold text-slate-700 mb-2">
                Target Job Title
              </label>
              <input
                id="targetJob"
                type="text"
                placeholder="e.g., Senior Frontend Developer"
                value={targetJob}
                onChange={(e) => setTargetJob(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-slate-900 font-medium shadow-sm bg-white"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-200">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !targetJob.trim()}
              className="w-full py-4 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Tailoring Resume...
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Fast Generate
                </>
              )}
            </button>
            
            <button
              onClick={handleGenerateCoverLetter}
              disabled={isGeneratingLetter || !targetJob.trim()}
              className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isGeneratingLetter ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Writing Letter...
                </>
              ) : (
                <>
                  <Mail size={18} />
                  Add Cover Letter
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-6 mt-auto bg-slate-50 border-t border-slate-200 flex flex-col items-center">
           <button
            onClick={handlePrint}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <Download size={18} />
            Export to PDF (Print)
          </button>
          <p className="text-center text-xs text-slate-500 font-medium mt-3 mb-6">
            Tip: Uses browser print dialog to save as PDF.
          </p>

          {/* Sidebar Developer Copyright */}
          <div className="w-full pt-5 border-t border-slate-200 text-center relative">
             <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5">Crafted by</p>
             <button onClick={onShowDevProfile} className="group block w-full outline-none text-center hover:scale-105 transition-transform duration-300">
               <span className="block text-sm font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-emerald-600 group-hover:from-brand-500 group-hover:to-emerald-500 transition-all">
                 Sayed Mohsin Ali
               </span>
               <span className="inline-flex items-center gap-1 mt-1 bg-white border border-slate-200 shadow-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold text-brand-600 group-hover:bg-brand-50 transition-colors">
                 Systems Developer <Sparkles size={10} />
               </span>
             </button>
             
             <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col items-center justify-center gap-1.5">
               <p className="text-[10px] text-slate-400 font-medium">
                 &copy; {new Date().getFullYear()} All rights reserved.
               </p>
               <p className="text-[10px] text-slate-400 font-medium">
                 Crafted with precision for professionals.
               </p>
               
               {/* Sleek Vertical Hover Animation - Small, Glowing, Fancy */}
               <div className="group relative flex items-center justify-center min-h-[20px] w-full cursor-default overflow-hidden">
                 <span className="absolute transform transition-all duration-500 group-hover:-translate-y-8 group-hover:opacity-0 flex items-center gap-1 text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                   Made with <span className="text-red-500 text-[9px] animate-pulse">❤️</span> in PK
                 </span>
                 <span className="absolute transform translate-y-8 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 text-[9px] uppercase tracking-widest font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-brand-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] whitespace-nowrap">
                   Pakhtunistan, Khyber Pakhtunkhwa
                 </span>
               </div>
               
             </div>
          </div>
        </div>
      </div>

      {/* Main View - CV Preview */}
      <div className="flex-1 bg-slate-100 lg:overflow-y-auto p-4 lg:p-8 relative flex flex-col">
        {/* Mobile indicator */}
        <div className="lg:hidden text-center mb-6 text-sm text-brand-600 font-bold uppercase tracking-wider no-print">
          Scroll down to see preview
        </div>

        {/* Tab View Switcher */}
        {currentCV.coverLetter && (
          <div className="flex justify-center mb-6 no-print">
             <div className="bg-white p-1 rounded-full shadow-sm border border-slate-200 inline-flex">
               <button 
                  onClick={() => setActiveTab('resume')}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'resume' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
               >
                 Resume
               </button>
               <button 
                  onClick={() => setActiveTab('cover-letter')}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'cover-letter' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
               >
                 Cover Letter
               </button>
             </div>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto w-full relative pb-10">
          {isGenerating && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-md z-10 flex items-center justify-center rounded-lg border border-white/50">
              <div className="bg-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-brand-600 font-bold border border-brand-100">
                <Loader2 className="animate-spin" size={24} />
                Rewriting perfectly for {targetJob}...
              </div>
            </div>
          )}
          
          <CVTemplate profile={currentCV} view={activeTab} />
        </div>
      </div>

      {/* Edit CV Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsEditing(false)}></div>
           
           <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2rem] shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-300 z-10 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-20">
               <div>
                 <h2 className="text-xl font-bold text-slate-900">Edit Details Manually</h2>
                 <p className="text-xs text-slate-500 font-medium">Fine-tune the content before exporting</p>
               </div>
               <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-800 p-2 bg-white rounded-full border border-slate-200 shadow-sm">
                 <X size={18} />
               </button>
             </div>

             <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Professional Summary</label>
                  <textarea 
                    className="w-full p-4 rounded-xl border-2 border-slate-200 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 text-sm h-32 leading-relaxed"
                    value={editForm.summary}
                    onChange={(e) => setEditForm({...editForm, summary: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Experience Bullet Points</label>
                  <div className="space-y-4">
                    {editForm.experience.map((exp, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="font-bold text-sm text-slate-800 mb-2">{exp.role} @ {exp.company}</div>
                        <textarea 
                          className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm h-28 leading-relaxed"
                          value={exp.description.join('\n')}
                          onChange={(e) => {
                            const newExp = [...editForm.experience];
                            newExp[idx].description = e.target.value.split('\n').filter(Boolean);
                            setEditForm({...editForm, experience: newExp});
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {editForm.coverLetter && (
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Cover Letter Body</label>
                     <textarea 
                       className="w-full p-4 rounded-xl border-2 border-slate-200 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 text-sm h-48 leading-relaxed"
                       value={editForm.coverLetter}
                       onChange={(e) => setEditForm({...editForm, coverLetter: e.target.value})}
                     />
                   </div>
                )}
             </div>

             <div className="p-6 border-t border-slate-100 bg-white sticky bottom-0 z-20 flex gap-3">
                <button onClick={() => setIsEditing(false)} className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all">
                  Cancel
                </button>
                <button onClick={handleSaveEdit} className="flex-1 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all shadow-md">
                  Save Changes
                </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Generator;