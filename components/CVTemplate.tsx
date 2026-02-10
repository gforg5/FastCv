import React from 'react';
import { ResumeProfile } from '../types';
import { Mail, Phone, MapPin } from 'lucide-react';

interface CVTemplateProps {
  profile: ResumeProfile;
  view?: 'resume' | 'cover-letter';
}

const CVTemplate: React.FC<CVTemplateProps> = ({ profile, view = 'resume' }) => {
  
  if (view === 'cover-letter' && profile.coverLetter) {
    return (
      <div className="bg-white shadow-xl max-w-[21cm] min-h-[29.7cm] mx-auto p-12 cv-page sm:rounded-lg text-slate-800 font-sans">
        {/* Header */}
        <header className="border-b-2 border-slate-800 pb-6 mb-8">
          <h1 className="text-4xl font-bold uppercase tracking-wider text-slate-900 mb-3">
            {profile.fullName || 'Your Name'}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            {profile.email && (
              <div className="flex items-center gap-1.5">
                <Mail size={14} />
                <span>{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-1.5">
                <Phone size={14} />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center gap-1.5">
                <MapPin size={14} />
                <span>{profile.location}</span>
              </div>
            )}
          </div>
        </header>

        {/* Cover Letter Body */}
        <div className="text-base leading-loose text-slate-700 whitespace-pre-wrap font-serif">
          {profile.coverLetter}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl max-w-[21cm] min-h-[29.7cm] mx-auto p-12 cv-page sm:rounded-lg text-slate-800 font-sans">
      {/* Header */}
      <header className="border-b-2 border-slate-800 pb-6 mb-6">
        <h1 className="text-4xl font-bold uppercase tracking-wider text-slate-900 mb-3">
          {profile.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          {profile.email && (
            <div className="flex items-center gap-1.5">
              <Mail size={14} />
              <span>{profile.email}</span>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={14} />
              <span>{profile.phone}</span>
            </div>
          )}
          {profile.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={14} />
              <span>{profile.location}</span>
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {profile.summary && (
        <section className="mb-6">
          <p className="text-sm leading-relaxed text-slate-700">
            {profile.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {profile.experience && profile.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-200 pb-1">
            Experience
          </h2>
          <div className="space-y-5">
            {profile.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-slate-800">{exp.role}</h3>
                  <span className="text-xs font-semibold text-slate-500 whitespace-nowrap ml-4">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <div className="text-sm font-medium text-brand-600 mb-2">
                  {exp.company}
                </div>
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                  {exp.description.map((desc, i) => (
                    <li key={i} className="leading-snug">
                      <span className="-ml-1">{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Grid for Skills & Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-200 pb-1">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {profile.education && profile.education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-200 pb-1">
              Education
            </h2>
            <div className="space-y-4">
              {profile.education.map((edu, idx) => (
                <div key={idx}>
                  <h3 className="font-bold text-slate-800 text-sm">{edu.degree}</h3>
                  <div className="text-sm text-slate-600">{edu.institution}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{edu.year}</div>
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
