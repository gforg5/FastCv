import React, { useState } from 'react';
import { ResumeProfile, Experience, Education } from '../types';
import { Mail, Phone, MapPin, Sparkles, GripVertical } from 'lucide-react';

export type TemplateType = 'modern' | 'professional' | 'minimal';

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

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number, type: 'experience' | 'education') => {
    setDragIndex(index);
    setDragType(type);
    e.dataTransfer.effectAllowed = 'move';
    // Visual drag image adjustments could go here
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
  const itemWrapperClass = "group/item relative transition-all rounded-lg -mx-4 px-4 py-2 hover:bg-slate-50/50";

  // Template Styles
  const templateStyles = {
    modern: {
      wrapper: "text-slate-800 font-sans",
      header: "border-b-2 border-slate-800 pb-6 mb-6",
      name: "text-4xl font-bold uppercase tracking-wider text-slate-900 mb-3",
      sectionTitle: "text-lg font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-200 pb-1",
      jobTitle: "font-bold text-slate-800",
      company: "text-sm font-medium text-brand-600 mb-2",
      date: "text-xs font-semibold text-slate-500",
      skills: "bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-200"
    },
    professional: {
      wrapper: "text-black font-serif",
      header: "border-b-2 border-black pb-4 mb-6 text-center",
      name: "text-4xl font-bold uppercase tracking-widest text-black mb-2",
      sectionTitle: "text-lg font-bold text-black uppercase tracking-widest mb-4 border-b border-black pb-1",
      jobTitle: "font-bold text-black",
      company: "text-sm font-bold text-gray-700 mb-2 italic",
      date: "text-xs font-bold text-gray-600",
      skills: "bg-transparent text-black text-sm font-semibold border-r border-black last:border-0 rounded-none px-2"
    },
    minimal: {
      wrapper: "text-gray-800 font-sans",
      header: "mb-8",
      name: "text-5xl font-light text-gray-900 mb-2",
      sectionTitle: "text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 mt-8",
      jobTitle: "font-medium text-gray-900 text-lg",
      company: "text-sm text-gray-500 mb-2",
      date: "text-xs text-gray-400",
      skills: "text-gray-600 text-sm"
    }
  };

  const style = templateStyles[template];

  if (view === 'cover-letter' && profile.coverLetter) {
    return (
      <div className={`bg-white shadow-xl max-w-[21cm] min-h-[29.7cm] mx-auto p-12 cv-page sm:rounded-lg ${style.wrapper}`}>
        <header className={style.header}>
          <h1 
            className={`${style.name} ${editableClass}`}
            contentEditable={true} 
            suppressContentEditableWarning={true}
            onBlur={(e) => handleBlur('fullName', e)}
          >
            {profile.fullName || 'Your Name'}
          </h1>
          <div className={`flex flex-wrap gap-4 text-sm ${template === 'professional' ? 'justify-center' : ''}`}>
             <div className={`flex items-center gap-1.5 ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleBlur('email', e)}>{profile.email}</div>
             <div className={`flex items-center gap-1.5 ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleBlur('phone', e)}>{profile.phone}</div>
             <div className={`flex items-center gap-1.5 ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleBlur('location', e)}>{profile.location}</div>
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

  return (
    <div className={`bg-white shadow-xl max-w-[21cm] min-h-[29.7cm] mx-auto p-12 cv-page sm:rounded-lg ${style.wrapper} relative group/cv`}>
      
      {/* Edit Hint */}
      <div className="absolute top-4 right-4 bg-brand-50 text-brand-600 text-xs font-bold px-3 py-1.5 rounded-full border border-brand-200 opacity-0 group-hover/cv:opacity-100 transition-opacity no-print shadow-sm flex items-center gap-1.5 pointer-events-none">
        <Sparkles size={12} /> Click anywhere to edit directly
      </div>

      {/* Header */}
      <header className={style.header}>
        <h1 
          className={`${style.name} ${editableClass}`}
          contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleBlur('fullName', e)}
        >
          {profile.fullName || 'Your Name'}
        </h1>
        <div className={`flex flex-wrap gap-4 text-sm ${template === 'professional' ? 'justify-center' : 'text-slate-600'}`}>
          <div className={`flex items-center gap-1.5 ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleBlur('email', e)}><Mail size={14} className="no-print" />{profile.email}</div>
          <div className={`flex items-center gap-1.5 ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleBlur('phone', e)}><Phone size={14} className="no-print" />{profile.phone}</div>
          <div className={`flex items-center gap-1.5 ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleBlur('location', e)}><MapPin size={14} className="no-print" />{profile.location}</div>
        </div>
      </header>

      {/* Summary */}
      {profile.summary && (
        <section className="mb-6 relative group/summary">
          <div className="absolute -left-10 top-0 p-2 opacity-0 group-hover/summary:opacity-100 cursor-pointer no-print transition-all hover:scale-110" onClick={() => onAIEnhance && onAIEnhance('summary', undefined, undefined, profile.summary)} title="Rewrite Summary with AI">
            {isEnhancing === 'summary' ? <div className="w-4 h-4 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></div> : <Sparkles size={16} className="text-brand-500" />}
          </div>
          <p 
            className={`text-sm leading-relaxed ${template === 'minimal' ? 'text-gray-600' : 'text-slate-700'} ${editableClass}`}
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
                {/* Drag Handle */}
                <div className="absolute -left-8 top-2 text-slate-300 opacity-0 group-hover/item:opacity-100 cursor-grab active:cursor-grabbing no-print hover:text-brand-500 transition-colors p-1">
                  <GripVertical size={18} />
                </div>

                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`${style.jobTitle} ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleExpBlur(idx, 'role', e)}>{exp.role}</h3>
                  <span className="flex items-center gap-1 text-right">
                    <span className={`${style.date} ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleExpBlur(idx, 'startDate', e)}>{exp.startDate}</span>
                    <span className={style.date}>-</span>
                    <span className={`${style.date} ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleExpBlur(idx, 'endDate', e)}>{exp.endDate}</span>
                  </span>
                </div>
                <div className={`${style.company} ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleExpBlur(idx, 'company', e)}>
                  {exp.company}
                </div>
                <ul className="list-disc list-outside ml-4 text-sm space-y-1.5 mt-2">
                  {exp.description.map((desc, dIdx) => {
                    const enhanceKey = `exp-${idx}-${dIdx}`;
                    return (
                      <li key={dIdx} className="leading-snug relative group/bullet pl-1">
                        {/* AI Rewrite Bullet Button */}
                        <div className="absolute -left-10 top-0 p-1 opacity-0 group-hover/bullet:opacity-100 cursor-pointer no-print transition-all hover:scale-110" onClick={() => onAIEnhance && onAIEnhance('bullet', idx, dIdx, desc)} title="Rewrite bullet with AI">
                          {isEnhancing === enhanceKey ? <div className="w-3.5 h-3.5 mt-0.5 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></div> : <Sparkles size={14} className="text-brand-500 mt-0.5" />}
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
      <div className={`grid ${template === 'minimal' ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-8'}`}>
        
        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <section>
            <h2 className={style.sectionTitle}>Skills</h2>
            <div className={`flex flex-wrap ${template === 'professional' ? 'gap-0' : 'gap-2'} ${editableClass}`} 
                 contentEditable={true} 
                 suppressContentEditableWarning={true} 
                 onBlur={(e) => {
                    const text = e.currentTarget.innerText;
                    const newSkills = text.split(template === 'professional' ? '|' : '\n').map(s => s.trim()).filter(Boolean);
                    if(onUpdate) onUpdate({...profile, skills: newSkills});
                 }}>
              {profile.skills.map((skill, idx) => (
                <span key={idx} className={`${style.skills} ${template === 'professional' && idx !== profile.skills.length - 1 ? 'mr-2' : ''}`}>
                  {skill}
                </span>
              ))}
            </div>
            <p className="text-[9px] text-slate-400 mt-2 opacity-0 group-hover/cv:opacity-100 transition-opacity no-print">
              Edit skills directly (separate by new line)
            </p>
          </section>
        )}

        {/* Education */}
        {profile.education && profile.education.length > 0 && (
          <section>
            <h2 className={style.sectionTitle}>Education</h2>
            <div className="space-y-3">
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
                  <div className="absolute -left-6 top-2 text-slate-300 opacity-0 group-hover/item:opacity-100 cursor-grab active:cursor-grabbing no-print hover:text-brand-500 transition-colors">
                    <GripVertical size={16} />
                  </div>
                  <h3 className={`${style.jobTitle} text-sm ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleEduBlur(idx, 'degree', e)}>{edu.degree}</h3>
                  <div className={`text-sm ${template === 'minimal' ? 'text-gray-500' : 'text-slate-600'} ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleEduBlur(idx, 'institution', e)}>{edu.institution}</div>
                  <div className={`text-xs mt-0.5 ${template === 'minimal' ? 'text-gray-400' : 'text-slate-500'} ${editableClass}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => handleEduBlur(idx, 'year', e)}>{edu.year}</div>
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
