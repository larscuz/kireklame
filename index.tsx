
import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

// --- Typer ---
type View = 'pro' | 'student' | 'education';

interface Company {
  id: string;
  name: string;
  desc: string;
  city: string;
  videoUrl?: string;
  website?: string;
  contact?: string;
  type: 'pro' | 'student' | 'education';
}

const CONTACT_EMAIL = "x@larscuzner.com";

// --- Mock Data ---
const generateCompanies = (): Company[] => {
  const proData: Partial<Company>[] = [
    { name: 'Oslo Kreativ AI', city: 'Oslo', website: 'https://oslokreativ.ai', desc: 'Fagmiljø og initiativtaker til Gullhaien. Et kraftsentrum for utforskning av KI i den kreative bransjen.' },
    { name: 'DDB Nord', city: 'Oslo', website: 'https://ddbnord.no', desc: 'Byråprofil med tung KI-kompetanse, representert i juryen for Norges første KI-reklamepris.' },
    { name: 'AVIA', city: 'Oslo', website: 'https://avia.no', desc: 'Produksjonsbyrå og fagmiljø for kreative vurderinger, med spesialisering på KI-drevet videoinnhold.' },
    { name: 'Smør Studio', city: 'Oslo', website: 'https://smor.no', desc: 'Et kreativt teknologistudio med fokus på krysningen mellom design, teknologi og kunstig intelligens.' },
    { name: 'AIAIAI', city: 'Oslo', website: 'https://aiaiai.as', videoUrl: 'https://www.youtube.com/embed/eXbsh7OQWWA', desc: 'Fra idé til ferdig produksjon på sekunder. AIAIAI leverer neste generasjons AI-innhold.' },
    { name: 'Good Morning Naug', city: 'Oslo', website: 'https://www.goodmorning.no', videoUrl: 'https://www.youtube.com/embed/4puf5Kvgh9Q', desc: 'Prisvinnende kreativt byrå som kombinerer strategi, design og teknologi.' },
    { name: 'Synlighet', city: 'Bergen', website: 'https://synlighet.no', videoUrl: 'https://www.youtube.com/embed/F6mN_D0Z1oQ', desc: 'Et av Norges ledende performance marketing-miljøer med tung AI-satsing.' },
    { name: 'Well Told', city: 'Oslo', website: 'https://www.welltold.no', desc: 'Spesialister på historiefortelling og digitalt innhold.' },
    { name: 'INEVO', city: 'Oslo', website: 'https://inevo.no', videoUrl: 'https://www.youtube.com/embed/videoseries?list=UUccl-H9_W_W6H_p3W3z0L3g', desc: 'Operativt markedsføringsbyrå med fokus på vekst og målbare resultater.' },
    { name: 'UXAR', city: 'Østlandet', website: 'https://uxar.ai', desc: 'Fremtidens reklame med AI, XR og Augmented Reality.' },
    { name: 'Riktig Spor', city: 'Bodø', website: 'https://riktigspr.no', desc: 'Strategi, design og innhold i Nord-Norge.' },
    { name: 'Webfabrikk', city: 'Billingstad', website: 'https://webfabrikk.com', videoUrl: 'https://www.youtube.com/embed/kx8oZIPlWb4', desc: 'AI-drevet markedsføring som automatiserer og optimaliserer.' },
  ];

  const studentData: Partial<Company>[] = [
    { name: 'FutureFlow UB', city: 'Oslo', desc: 'Ungdomsbedrift som spesialiserer seg på AI-generert innhold for sosiale medier.' },
    { name: 'PixelAI SB', city: 'Trondheim', desc: 'Studentbedrift fra NTNU som utforsker grensene for generativ video.' },
    { name: 'NovaVision UB', city: 'Bergen', desc: 'Kreativt team som bruker KI for å hjelpe lokale bedrifter med rimelig annonsering.' },
    { name: 'DeepBlue SB', city: 'Stavanger', desc: 'Fremtidens markedsførere med fokus på AI-optimalisering.' },
    { name: 'Vekst UB', city: 'Tromsø', desc: 'Lokal ungdomskraft som leverer visuelle konsepter drevet av Midjourney og Runway.' },
  ];

  const educationData: Partial<Company>[] = [
    { name: 'AIAIAI Bedrift', city: 'Oslo', website: 'https://aiaiai.as/bedrift/', desc: 'Skreddersydde bedriftskurs og workshops i generativ KI. Lær å produsere innhold effektivt med markedets råeste verktøy.' },
    { name: 'Intelligenspartiet', city: 'Oslo', website: 'https://intelligenspartiet.no', desc: 'Foredrag og debatt om kunstig intelligens. Fokus på samfunnsendring, etikk og fremtidens kreative landskap.' },
    { name: 'Umedia', city: 'Oslo', website: 'https://umedia.no', desc: 'Eksperter på kursing og opplæring i KI-verktøy for mediehus, markedsførere og innholdsprodusenter.' },
    { name: 'Cuz Media', city: 'Oslo', website: 'https://cuzmedia.no', desc: 'Strategiske workshops og foredrag om implementering av KI i kreative prosesser og forretningsutvikling.' },
    { name: 'AI Kurs Norge', city: 'Oslo', desc: 'Spesialtilpassede workshops for bedrifter som ønsker å implementere generativ KI i hverdagen.' },
    { name: 'KI-Pedagogene', city: 'Trondheim', desc: 'Foredragsholdere med fokus på etikk, brukervennlighet og praktisk mestring av KI-verktøy.' },
    { name: 'Fremtidens Foredrag', city: 'Bergen', desc: 'Inspirerende keynote-taler om hvordan AI endrer arbeidslivet og kreativitet.' },
    { name: 'Prompt Studio', city: 'Stavanger', desc: 'Dypdykk i prompt engineering og visuell innholdsproduksjon for markedsavdelinger.' },
    { name: 'Nordisk AI-Akademi', city: 'Oslo', desc: 'Sertifiseringskurs og omfattende opplæringsprogrammer for ledere og kreative.' },
  ];

  const all: Company[] = [];
  proData.forEach((d, i) => all.push({ 
    id: `pro-${i}`, name: d.name!, city: d.city!, desc: d.desc!, videoUrl: d.videoUrl, website: d.website, type: 'pro' 
  }));
  studentData.forEach((d, i) => all.push({ 
    id: `stu-${i}`, name: d.name!, city: d.city!, desc: d.desc!, videoUrl: d.videoUrl, website: d.website, type: 'student' 
  }));
  educationData.forEach((d, i) => all.push({ 
    id: `edu-${i}`, name: d.name!, city: d.city!, desc: d.desc!, videoUrl: d.videoUrl, website: d.website, type: 'education' 
  }));

  return all;
};

const ALL_COMPANIES = generateCompanies();

// --- MediaDisplay ---
const MediaDisplay: React.FC<{ url?: string; autoPlay?: boolean; muted?: boolean }> = ({ url, autoPlay = false, muted = true }) => {
  if (!url) return null;
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  if (isYouTube) {
    const embedUrl = url.includes('embed') ? url : url.replace('watch?v=', 'embed/').split('&')[0];
    return <iframe src={`${embedUrl}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&controls=0&loop=1`} className="w-full h-full border-none pointer-events-none" allow="autoplay; encrypted-media" />;
  }
  return <video src={url} className="w-full h-full object-cover" autoPlay={autoPlay} muted={muted} loop playsInline />;
};

// --- App ---
const App: React.FC = () => {
  const [view, setView] = useState<View>('pro');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const sidebarItemClass = (active: boolean, activeColor: string = 'blue') => {
    const colorClasses = {
      blue: active ? 'border-blue-500/50 bg-blue-500/10 text-white shadow-xl shadow-blue-500/5' : 'border-white/5 text-white/40 hover:text-white hover:bg-white/5',
      emerald: active ? 'border-emerald-500/50 bg-emerald-500/10 text-white shadow-xl shadow-emerald-500/5' : 'border-white/5 text-white/40 hover:text-white hover:bg-white/5',
      purple: active ? 'border-purple-500/50 bg-purple-500/10 text-white shadow-xl shadow-purple-500/5' : 'border-white/5 text-white/40 hover:text-white hover:bg-white/5',
    };
    return `w-full flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all duration-300 ${colorClasses[activeColor as keyof typeof colorClasses]}`;
  };

  const changeView = (v: View) => {
    setView(v);
    const mainElement = document.getElementById('main-content');
    if (mainElement) mainElement.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-white overflow-hidden selection:bg-blue-500/30">
      <nav className="w-24 lg:w-80 border-r border-white/5 flex flex-col bg-[#252525] z-50 shrink-0 shadow-2xl">
        <div className="p-6">
          <div className="mb-12 flex items-center gap-4 px-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(21,129,197,0.3)] cursor-pointer overflow-hidden border border-white/10" onClick={() => changeView('pro')}>
              <img src="logo.svg" alt="Ki.NO" className="w-full h-full object-contain" />
            </div>
            <div className="hidden lg:block cursor-pointer" onClick={() => changeView('pro')}>
              <h1 className="text-xl font-black tracking-tighter uppercase leading-none italic">NORSK KI-REKLAME</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mt-1">Norge / AI Directory</p>
            </div>
          </div>

          <div className="space-y-4">
            <button onClick={() => changeView('pro')} className={sidebarItemClass(view === 'pro', 'blue')}>
              <span className="text-xl">💼</span>
              <div className="hidden lg:block text-left">
                <p className="font-bold text-sm tracking-tight">Etablerte Byråer</p>
                <p className="text-[10px] opacity-40 font-medium">Profesjonelle aktører</p>
              </div>
            </button>

            <button onClick={() => changeView('student')} className={sidebarItemClass(view === 'student', 'emerald')}>
              <span className="text-xl">🎓</span>
              <div className="hidden lg:block text-left">
                <p className="font-bold text-sm tracking-tight">Ungdom & Student</p>
                <p className="text-[10px] opacity-40 font-medium">Rimelige UB/SB-valg</p>
              </div>
            </button>

            <button onClick={() => changeView('education')} className={sidebarItemClass(view === 'education', 'purple')}>
              <span className="text-xl">🎙️</span>
              <div className="hidden lg:block text-left">
                <p className="font-bold text-sm tracking-tight">Foredrag & Kurs</p>
                <p className="text-[10px] opacity-40 font-medium">Workshops & Læring</p>
              </div>
            </button>
            
            <div className="pt-4 border-t border-white/5">
              <a href={`mailto:${CONTACT_EMAIL}?subject=Send inn bedrift`} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl border border-white/5 hover:border-white/20 text-white/40 hover:text-white transition-all group">
                <span className="text-lg group-hover:scale-110 transition-transform">➕</span>
                <div className="hidden lg:block text-left">
                  <p className="font-bold text-xs tracking-tight">Send inn din bedrift</p>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        <div className="flex-1" />
        <div className="p-6 border-t border-white/5">
          <div className="p-4 rounded-2xl bg-white/[0.03] text-[10px] text-white/30 space-y-2">
             <p className="flex items-center gap-2 font-bold text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Drevet av Cuz Media AS
            </p>
            <p className="opacity-50">© 2025 Norsk KI-Reklame</p>
          </div>
        </div>
      </nav>

      <main id="main-content" className="flex-1 relative overflow-y-auto overflow-x-hidden bg-[#1e1e1e] custom-scrollbar">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <KatalogMode 
            type={view} 
            companies={ALL_COMPANIES} 
            setSelectedCompany={setSelectedCompany} 
          />
        </div>
      </main>

      {selectedCompany && <VideoModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />}
    </div>
  );
};

// --- KatalogModuler ---
const VideoCard: React.FC<{ company: Company; onOpen: (c: Company) => void }> = ({ company, onOpen }) => {
  const hasVideo = !!(company.videoUrl && company.videoUrl.trim() !== '');
  
  const getAccentColor = () => {
    if (company.type === 'student') return 'emerald';
    if (company.type === 'education') return 'purple';
    return 'blue';
  };

  const accent = getAccentColor();
  const accentBorder = accent === 'emerald' ? 'hover:border-emerald-500/30' : accent === 'purple' ? 'hover:border-purple-500/30' : 'hover:border-blue-500/30';
  const accentText = accent === 'emerald' ? 'group-hover:text-emerald-400' : accent === 'purple' ? 'group-hover:text-purple-400' : 'group-hover:text-blue-400';

  return (
    <article 
      className={`group glass-card rounded-[2.5rem] p-6 bg-[#2d2d2d]/40 hover:bg-[#2d2d2d]/80 transition-all border-white/5 ${accentBorder} cursor-pointer mb-8 animate-in slide-in-from-bottom-4 relative overflow-hidden ${!hasVideo ? 'opacity-80' : ''}`} 
      onClick={() => onOpen(company)}
    >
      <div className="aspect-video rounded-3xl bg-[#181818] border border-white/5 mb-6 overflow-hidden relative group-hover:shadow-[0_0_40px_rgba(100,100,100,0.1)] transition-all">
        {hasVideo ? (
          <MediaDisplay url={company.videoUrl} autoPlay={false} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/[0.03] font-black text-3xl uppercase tracking-tighter text-center px-4">
            {company.name}
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
           <span className="bg-black/60 backdrop-blur-md text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-white/10">{company.city}</span>
        </div>
      </div>
      <div className="flex justify-between items-start gap-2 mb-2">
        <h4 className={`text-xl font-black uppercase ${accentText} truncate tracking-tighter italic transition-colors`}>{company.name}</h4>
        {company.type === 'student' && <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-black px-2 py-1 rounded-md uppercase border border-emerald-500/20">Studentbedrift</span>}
        {company.type === 'education' && <span className="bg-purple-500/10 text-purple-400 text-[8px] font-black px-2 py-1 rounded-md uppercase border border-purple-500/20">Utdanning</span>}
      </div>
      <p className="text-xs text-white/40 line-clamp-2 leading-relaxed h-10">{company.desc}</p>
    </article>
  );
};

const KatalogMode: React.FC<{ type: View, companies: Company[]; setSelectedCompany: (c: Company) => void }> = ({ type, companies, setSelectedCompany }) => {
  const [selectedCity, setSelectedCity] = useState<string>('Alle');

  const filteredBase = companies.filter(c => c.type === type);
  const cities = useMemo(() => {
    const set = new Set(filteredBase.map(c => c.city));
    return ['Alle', ...Array.from(set).sort()];
  }, [filteredBase]);

  const filtered = useMemo(() => {
    const list = selectedCity === 'Alle' ? filteredBase : filteredBase.filter(c => c.city === selectedCity);
    return list.sort((a, b) => {
      const hasA = !!a.videoUrl;
      const hasB = !!b.videoUrl;
      if (hasA && !hasB) return -1;
      if (!hasA && hasB) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [filteredBase, selectedCity]);

  const leftCol = filtered.filter((_, i) => i % 2 === 0);
  const rightCol = filtered.filter((_, i) => i % 2 !== 0);

  const getHeaderInfo = () => {
    switch(type) {
      case 'student':
        return {
          title: "KI-STUDENT",
          subtitle: "Ungdomsbedrifter (UB) og Studentbedrifter (SB) opererer under opplæringsloven. Dette betyr at de kan tilby kreative AI-tjenester til en brøkdel av prisen.",
          accent: "emerald",
          badge: "UB/SB Fordelen",
          badgeDesc: "Perfekt for gründere og små bedrifter som trenger toppmoderne KI-innhold på et stramt budsjett."
        };
      case 'education':
        return {
          title: "KI-LÆRING",
          subtitle: "Lær å mestre fremtidens verktøy. Her finner du kursholdere, foredragsholdere og pedagoger som hjelper din bedrift med å forstå og bruke AI effektivt.",
          accent: "purple",
          badge: "Ekspertise & Innsikt",
          badgeDesc: "Fra inspirerende keynotes til praktiske workshops. Finn de som kan lære bort kunsten å samarbeide med KI."
        };
      default:
        return {
          title: "KI-REKLAME",
          subtitle: "NORSKE kreative bedrifter som bruker AI",
          accent: "blue",
          badge: null,
          badgeDesc: null
        };
    }
  };

  const header = getHeaderInfo();
  const accentBorder = header.accent === 'emerald' ? 'border-emerald-500' : header.accent === 'purple' ? 'border-purple-500' : 'border-blue-500';

  return (
    <div className="w-full">
      <header className="px-10 lg:px-16 pt-20 pb-12 relative overflow-hidden bg-[#2d2d2d]/20">
        <h2 className="text-5xl lg:text-8xl font-black tracking-tighter italic mb-6 relative z-10 leading-none">NORSK <br/><span className="text-white/10">{header.title}</span></h2>
        
        <div className="grid lg:grid-cols-2 gap-10 mb-10 relative z-10">
          <p className={`text-sm lg:text-xl text-white/30 font-medium leading-relaxed italic border-l-2 ${accentBorder} pl-6 uppercase tracking-tight`}>
            {header.subtitle}
          </p>
          {header.badge && (
            <div className={`p-6 rounded-3xl bg-${header.accent}-500/5 border border-${header.accent}-500/10`}>
              <p className={`text-xs text-${header.accent}-200/40 uppercase font-black tracking-widest mb-2`}>{header.badge}</p>
              <p className={`text-sm text-${header.accent}-100/60 leading-relaxed`}>{header.badgeDesc}</p>
            </div>
          )}
        </div>
        
        <div className="relative z-10 max-w-xs mt-4">
          <label htmlFor="city-select" className="text-[10px] uppercase font-black tracking-[0.2em] text-white/20 mb-2 block">Filtrer etter by</label>
          <div className="relative">
            <select
              id="city-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest px-6 py-4 rounded-2xl appearance-none cursor-pointer hover:bg-white/10 transition-all focus:outline-none focus:border-blue-500/50"
            >
              {cities.map(city => (
                <option key={city} value={city} className="bg-[#333] text-white">{city}</option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-white/5 bg-[#1e1e1e] min-h-screen">
        <div className="p-8 lg:p-12 lg:border-r border-white/5">
           <div className="max-w-xl mx-auto">{leftCol.map(c => <VideoCard key={c.id} company={c} onOpen={setSelectedCompany} />)}</div>
        </div>
        <div className="p-8 lg:p-12">
           <div className="max-w-xl mx-auto">{rightCol.map(c => <VideoCard key={c.id} company={c} onOpen={setSelectedCompany} />)}</div>
        </div>
      </div>
    </div>
  );
};

// --- Modal ---
const VideoModal: React.FC<{ company: Company; onClose: () => void }> = ({ company, onClose }) => {
  const getBadgeColors = () => {
    if (company.type === 'student') return 'bg-emerald-500 text-black';
    if (company.type === 'education') return 'bg-purple-600 text-white';
    return 'bg-blue-600 text-white';
  };

  const getLabel = () => {
    if (company.type === 'student') return 'UB / SB';
    if (company.type === 'education') return 'UTDANNING';
    return 'PRO BYRÅ';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div className="absolute inset-0 bg-[#1e1e1ec0] backdrop-blur-3xl" />
      <div className="relative w-full max-w-6xl bg-[#252525] border border-white/10 rounded-[4rem] overflow-hidden flex flex-col lg:flex-row shadow-[0_0_120px_rgba(0,0,0,0.5)]" onClick={e => e.stopPropagation()}>
        <div className="flex-1 bg-black flex items-center justify-center min-h-[450px]">
          {company.videoUrl ? (
             <MediaDisplay url={company.videoUrl} autoPlay={true} muted={false} />
          ) : (
            <div className="text-white/[0.03] font-black text-6xl italic uppercase">{company.name}</div>
          )}
        </div>
        <div className="w-full lg:w-[500px] p-16 border-l border-white/5 bg-[#252525] flex flex-col relative">
          <button onClick={onClose} className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/5 text-xl">✕</button>
          
          <div className="mb-12 pt-4">
            <span className={`inline-block px-3 py-1 rounded-md text-[9px] font-black uppercase mb-4 tracking-widest ${getBadgeColors()}`}>
              {getLabel()}
            </span>
            <h2 className="text-5xl font-black uppercase italic mb-2 tracking-tighter leading-none">{company.name}</h2>
            <p className="text-xs text-white/40 font-bold uppercase tracking-[0.3em]">{company.city}</p>
          </div>

          <div className="space-y-10 flex-1">
            <div>
              <h5 className="text-[10px] uppercase font-black text-white/20 mb-4 tracking-[0.2em]">Om {company.type === 'education' ? 'tjenesten' : 'selskapet'}</h5>
              <p className="text-lg text-white/70 leading-relaxed font-medium italic">{company.desc}</p>
            </div>
            
            {company.type === 'student' && (
              <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Prismodell</p>
                <p className="text-xs text-emerald-200/50">Studentbedrifter kan ofte levere tjenester til en vesentlig lavere pris som del av sitt utdanningsløp.</p>
              </div>
            )}

            {company.type === 'education' && (
              <div className="p-6 rounded-3xl bg-purple-500/5 border border-purple-500/10">
                <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1">Faglig Utvikling</p>
                <p className="text-xs text-purple-200/50">Disse aktørene tilbyr alt fra korte lunsj-foredrag til dypgående workshops over flere dager.</p>
              </div>
            )}

            <div>
              <h5 className="text-[10px] uppercase font-black text-white/20 mb-1 tracking-[0.2em]">Kontakt</h5>
              <p className="text-md font-bold text-white opacity-80">{CONTACT_EMAIL}</p>
            </div>
          </div>

          <div className="mt-16 space-y-4">
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95 shadow-xl">
                {company.type === 'education' ? 'Se Kursinfo' : 'Besøk Portefølje'}
              </a>
            )}
            <a href={`mailto:${CONTACT_EMAIL}?subject=Forespørsel til ${company.name}`} className="w-full py-6 bg-white/5 border border-white/10 text-white rounded-3xl font-black uppercase text-xs hover:bg-white/10 transition-all text-center block">
              Kontakt {company.type === 'education' ? 'Aktør' : 'Bedrift'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) { createRoot(container).render(<App />); }
