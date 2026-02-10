import React, { useState, useEffect } from 'react';
import { ResumeProfile, CVRecord } from '../types';
import { tailorProfileForJob, generateCoverLetter, enhanceMicroText } from '../services/aiService';
import CVTemplate, { TemplateType } from './CVTemplate';
import { Zap, Download, Settings, Loader2, Sparkles, History, FileText, Terminal, Info, Mail, X, LayoutTemplate, Palette, Trash2, ArrowRight, ArrowLeft, Save } from 'lucide-react';

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
  const [isEnhancing, setIsEnhancing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'resume' | 'cover-letter'>('resume');
  
  // Settings & Templates
  const [showSettings, setShowSettings] = useState(false);
  const [template, setTemplate] = useState<TemplateType>('modern');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // When baseProfile changes (e.g., loaded from history), update currentCV
  useEffect(() => {
    setCurrentCV(baseProfile);
    setTargetJob(''); // reset target job since we loaded a specific profile
    setActiveTab('resume');
    setHasUnsavedChanges(false);
  }, [baseProfile]);

  const saveToHistory = (jobTitle: string, tailoredProfile: ResumeProfile) => {
    const newRecord: CVRecord = {
      id: Date.now().toString(),
      targetJob: jobTitle || 'Manual Edit',
      date: new Date().toLocaleDateString(),
      profile: tailoredProfile
    };
    const hist = localStorage.getItem('fastcv_history');
    const records: CVRecord[] = hist ? JSON.parse(hist) : [];
    localStorage.setItem('fastcv_history', JSON.stringify([newRecord, ...records]));
    onUpdateHistory(); // notify parent
  };

  const handleManualSave = () => {
    saveToHistory(targetJob || 'Saved Draft', currentCV);
    setHasUnsavedChanges(false);
    alert("CV successfully saved to your Records!");
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
      saveToHistory(targetJob, tailored);
      setActiveTab('resume');
      setHasUnsavedChanges(false);
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
      saveToHistory(targetJob + " (w/ Letter)", updatedCV);
      setActiveTab('cover-letter');
      setHasUnsavedChanges(false);
    } catch (err: any) {
      setError(err.message || "Failed to generate cover letter.");
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  // Triggered when user directly edits text in the CV
  const handleProfileUpdate = (updatedProfile: ResumeProfile) => {
    setCurrentCV(updatedProfile);
    setHasUnsavedChanges(true);
  };

  // Triggered when user clicks the AI Sparkles on a specific field
  const handleAIEnhance = async (field: string, expIndex?: number, descIndex?: number, text?: string) => {
    if (!text) return;
    const key = field === 'summary' ? 'summary' : `exp-${expIndex}-${descIndex}`;
    setIsEnhancing(key);
    
    try {
      const newText = await enhanceMicroText(text, field === 'summary' ? 'summary' : 'bullet');
      const updatedProfile = { ...currentCV };
      
      if (field === 'summary') {
        updatedProfile.summary = newText;
      } else if (expIndex !== undefined && descIndex !== undefined) {
        updatedProfile.experience[expIndex].description[descIndex] = newText;
      }
      
      setCurrentCV(updatedProfile);
      setHasUnsavedChanges(true); // AI edits count as unsaved changes until user explicitly saves or exports
    } catch (err) {
      console.error(err);
      alert("Failed to rewrite with AI. Please try again.");
    } finally {
      setIsEnhancing(null);
    }
  };

  const handlePrint = () => {
    // Before printing, auto-save the current state in case user made inline edits
    if (hasUnsavedChanges) {
      saveToHistory(targetJob || 'Exported CV', currentCV);
      setHasUnsavedChanges(false);
    }
    window.print();
  };

  const ALL_TEMPLATES: {id: TemplateType, name: string}[] = [
    { id: 'modern', name: 'Modern' },
    { id: 'professional', name: 'Classic' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'ats-strict', name: 'ATS Strict' },
    { id: 'creative', name: 'Creative' },
    { id: 'executive', name: 'Executive' },
    { id: 'elegant', name: 'Elegant' },
    { id: 'bold', name: 'Bold Dark' },
    { id: 'startup', name: 'Startup' },
    { id: 'corporate', name: 'Corporate' },
    { id: 'tech', name: 'Tech / IT' },
    { id: 'academic', name: 'Academic' }
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden relative">
      {/* Sidebar - Controls (Hidden on print) */}
      <div className="w-full lg:w-[400px] bg-white border-r border-slate-200 flex flex-col no-print z-10 shadow-2xl lg:shadow-none">
        <div className="p-6 border-b border-slate-100 flex-1 overflow-y-auto custom-scrollbar">
          
          <div className="flex flex-col mb-6">
            <button 
              onClick={onReset} 
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-brand-600 transition-all group w-fit mb-2"
            >
              <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Main Menu
            </button>
            <div className="flex items-center justify-between">
              <h1 
                onClick={onReset}
                className="text-2xl font-black tracking-tight text-brand-600 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                title="Return to Setup / Home"
              >
                <Zap className="fill-brand-600" size={24} />
                FastCV
              </h1>
              <button 
                onClick={() => setShowSettings(true)}
                className="text-slate-400 hover:text-slate-800 p-2 rounded-xl hover:bg-slate-100 transition-all border border-transparent"
                title="Design & Settings"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Generator Navbar */}
          <div className="grid grid-cols-4 gap-2 mb-8 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/60">
             <button onClick={onShowRecords} className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 hover:text-indigo-600 transition-all">
                <History size={16} className="mb-1" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Records</span>
             </button>
             <button onClick={() => setShowSettings(true)} className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 hover:text-brand-600 transition-all">
                <Palette size={16} className="mb-1" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Design</span>
             </button>
             <button onClick={onShowDevProfile} className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 hover:text-slate-900 transition-all">
                <Terminal size={16} className="mb-1" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Dev</span>
             </button>
             <button onClick={onShowAboutApp} className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 hover:text-emerald-600 transition-all">
                <Info size={16} className="mb-1" />
                <span className="text-[9px] font-bold uppercase tracking-wider">About</span>
             </button>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 rounded-2xl border border-slate-200/60 mb-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10"><LayoutTemplate size={48} /></div>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Profile</h2>
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                Live Edit Mode
              </span>
            </div>
            <p className="text-sm text-slate-700 mb-3 truncate relative z-10">Ready for <strong className="font-bold text-slate-900">{currentCV.fullName}</strong></p>
            <p className="text-[10px] text-slate-500 font-medium relative z-10 leading-relaxed">
              💡 Tip: Click anywhere on the CV to type directly. Hover over items to drag-and-drop or use AI rewrite!
            </p>
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
            Save & Export PDF
          </button>
          <p className="text-center text-[10px] text-slate-500 font-medium mt-3 mb-4">
            Auto-saves edits. Uses browser dialog to save PDF.
          </p>

          {/* Sidebar Developer Copyright */}
          <div className="w-full pt-4 border-t border-slate-200 text-center relative">
             <button onClick={onShowDevProfile} className="group block w-full outline-none text-center hover:scale-105 transition-transform duration-300">
               <span className="block text-xs font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-emerald-600 group-hover:from-brand-500 group-hover:to-emerald-500 transition-all">
                 FastCv Systems Developer
               </span>
             </button>
          </div>
        </div>
      </div>

      {/* Main View - CV Preview */}
      <div className="flex-1 bg-slate-100 lg:overflow-y-auto pt-6 px-4 pb-4 lg:p-8 relative flex flex-col w-full overflow-x-hidden">
        
        {/* Mobile Horizontal Swipe Indicator */}
        <div className="lg:hidden flex justify-center items-center mb-6 no-print">
          <div className="bg-brand-100/60 border border-brand-200 text-brand-700 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm">
            <Sparkles size={14} /> Swipe horizontally to view full CV <ArrowRight size={14} className="animate-pulse" />
          </div>
        </div>

        {/* Main View Top Bar (Tabs & Export) */}
        <div className="max-w-4xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 no-print">
          <div className="flex-1 flex justify-start">
            {currentCV.coverLetter && (
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
            )}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {hasUnsavedChanges && (
              <button
                onClick={handleManualSave}
                className="px-4 py-2.5 bg-brand-100 hover:bg-brand-200 text-brand-700 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm border border-brand-200 animate-pulse"
              >
                <Save size={16} />
                <span className="hidden sm:inline">Save Edit</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hidden sm:flex"
            >
              <Download size={16} />
              Export PDF
            </button>
          </div>
        </div>
        
        {/* Scrollable Container for Mobile Responsiveness */}
        <div className="w-full relative pb-10 overflow-x-auto print:overflow-visible custom-scrollbar">
          
          {isGenerating && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-md z-30 flex items-center justify-center rounded-lg border border-white/50">
              <div className="bg-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-brand-600 font-bold border border-brand-100">
                <Loader2 className="animate-spin" size={24} />
                Rewriting perfectly for {targetJob}...
              </div>
            </div>
          )}
          
          <div className="min-w-[800px] w-max print:min-w-0 print:w-full mx-auto px-2 sm:px-0 print:px-0">
            <CVTemplate 
              profile={currentCV} 
              view={activeTab} 
              template={template} 
              onUpdate={handleProfileUpdate}
              onAIEnhance={handleAIEnhance}
              isEnhancing={isEnhancing}
            />
          </div>
        </div>
      </div>

      {/* Settings & Design Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity" onClick={() => setShowSettings(false)}></div>
           
           <div className="bg-slate-50 w-full max-w-2xl h-[85vh] rounded-[2rem] shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-300 z-10 overflow-hidden">
             <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-20">
               <div className="flex items-center gap-3 sm:gap-4">
                 <button onClick={() => setShowSettings(false)} className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-all group shadow-sm">
                   <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> <span className="hidden sm:inline">Back</span>
                 </button>
                 <div className="flex items-center gap-2">
                   <div className="p-2 bg-brand-50 text-brand-600 rounded-lg hidden sm:block">
                     <Settings size={20} />
                   </div>
                   <div>
                     <h2 className="text-xl font-bold text-slate-900">Design & Templates</h2>
                     <p className="text-[10px] text-slate-500 font-medium">Select from 12 Premium ATS & Modern layouts</p>
                   </div>
                 </div>
               </div>
               <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-800 p-2.5 bg-slate-50 rounded-full border border-slate-200 shadow-sm hover:bg-slate-100 transition-all">
                 <X size={18} />
               </button>
             </div>

             <div className="p-6 overflow-y-auto space-y-8 flex-1">
                {/* Templates Grid */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <LayoutTemplate size={16} className="text-brand-500" /> Choose Your Style
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                     {ALL_TEMPLATES.map(tpl => (
                       <button 
                         key={tpl.id}
                         onClick={() => setTemplate(tpl.id)}
                         className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all group ${template === tpl.id ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-md' : 'border-slate-200 bg-white text-slate-500 hover:border-brand-200 hover:shadow-sm'}`}
                       >
                         <div className={`w-full h-14 rounded border mb-2 flex flex-col p-1.5 gap-1 transition-all ${template === tpl.id ? 'border-brand-300 bg-brand-100' : 'border-slate-100 bg-slate-50 group-hover:bg-slate-100'}`}>
                            <div className={`h-2 rounded ${template === tpl.id ? 'bg-brand-500 w-1/2' : 'bg-slate-300 w-1/2'}`}></div>
                            <div className={`h-1 rounded mt-1 ${template === tpl.id ? 'bg-brand-300 w-full' : 'bg-slate-200 w-full'}`}></div>
                            <div className={`h-1 rounded ${template === tpl.id ? 'bg-brand-300 w-3/4' : 'bg-slate-200 w-3/4'}`}></div>
                            <div className={`h-1 rounded ${template === tpl.id ? 'bg-brand-300 w-5/6' : 'bg-slate-200 w-5/6'}`}></div>
                         </div>
                         <span className="text-xs font-bold">{tpl.name}</span>
                       </button>
                     ))}
                  </div>
                </div>

                <hr className="border-slate-200" />

                {/* Danger Zone */}
                <div>
                  <h3 className="text-sm font-bold text-red-600 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Trash2 size={16} /> Danger Zone
                  </h3>
                  <button 
                    onClick={() => {
                      setShowSettings(false);
                      onReset();
                    }}
                    className="w-full py-3 px-4 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl border border-red-200 font-bold transition-all flex justify-center items-center gap-2"
                  >
                    Clear All Data & Return to Setup
                  </button>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    This clears your current active base profile from the workspace.
                  </p>
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Generator;