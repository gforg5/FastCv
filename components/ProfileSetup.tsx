import React, { useState, useRef } from 'react';
import { parseRawProfile } from '../services/aiService';
import { ResumeProfile } from '../types';
import { Loader2, FileText, Upload, Sparkles, Wand2 } from 'lucide-react';

interface ProfileSetupProps {
  onProfileSaved: (profile: ResumeProfile) => void;
}

const EXAMPLE_SE = `Alex Mercer
alex.mercer@email.com
+1 (555) 123-4567
Seattle, WA

Summary:
Innovative Software Engineer with 5 years of experience designing and developing scalable web applications. Proficient in modern JavaScript frameworks and cloud infrastructure.

Skills:
JavaScript, TypeScript, React.js, Node.js, Python, AWS, Docker, GraphQL, MongoDB, PostgreSQL, CI/CD

Experience:
Senior Frontend Developer | TechNova Solutions
Jan 2021 - Present
- Spearheaded the migration of a legacy monolithic application to a React/Next.js micro-frontend architecture, improving page load speeds by 45%.
- Mentored a team of 4 junior developers and established comprehensive code review and testing standards.
- Integrated AI-driven features using OpenAI APIs, boosting user engagement by 30%.

Full Stack Developer | WebSphere Inc
Jun 2018 - Dec 2020
- Developed and maintained responsive e-commerce landing pages, driving a 20% increase in conversion rates.
- Built secure RESTful APIs in Node.js to handle payment processing for over 10,000 daily active users.
- Automated deployment pipelines using GitHub Actions, reducing deployment time by 50%.

Education:
B.S. in Computer Science
University of Washington, 2018`;

const EXAMPLE_MARKETING = `Sarah Jenkins
sarah.j.marketing@email.com
+1 (555) 987-6543
Austin, TX

Summary:
Results-driven Digital Marketing Specialist with over 4 years of experience executing data-backed campaigns that drive brand awareness and lead generation. 

Skills:
SEO/SEM, Content Marketing, Google Analytics, Facebook Ads, Email Marketing (Mailchimp), Copywriting, HubSpot CRM

Experience:
Digital Marketing Manager | GrowthPulse
Feb 2020 - Present
- Managed a monthly ad budget of $50k across Google and Meta, consistently achieving a 3x ROAS.
- Launched a comprehensive SEO strategy that increased organic blog traffic by 150% within 8 months.
- Designed and executed automated email drip campaigns that improved lead conversion by 25%.

Marketing Coordinator | BrightIdeas Agency
Jul 2018 - Jan 2020
- Assisted in the creation of social media content calendars across Instagram, LinkedIn, and Twitter, growing total followers by 40%.
- Coordinated with external influencers for product launch campaigns.
- Analyzed weekly campaign metrics and presented performance reports to stakeholders.

Education:
B.A. in Communications
University of Texas, 2018`;

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onProfileSaved }) => {
  const [rawText, setRawText] = useState('');
  const [loadingState, setLoadingState] = useState<'idle' | 'text' | 'file'>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExtractText = async () => {
    if (!rawText.trim()) {
      setError("Please paste some details first.");
      return;
    }

    setLoadingState('text');
    setError(null);

    try {
      const parsedProfile = await parseRawProfile({ text: rawText });
      onProfileSaved(parsedProfile);
    } catch (err: any) {
      setError(err.message || "Failed to parse details. Please try again.");
    } finally {
      setLoadingState('idle');
    }
  };

  // Helper to convert File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data:mime/type;base64, prefix required by Gemini inlineData
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Safety check: 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Please upload a file smaller than 10MB.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setLoadingState('file');
    setError(null);

    try {
      const base64Data = await fileToBase64(file);
      // Determine correct mimeType. Fallback to application/pdf if unknown.
      const mimeType = file.type || 'application/pdf';
      
      const parsedProfile = await parseRawProfile({ 
        file: { data: base64Data, mimeType } 
      });
      onProfileSaved(parsedProfile);
    } catch (err: any) {
      setError(err.message || "Failed to parse file. Ensure it's a readable PDF, Image, or Text file.");
    } finally {
      setLoadingState('idle');
      if (fileInputRef.current) fileInputRef.current.value = '';
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
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="application/pdf,image/png,image/jpeg,image/webp,text/plain" 
          className="hidden" 
        />

        <div className="text-center mb-6">
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={loadingState !== 'idle'}
            className="inline-flex flex-col items-center justify-center p-3 rounded-2xl bg-brand-50 text-brand-600 mb-4 shadow-inner border border-brand-100 transform hover:-translate-y-1 hover:shadow-md transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
            title="Upload PDF, Image, or Text file"
          >
            {loadingState === 'file' ? <Loader2 className="animate-spin" size={28} /> : <Upload size={28} className="group-hover:scale-110 transition-transform" />}
            <span className="text-[10px] font-bold uppercase tracking-wider mt-2 opacity-80 group-hover:opacity-100">Upload CV</span>
          </button>
          <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Setup Your Base Profile</h2>
          <p className="text-slate-500 font-medium">
            Upload your old CV file <strong className="text-slate-700">(PDF/Image)</strong> above, OR paste your details below. 
          </p>
        </div>

        {/* Example Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6 relative z-10">
          <span className="text-sm text-slate-400 font-bold self-center mr-2">Quick Try:</span>
          <button 
            onClick={() => setRawText(EXAMPLE_SE)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-600 text-xs font-bold transition-colors border border-slate-200"
          >
            <Wand2 size={12} /> Software Engineer
          </button>
          <button 
            onClick={() => setRawText(EXAMPLE_MARKETING)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-600 text-xs font-bold transition-colors border border-slate-200"
          >
            <Wand2 size={12} /> Marketing Specialist
          </button>
        </div>

        <div className="space-y-5 relative z-10">
          <textarea
            id="raw-profile-input"
            className="w-full h-72 p-5 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-y font-mono text-sm shadow-inner leading-relaxed"
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
            onClick={handleExtractText}
            disabled={loadingState !== 'idle'}
            className="w-full py-4 px-6 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loadingState === 'text' ? (
              <>
                <Loader2 className="animate-spin" size={22} />
                Analyzing Text Details...
              </>
            ) : loadingState === 'file' ? (
              <>
                <Loader2 className="animate-spin" size={22} />
                Extracting from File...
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