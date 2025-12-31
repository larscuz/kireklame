
import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- Typer & Mock Data ---
type Segment = 'liten' | 'stor';

interface Company {
  id: string;
  name: string;
  segment: Segment;
  desc: string;
  city?: string;
  videoUrl?: string;
  thumbnail?: string;
  contact?: string;
  prodTime?: string;
  price?: string;
}

const MOCK_COMPANIES: Company[] = [
  { 
    id: '1', 
    name: 'Lokal KI-Pioner', 
    segment: 'liten', 
    desc: 'Bruker Gemini og Midjourney for å lage reklamefilmer for lokale bedrifter.', 
    city: 'Oslo', 
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    contact: 'hei@kipioner.no',
    prodTime: '3-5 dager',
    price: 'Fra 5 000,-'
  },
  { id: '2', name: 'Global Brand X', segment: 'stor', desc: 'Massiv KI-kampanje som rulles ut i 12 land med generativ video.', city: 'Internasjonal', videoUrl: 'https://www.w3schools.com/html/movie.mp4' },
  { 
    id: '3', 
    name: 'Studio Nord', 
    segment: 'liten', 
    desc: 'Spesialister på KI-genererte produktbilder for e-handel.', 
    city: 'Trondheim', 
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    contact: 'kontakt@studionord.no',
    prodTime: '2 dager',
    price: 'Fra 2 500,-'
  },
  { id: '4', name: 'Bilgiganten', segment: 'stor', desc: 'Bruker KI for å personalisere videoannonser for hver enkelt kunde.', city: 'Stuttgart', videoUrl: 'https://www.w3schools.com/html/movie.mp4' },
  { 
    id: '5', 
    name: 'Fjellfoto KI', 
    segment: 'liten', 
    desc: 'Skaper fantastiske landskapsreklamer med kun prompt-basert video.', 
    city: 'Bergen', 
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    contact: 'foto@fjellki.no',
    prodTime: '7 dager',
    price: 'Fra 12 000,-'
  },
];

// --- Hovedapplikasjon ---
const App: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);

  const handleAddCompany = (newComp: Company) => {
    setCompanies([...companies, newComp]);
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden selection:bg-blue-500/30">
      {/* Sidebar Navigasjon */}
      <nav className="w-20 lg:w-72 border-r border-white/5 flex flex-col p-6 bg-[#050505] z-50">
        <div className="mb-12 flex items-center gap-4 px-2">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
            <span className="text-black font-black text-xs">KI</span>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-xl font-black tracking-tighter uppercase">KI REKLAME</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold">Små er nå store</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <div className="space-y-2">
            <button
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 border bg-white/10 text-white border-white/20 shadow-xl"
            >
              <span className="text-xl">📁</span>
              <div className="hidden lg:block text-left">
                <p className="font-bold text-sm tracking-tight">Katalog</p>
                <p className="text-[10px] opacity-40 font-medium leading-none">KI Reklame Oversikt</p>
              </div>
            </button>
            
            <button
              onClick={() => setIsRegistering(true)}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 border border-white/5 hover:border-white/20 text-white/40 hover:text-white hover:bg-white/5 group"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">➕</span>
              <div className="hidden lg:block text-left">
                <p className="font-bold text-xs tracking-tight">Bli med</p>
                <p className="text-[9px] opacity-40 font-medium leading-none">Registrer bedrift</p>
              </div>
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5">
          <div className="glass-card p-4 rounded-2xl text-[10px] text-white/30 space-y-1">
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Status: Operativ
            </p>
            <p>© 2025 Kireklame.com</p>
          </div>
        </div>
      </nav>

      {/* Hovedinnhold */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="flex-1 overflow-hidden">
          <KatalogMode companies={companies} />
        </div>
      </main>

      {isRegistering && (
        <RegisterModal 
          onClose={() => setIsRegistering(false)} 
          onAdd={handleAddCompany}
        />
      )}
    </div>
  );
};

// --- VideoCard Component ---
const VideoCard: React.FC<{ company: Company; onOpen: (company: Company) => void }> = ({ company, onOpen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    videoRef.current?.pause();
    if (videoRef.current) videoRef.current.currentTime = 0;
  };

  return (
    <article 
      className="group glass-card rounded-[2rem] p-5 hover:bg-white/[0.05] transition-all border-white/5 hover:border-white/10 cursor-pointer mb-6 animate-in slide-in-from-bottom-4 duration-500"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(company)}
    >
      <div className="aspect-video rounded-2xl bg-zinc-900 border border-white/5 mb-5 overflow-hidden relative">
        {company.videoUrl ? (
          <video 
            ref={videoRef}
            src={company.videoUrl} 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
            muted 
            loop 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/10 text-4xl">🎬</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Klikk for info & fullskjerm</span>
        </div>
      </div>
      
      <h4 className="text-lg font-bold mb-1 tracking-tight group-hover:text-blue-400 transition-colors uppercase">{company.name}</h4>
      <div className="flex justify-between items-center mb-3">
        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{company.city || 'Digital'}</p>
        {company.price && <p className="text-[10px] text-green-400 font-black uppercase tracking-widest">{company.price}</p>}
      </div>
      <p className="text-xs text-white/50 leading-relaxed line-clamp-2 font-medium">{company.desc}</p>
    </article>
  );
};

// --- Modal Component ---
const VideoModal: React.FC<{ company: Company; onClose: () => void }> = ({ company, onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" />
      <div 
        className="relative w-full max-w-6xl glass-card rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex-1 bg-black aspect-video lg:aspect-auto">
          <video src={company.videoUrl} controls autoPlay className="w-full h-full object-contain" />
        </div>
        
        <div className="w-full lg:w-96 p-8 lg:p-12 border-l border-white/5 flex flex-col bg-[#050505]/50 backdrop-blur-xl">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
          >
            ✕
          </button>
          
          <div className="mb-8">
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${company.segment === 'liten' ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}>
              {company.segment === 'liten' ? 'Lokal Pioner' : 'Globalt Ikon'}
            </span>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none mb-2">{company.name}</h2>
            <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-bold">{company.city}</p>
          </div>

          <div className="space-y-6 flex-1">
            <p className="text-sm text-white/60 leading-relaxed">{company.desc}</p>
            
            {(company.prodTime || company.price || company.contact) && (
              <div className="grid grid-cols-1 gap-4 pt-6 border-t border-white/5">
                {company.prodTime && (
                  <div>
                    <h5 className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-1">Leveringstid</h5>
                    <p className="text-sm font-bold text-white/90">{company.prodTime}</p>
                  </div>
                )}
                {company.price && (
                  <div>
                    <h5 className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-1">Prisestimat</h5>
                    <p className="text-sm font-bold text-green-400">{company.price}</p>
                  </div>
                )}
                {company.contact && (
                  <div>
                    <h5 className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-1">Kontakt</h5>
                    <p className="text-sm font-bold text-blue-400 select-all">{company.contact}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <button className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform">
              Send Forespørsel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Registration Form Component ---
const RegisterModal: React.FC<{ onClose: () => void; onAdd: (c: Company) => void }> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    city: '',
    contact: '',
    videoUrl: '',
    prodTime: '',
    price: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      segment: 'liten'
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 lg:p-12 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />
      <div 
        className="relative w-full max-w-xl glass-card rounded-[2.5rem] p-8 lg:p-10 border border-white/10 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors">✕</button>
        
        <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tighter italic uppercase mb-2">Bli med i registeret</h2>
          <p className="text-sm text-white/40">Vis frem dine KI-tjenester til potensielle kunder.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black text-white/30 tracking-widest">Bedriftsnavn</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black text-white/30 tracking-widest">By</label>
              <input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30" />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black text-white/30 tracking-widest">Kort Beskrivelse</label>
            <textarea required value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 h-24 resize-none" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black text-white/30 tracking-widest">Video URL (mp4)</label>
            <input required type="url" value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30" placeholder="https://..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black text-white/30 tracking-widest">Leveringstid</label>
              <input value={formData.prodTime} onChange={e => setFormData({...formData, prodTime: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30" placeholder="f.eks. 3 dager" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black text-white/30 tracking-widest">Prisestimat</label>
              <input value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30" placeholder="Fra 5 000,-" />
            </div>
          </div>

          <div className="space-y-1 pb-4">
            <label className="text-[10px] uppercase font-black text-white/30 tracking-widest">Kontakt (E-post/Tlf)</label>
            <input required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30" />
          </div>

          <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
            Registrer Bedrift
          </button>
        </form>
      </div>
    </div>
  );
};

// --- KatalogMode Component ---
const KatalogMode: React.FC<{ companies: Company[] }> = ({ companies }) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const localCompanies = companies.filter(c => c.segment === 'liten');
  const globalCompanies = companies.filter(c => c.segment === 'stor');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="px-8 pt-12 pb-8 max-w-6xl mx-auto w-full flex-shrink-0">
        <h2 className="text-4xl lg:text-7xl font-black tracking-tighter leading-none italic mb-4 text-center lg:text-left">
          FREMTIDEN ER <span className="text-white/20 italic">VALGFRI</span>
        </h2>
        <p className="text-sm lg:text-lg text-white/40 max-w-2xl font-medium text-center lg:text-left mx-auto lg:mx-0">
          Vi skiller mellom lokale pionerer og globale ikoner. Velg en kolonne for å utforske hvordan KI endrer spillereglene.
        </p>
      </section>

      {/* Two-Column Layout (Responsive Stacking) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden border-t border-white/5 custom-scrollbar">
        {/* Left Column: Lokale Pionerer (Top on mobile) */}
        <section className="w-full lg:flex-1 h-auto lg:h-full lg:overflow-y-auto custom-scrollbar border-b lg:border-b-0 lg:border-r border-white/5 bg-[#050505] relative group/col">
          <div className="sticky top-0 z-10 p-6 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/30">Lokale Pionerer</h3>
            <span className="text-[10px] text-white/10 group-hover/col:text-blue-500/40 transition-colors uppercase font-bold tracking-widest hidden lg:block">Små Team</span>
          </div>
          <div className="p-6 lg:p-8 max-w-md mx-auto">
            {localCompanies.map(c => (
              <VideoCard key={c.id} company={c} onOpen={setSelectedCompany} />
            ))}
            <div className="h-10 lg:h-20" /> {/* Spacer */}
          </div>
        </section>

        {/* Right Column: Globale Ikoner (Bottom on mobile) */}
        <section className="w-full lg:flex-1 h-auto lg:h-full lg:overflow-y-auto custom-scrollbar bg-black relative group/col">
          <div className="sticky top-0 z-10 p-6 bg-black/95 backdrop-blur-md border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/30">Globale Ikoner</h3>
            <span className="text-[10px] text-white/10 group-hover/col:text-purple-500/40 transition-colors uppercase font-bold tracking-widest hidden lg:block">Brand Kampanjer</span>
          </div>
          <div className="p-6 lg:p-8 max-w-md mx-auto">
            {globalCompanies.map(c => (
              <VideoCard key={c.id} company={c} onOpen={setSelectedCompany} />
            ))}
            <div className="h-10 lg:h-20" /> {/* Spacer */}
          </div>
        </section>
      </div>

      {selectedCompany && <VideoModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />}
    </div>
  );
};

// --- Rendering ---
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
