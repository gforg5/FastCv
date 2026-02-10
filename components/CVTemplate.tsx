import React, { useState } from 'react';
import { ResumeProfile, Experience, Education } from '../types';
import { Mail, Phone, MapPin, Sparkles, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';

export type TemplateType = 'modern' | 'professional' | 'minimal' | 'ats-strict' | 'creative' | 'executive' | 'elegant' | 'bold' | 'startup' | 'corporate' | 'tech' | 'academic';

interface CVTemplateProps {
  profile: ResumeProfile;
  view?: 'resume' | 'cover-letter';
  template?: TemplateType;
  onUpdate?: (updated: ResumeProfile) => void;
  onAIEnhance?: (field: string, expIndex?: number, descIndex?: number, text?: string) => void;
  isEnhancing?: string | null;
}

const CVTemplate: React.FC<CVTemplateProps> = ({ 
  profile, 
  view = 'resume', 
  template = 'modern', 
  onUpdate,
  onAIEnhance,
  isEnhancing
}) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragType, setDragType] = useState<'experience' | 'education' | null>(null);

  // ContentEditable Blur Handler
  const handleBlur = (field: keyof ResumeProfile, e: React.FocusEvent<HTMLElement>) => {
    if (!onUpdate) return;
    const value = e.currentTarget.innerText;
    onUpdate({ ...profile, [field]: value });
  };

  const handleExpBlur = (index: number, field: keyof Experience, e: React.FocusEvent<HTMLElement>) => {
    if (!onUpdate) return;
    const value = e.currentTarget.innerText;
    const newExp = [...profile.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    onUpdate({ ...profile, experience: newExp });
  };

  const handleExpDescBlur = (expIndex: number, descIndex: number, e: React.FocusEvent<HTMLElement>) => {
    if (!onUpdate) return;
    const value = e.currentTarget.innerText;
    const newExp = [...profile.experience];
    const newDesc = [...newExp[expIndex].description];
    newDesc[descIndex] = value;
    newExp[expIndex] = { ...newExp[expIndex], description: newDesc };
    onUpdate({ ...profile, experience: newExp });
  };

  const handleEduBlur = (index: number, field: keyof Education, e: React.FocusEvent<HTMLElement>) => {
    if (!onUpdate) return;
    const value = e.currentTarget.innerText;
    const newEdu = [...profile.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    onUpdate({ ...profile, education: newEdu });
  };

  const preventEnter = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down', type: 'experience' | 'education') => {
    if (!onUpdate) return;
    const items = [...profile[type]] as any[];
    if (direction === 'up' && index > 0) {
      [items[index - 1], items[index]] = [items[index], items[index - 1]];
    } else if (direction === 'down' && index < items.length - 1) {
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
    }
    onUpdate({ ...profile, [type]: items });
  };

  const handleDragStart = (e: React.DragEvent, index: number, type: 'experience' | 'education') => {
    setDragIndex(index);
    setDragType(type);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number, type: 'experience' | 'education') => {
    e.preventDefault();
    if (!onUpdate || dragType !== type || dragIndex === null || dragIndex === index) return;
    
    const items = [...profile[type]] as any[];
    const draggedItem = items[dragIndex];
    items.splice(dragIndex, 1);
    items.splice(index, 0, draggedItem);
    
    onUpdate({ ...profile, [type]: items });
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragType(null);
  };

  const editableClass = "outline-none hover:bg-brand-50/40 hover:outline hover:outline-2 hover:outline-dashed hover:outline-brand-300 transition-all rounded px-0.5 -mx-0.5 focus:bg-white focus:outline-solid focus:outline-brand-500 focus:ring-2 focus:ring-brand-500/20";
  const itemWrapperClass = "group/item relative transition-all rounded-lg sm:-mx-4 sm:px-4 py-2 hover:bg-slate-50/50";

  // Detailed Template Styles for 12 Distinct Looks
  const templateStyles = {
    modern: {
      wrapper: "text-slate-800 font-sans",
      header: "border-b-2 border-slate-800 pb-6 mb-6",
      name: "text-4xl font-bold uppercase tracking-wider text-slate-900 mb-3",
      sectionTitle: "text-lg font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-200 pb-1",
      jobTitle: "font-bold text-slate-800",
      company: "text-sm font-medium text-brand-600 mb-2",
      date: "text-xs font-semibold text-slate-500",
      skills: "bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-200 px-2 py-1"
    },
    professional: {
      wrapper: "text-black font-serif",
      header: "border-b-2 border-black pb-4 mb-6 text-center",
      name: "text-4xl font-bold uppercase tracking-widest text-black mb-2",
      sectionTitle: "text-lg font-bold text-black uppercase tracking-widest mb-4 border-b border-black pb-1",
      jobTitle: "font-bold text-black",
      company: "text-sm font-bold text-gray-700 mb-2 italic",
      date: "text-xs font-bold text-gray-600",
      skills: "bg-transparent text-black text-sm font-semibold border-r border-black last:border-0 rounded-none px-2 py-0"
    },
    minimal: {
      wrapper: "text-gray-800 font-sans",
      header: "mb-8",
      name: "text-5xl font-light text-gray-900 mb-2",
      sectionTitle: "text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 mt-8",
      jobTitle: "font-medium text-gray-900 text-lg",
      company: "text-sm text-gray-500 mb-2",
      date: "text-xs text-gray-400",
      skills: "text-gray-600 text-sm px-1 py-0.5"
    },
    'ats-strict': {
      wrapper: "text-black font-serif leading-tight",
      header: "mb-4 text-center",
      name: "text-3xl font-bold text-black mb-1",
      sectionTitle: "text-md font-bold text-black uppercase tracking-wider mb-2 border-b border-black pb-0.5",
      jobTitle: "font-bold text-black text-sm",
      company: "text-sm text-black italic mb-1",
      date: "text-sm text-black",
      skills: "bg-transparent text-black text-sm px-1"
    },
    creative: {
      wrapper: "text-slate-800 font-sans",
      header: "mb-8 pb-4 border-b-4 border-brand-500",
      name: "text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 mb-2",
      sectionTitle: "text-xl font-bold text-brand-600 mb-4 pl-3 border-l-4 border-brand-500 bg-brand-50 py-1",
      jobTitle: "font-bold text-slate-900 text-lg",
      company: "text-sm font-bold text-indigo-500 mb-2",
      date: "text-xs font-bold text-slate-400 uppercase",
      skills: "bg-indigo-50 text-indigo-700 border border-indigo-100 text-sm font-bold rounded-full px-3 py-1"
    },
    executive: {
      wrapper: "text-slate-900 font-serif",
      header: "border-t-4 border-b-4 border-slate-900 py-6 mb-8 text-center bg-slate-50",
      name: "text-4xl font-normal tracking-[0.3em] uppercase text-slate-900 mb-3",
      sectionTitle: "text-xl font-normal text-slate-900 uppercase tracking-widest mb-6 text-center border-b border-slate-300 pb-2",
      jobTitle: "font-bold text-slate-900 text-lg uppercase tracking-wider",
      company: "text-md font-normal text-slate-600 mb-2",
      date: "text-sm font-bold text-slate-500",
      skills: "bg-transparent text-slate-800 text-sm uppercase tracking-wider border border-slate-300 px-3 py-1"
    },
    elegant: {
      wrapper: "text-gray-700 font-serif",
      header: "mb-10 text-center",
      name: "text-4xl font-light text-gray-900 mb-2 tracking-widest",
      sectionTitle: "text-md font-semibold text-gray-500 uppercase tracking-[0.2em] mb-4 text-center pb-2",
      jobTitle: "font-medium text-gray-900 text-lg",
      company: "text-sm text-gray-500 italic mb-2",
      date: "text-xs text-gray-400 tracking-wider",
      skills: "text-gray-600 text-sm px-2 border-r border-gray-300 last:border-0"
    },
    bold: {
      wrapper: "text-black font-sans",
      header: "mb-8",
      name: "text-6xl font-black uppercase tracking-tighter text-black mb-1",
      sectionTitle: "text-lg font-black text-white bg-black uppercase tracking-widest px-3 py-1.5 mb-4 inline-block w-full",
      jobTitle: "font-black text-black text-xl uppercase",
      company: "text-sm font-bold text-gray-600 mb-2",
      date: "text-xs font-black text-black uppercase bg-gray-200 px-2 py-0.5",
      skills: "bg-black text-white text-xs font-bold uppercase px-2 py-1"
    },
    startup: {
      wrapper: "text-slate-700 font-sans",
      header: "mb-6 flex flex-col items-start",
      name: "text-4xl font-extrabold text-slate-900 mb-2",
      sectionTitle: "text-lg font-extrabold text-emerald-600 uppercase mb-4 flex items-center gap-2",
      jobTitle: "font-bold text-slate-900 text-lg",
      company: "text-sm font-bold text-slate-500 mb-2",
      date: "text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md",
      skills: "bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl px-3 py-1"
    },
    corporate: {
      wrapper: "text-slate-800 font-sans",
      header: "mb-6 border-b-2 border-blue-900 pb-4",
      name: "text-3xl font-bold text-blue-900 mb-2 uppercase",
      sectionTitle: "text-md font-bold text-white bg-blue-900 uppercase tracking-widest px-4 py-1 mb-4",
      jobTitle: "font-bold text-blue-900",
      company: "text-sm font-semibold text-slate-600 mb-2 uppercase",
      date: "text-sm font-bold text-slate-500",
      skills: "text-slate-700 font-semibold text-sm border-b border-slate-200 pb-1"
    },
    tech: {
      wrapper: "text-slate-300 font-mono bg-slate-900 print:bg-white print:text-black",
      header: "mb-8 border-b border-brand-500/30 pb-4 print:border-black",
      name: "text-3xl font-bold text-brand-400 mb-2 print:text-black",
      sectionTitle: "text-lg font-bold text-brand-500 mb-4 print:text-black print:border-b print:border-black",
      jobTitle: "font-bold text-emerald-400 text-lg print:text-black",
      company: "text-sm text-slate-400 mb-2 print:text-gray-600",
      date: "text-xs text-brand-500/80 print:text-black",
      skills: "bg-slate-800 text-brand-300 border border-brand-500/20 text-xs rounded px-2 py-1 print:bg-transparent print:border-black print:text-black"
    },
    academic: {
      wrapper: "text-black font-serif",
      header: "mb-6 border-b border-black pb-4 text-center",
      name: "text-2xl font-bold text-black mb-1",
      sectionTitle: "text-md font-bold text-black uppercase mb-3 mt-6 border-t border-b border-black py-1 text-center bg-gray-50",
      jobTitle: "font-bold text-black",
      company: "text-sm text-black italic mb-1",
      date: "text-sm text-black",
      skills: "text-black text-sm pr-3"
    }
  };

  const style = templateStyles[template];

  if (view === 'cover-letter' && profile.coverLetter) {
    return (
      <div className={`bg-white shadow-xl w-[21cm] max-w-full min-h-[29.7cm] mx-auto p-8 sm:p-12 cv-page sm:rounded-lg shrink-0 ${style.wrapper}`}>
        <header className={style.header}>
          <h1 
            className={`${style.name} ${editableClass}`}
            contentEditable={true} 
            suppressContentEditableWarning={true}
            onBlur={(e) => handleBlur('fullName', e)}
            onKeyDown={preventEnter}
          >
            {profile.fullName || 'Your Name'}
          </h1>
          <div className={`flex flex-wrap gap-4 text-sm ${['professional', 'executive', 'elegant', 'academic', 'ats-strict'].includes(template) ? 'justify-center' : ''}`}>
             <div className={`flex items-center gap-1.5 ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleBlur('email', e)} onKeyDown={preventEnter}>{profile.email}</div>
             <div className={`flex items-center gap-1.5 ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleBlur('phone', e)} onKeyDown={preventEnter}>{profile.phone}</div>
             <div className={`flex items-center gap-1.5 ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleBlur('location', e)} onKeyDown={preventEnter}>{profile.location}</div>
          </div>
        </header>

        <div 
          className={`text-base leading-loose whitespace-pre-wrap ${editableClass} p-4`}
          contentEditable={true} 
          suppressContentEditableWarning={true}
          onBlur={(e) => handleBlur('coverLetter', e)}
        >
          {profile.coverLetter}
        </div>
      </div>
    );
  }

  // Helper for rendering skills layout based on template
  const getSkillsContainerClass = () => {
    if (['professional', 'elegant', 'academic'].includes(template)) return 'flex flex-wrap gap-0';
    if (['bold', 'corporate', 'ats-strict'].includes(template)) return 'flex flex-wrap gap-3';
    return 'flex flex-wrap gap-2'; // default modern/minimal/startup
  };

  return (
    <div className={`bg-white shadow-xl w-[21cm] max-w-full min-h-[29.7cm] mx-auto p-8 sm:p-12 cv-page sm:rounded-lg shrink-0 ${style.wrapper} relative group/cv`}>
      
      {/* Edit Hint */}
      <div className="absolute top-4 right-4 bg-brand-50 text-brand-600 text-xs font-bold px-3 py-1.5 rounded-full border border-brand-200 opacity-100 sm:opacity-0 group-hover/cv:opacity-100 transition-opacity no-print shadow-sm flex items-center gap-1.5 pointer-events-none">
        <Sparkles size={12} /> Click anywhere to edit directly
      </div>

      {/* Header */}
      <header className={style.header}>
        <h1 
          className={`${style.name} ${editableClass}`}
          contentEditable={true} suppressContentEditableWarning={true} 
          onBlur={(e) => handleBlur('fullName', e)}
          onKeyDown={preventEnter}
        >
          {profile.fullName || 'Your Name'}
        </h1>
        <div className={`flex flex-wrap gap-4 text-sm ${['professional', 'executive', 'elegant', 'academic', 'ats-strict'].includes(template) ? 'justify-center' : 'text-slate-600 print:text-black'}`}>
          <div className={`flex items-center gap-1.5 ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleBlur('email', e)} onKeyDown={preventEnter}><Mail size={14} className="no-print" />{profile.email}</div>
          <div className={`flex items-center gap-1.5 ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleBlur('phone', e)} onKeyDown={preventEnter}><Phone size={14} className="no-print" />{profile.phone}</div>
          <div className={`flex items-center gap-1.5 ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleBlur('location', e)} onKeyDown={preventEnter}><MapPin size={14} className="no-print" />{profile.location}</div>
        </div>
      </header>

      {/* Summary */}
      {profile.summary && (
        <section className="mb-6 relative group/summary">
          <div className="absolute -left-6 sm:-left-10 top-0 p-1.5 sm:p-2 opacity-100 sm:opacity-0 group-hover/summary:opacity-100 cursor-pointer no-print transition-all hover:scale-110 bg-brand-100 sm:bg-transparent rounded-md shadow-sm sm:shadow-none z-20" onClick={() => onAIEnhance && onAIEnhance('summary', undefined, undefined, profile.summary)} title="Rewrite Summary with AI">
            {isEnhancing === 'summary' ? <div className="w-4 h-4 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></div> : <Sparkles size={16} className="text-brand-600 sm:text-brand-500" />}
          </div>
          <p 
            className={`text-sm leading-relaxed ${template === 'minimal' ? 'text-gray-600' : ''} ${editableClass}`}
            contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleBlur('summary', e)}
          >
            {profile.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {profile.experience && profile.experience.length > 0 && (
        <section className="mb-8">
          <h2 className={style.sectionTitle}>Experience</h2>
          <div className="space-y-4">
            {profile.experience.map((exp, idx) => (
              <div 
                key={idx} 
                className={itemWrapperClass}
                draggable
                onDragStart={(e) => handleDragStart(e, idx, 'experience')}
                onDragOver={(e) => handleDragOver(e, idx, 'experience')}
                onDragEnd={handleDragEnd}
                style={{ opacity: dragIndex === idx && dragType === 'experience' ? 0.4 : 1 }}
              >
                {/* Drag Handle & Up/Down Arrows */}
                <div className="absolute -left-2 sm:-left-12 top-1 sm:top-2 flex flex-col sm:flex-row items-center opacity-100 sm:opacity-0 group-hover/item:opacity-100 transition-opacity no-print bg-white sm:bg-transparent shadow-sm sm:shadow-none rounded-md border border-slate-200 sm:border-transparent z-20 p-0.5">
                  <button onClick={() => handleMove(idx, 'up', 'experience')} disabled={idx === 0} className="p-1 text-slate-500 hover:text-brand-600 disabled:opacity-30"><ArrowUp size={16}/></button>
                  <div className="p-1 text-slate-400 cursor-grab active:cursor-grabbing hover:text-brand-600 hidden sm:block" title="Drag to reorder"><GripVertical size={16} /></div>
                  <button onClick={() => handleMove(idx, 'down', 'experience')} disabled={idx === profile.experience.length - 1} className="p-1 text-slate-500 hover:text-brand-600 disabled:opacity-30"><ArrowDown size={16}/></button>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1 gap-1">
                  <h3 className={`${style.jobTitle} ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleExpBlur(idx, 'role', e)} onKeyDown={preventEnter}>{exp.role}</h3>
                  <span className="flex items-center gap-1 sm:text-right shrink-0">
                    <span className={`${style.date} ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleExpBlur(idx, 'startDate', e)} onKeyDown={preventEnter}>{exp.startDate}</span>
                    <span className={style.date}>-</span>
                    <span className={`${style.date} ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleExpBlur(idx, 'endDate', e)} onKeyDown={preventEnter}>{exp.endDate}</span>
                  </span>
                </div>
                <div className={`${style.company} ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleExpBlur(idx, 'company', e)} onKeyDown={preventEnter}>
                  {exp.company}
                </div>
                <ul className={`list-disc list-outside ml-4 text-sm space-y-1.5 ${template === 'tech' ? 'mt-3' : 'mt-2'}`}>
                  {exp.description.map((desc, dIdx) => {
                    const enhanceKey = `exp-${idx}-${dIdx}`;
                    return (
                      <li key={dIdx} className="leading-snug relative group/bullet pl-1">
                        {/* AI Rewrite Bullet Button */}
                        <div className="absolute -left-6 sm:-left-10 top-0 p-1 opacity-100 sm:opacity-0 group-hover/bullet:opacity-100 cursor-pointer no-print transition-all hover:scale-110 bg-brand-100 sm:bg-transparent rounded shadow-sm sm:shadow-none z-20" onClick={() => onAIEnhance && onAIEnhance('bullet', idx, dIdx, desc)} title="Rewrite bullet with AI">
                          {isEnhancing === enhanceKey ? <div className="w-3.5 h-3.5 mt-0.5 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></div> : <Sparkles size={14} className="text-brand-600 sm:text-brand-500 mt-0.5" />}
                        </div>
                        <span className={`${editableClass} block`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleExpDescBlur(idx, dIdx, e)}>
                          {desc}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Grid for Skills & Education */}
      <div className={`grid ${['minimal', 'academic', 'corporate'].includes(template) ? 'grid-cols-1 gap-6' : 'grid-cols-1 md:grid-cols-2 gap-8'}`}>
        
        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <section>
            <h2 className={style.sectionTitle}>Skills</h2>
            <div className={`${getSkillsContainerClass()} ${editableClass}`} 
                 contentEditable={true} 
                 suppressContentEditableWarning={true} 
                 onBlur={(e) => {
                    const text = e.currentTarget.innerText;
                    // Auto-split based on newline or pipe
                    const newSkills = text.split(/[\n|]+/).map(s => s.trim()).filter(Boolean);
                    if(onUpdate) onUpdate({...profile, skills: newSkills});
                 }}>
              {profile.skills.map((skill, idx) => (
                <span key={idx} className={`${style.skills} ${['professional', 'elegant', 'academic'].includes(template) && idx !== profile.skills.length - 1 ? 'mr-2' : ''}`}>
                  {skill}
                </span>
              ))}
            </div>
            <p className="text-[9px] text-slate-400 mt-2 opacity-100 sm:opacity-0 group-hover/cv:opacity-100 transition-opacity no-print">
              Edit skills directly (separate by new line or pipe |)
            </p>
          </section>
        )}

        {/* Education */}
        {profile.education && profile.education.length > 0 && (
          <section>
            <h2 className={style.sectionTitle}>Education</h2>
            <div className="space-y-4">
              {profile.education.map((edu, idx) => (
                <div 
                  key={idx} 
                  className={itemWrapperClass}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx, 'education')}
                  onDragOver={(e) => handleDragOver(e, idx, 'education')}
                  onDragEnd={handleDragEnd}
                  style={{ opacity: dragIndex === idx && dragType === 'education' ? 0.4 : 1 }}
                >
                  <div className="absolute -left-2 sm:-left-12 top-1 sm:top-2 flex flex-col sm:flex-row items-center opacity-100 sm:opacity-0 group-hover/item:opacity-100 transition-opacity no-print bg-white sm:bg-transparent shadow-sm sm:shadow-none rounded-md border border-slate-200 sm:border-transparent z-20 p-0.5">
                    <button onClick={() => handleMove(idx, 'up', 'education')} disabled={idx === 0} className="p-1 text-slate-500 hover:text-brand-600 disabled:opacity-30"><ArrowUp size={16}/></button>
                    <div className="p-1 text-slate-400 cursor-grab active:cursor-grabbing hover:text-brand-600 hidden sm:block"><GripVertical size={16} /></div>
                    <button onClick={() => handleMove(idx, 'down', 'education')} disabled={idx === profile.education.length - 1} className="p-1 text-slate-500 hover:text-brand-600 disabled:opacity-30"><ArrowDown size={16}/></button>
                  </div>
                  <h3 className={`${style.jobTitle} text-sm ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleEduBlur(idx, 'degree', e)} onKeyDown={preventEnter}>{edu.degree}</h3>
                  <div className={`text-sm ${template === 'minimal' ? 'text-gray-500' : 'text-slate-600 print:text-black'} ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleEduBlur(idx, 'institution', e)} onKeyDown={preventEnter}>{edu.institution}</div>
                  <div className={`text-xs mt-0.5 ${template === 'minimal' ? 'text-gray-400' : 'text-slate-500 print:text-black'} ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleEduBlur(idx, 'year', e)} onKeyDown={preventEnter}>{edu.year}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CVTemplate;