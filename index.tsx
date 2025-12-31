
import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// --- Typer ---
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
  website?: string;
  land?: string;
  kategori?: string;
  tilbyr_AI?: boolean;
  AI_tjenester?: string[];
  kilde?: string;
}

// MANUELL REDIGERING: Endre disse objektene for å legge til ekte innhold
const MOCK_COMPANIES: Company[] = [
  // SMÅ BEDRIFTER
  { 
    id: '1', 
    name: 'Lokal KI-Pioner', 
    segment: 'liten', 
    desc: 'Spesialister på å bruke Gemini og Midjourney for å lage rimelige reklamefilmer for lokale butikker og restauranter.', 
    city: 'Oslo', 
    land: 'Norge',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    contact: 'hei@kipioner.no',
    kategori: 'byrå',
    tilbyr_AI: true,
    AI_tjenester: ['AI-video', 'AI-bilde', 'Prompt Engineering']
  },
  { 
    id: '3', 
    name: 'Bergen Pixels', 
    segment: 'liten', 
    desc: 'Et lite kreativt kollektiv som transformerer statiske bilder til dynamiske videoannonser ved hjelp av Runway Gen-3.', 
    city: 'Bergen', 
    land: 'Norge',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    contact: 'kontakt@bergenpixels.no',
    tilbyr_AI: true,
    AI_tjenester: ['Animasjon', 'Generativ Design']
  },
  { 
    id: '4', 
    name: 'SynthVoice Nord', 
    segment: 'liten', 
    desc: 'Fokuserer på norske AI-stemmer og dubbing av reklameinnhold for det skandinaviske markedet.', 
    city: 'Tromsø', 
    land: 'Norge',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    contact: 'info@synthvoice.no',
    tilbyr_AI: true,
    AI_tjenester: ['Audio AI', 'Dubbing']
  },
  { 
    id: '5', 
    name: 'Prompt Master AS', 
    segment: 'liten', 
    desc: 'Hjelper småbedrifter med å sette opp automatiserte innholdsløp for sosiale medier.', 
    city: 'Stavanger', 
    land: 'Norge',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    contact: 'post@promptmaster.no',
    tilbyr_AI: true,
    AI_tjenester: ['Innholdsproduksjon', 'KI-Rådgivning']
  },

  // STORE BYRÅER
  { 
    id: '2', 
    name: 'Sora Studios Global', 
    segment: 'stor', 
    desc: 'Verdensledende på storskala generativ video. Leverer hyper-realistiske kampanjer for Fortune 500 selskaper.', 
    city: 'San Francisco', 
    land: 'USA',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    kategori: 'plattform',
    tilbyr_AI: true,
    AI_tjenester: ['Tekst-til-video', 'Enterprise KI']
  },
  { 
    id: '6', 
    name: 'WPP AI Command', 
    segment: 'stor', 
    desc: 'Den globale gigantens dedikerte KI-divisjon som integrerer Nvidia-teknologi i alle ledd av reklameproduksjonen.', 
    city: 'London', 
    land: 'UK',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    contact: 'ai@wpp.com',
    tilbyr_AI: true,
    AI_tjenester: ['Fullstack Annonsering', 'Data Analyse']
  },
  { 
    id: '7', 
    name: 'Synthesia Enterprise', 
    segment: 'stor', 
    desc: 'Markedsleder innen AI-avatarer for profesjonell bedriftskommunikasjon og global markedsføring.', 
    city: 'London', 
    land: 'UK',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    website: 'https://synthesia.io',
    tilbyr_AI: true,
    AI_tjenester: ['Video Avatarene', 'Multispråklig Video']
  },
  { 
    id: '8', 
    name: 'Publicis Groupe AI', 
    segment: 'stor', 
    desc: 'Bruker sin egen CoreAI-plattform for å personalisere reklame i sanntid for millioner av brukere.', 
    city: 'Paris', 
    land: 'Frankrike',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    contact: 'contact@publicis.com',
    tilbyr_AI: true,
    AI_tjenester: ['Sanntids Personalisering', 'Media Kjøp']
  },
];

// --- Hovedapplikasjon ---
const App: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [internetResults, setInternetResults] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleAddCompany = (newComp: Company) => {
    setCompanies(prev => {
      if (prev.some(c => c.name.toLowerCase() === newComp.name.toLowerCase())) return prev;
      return [...prev, newComp];
    });
  };

  const updateFromInternet = async () => {
    setIsUpdating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: "Søk på internett etter faktiske norske og internasjonale bedrifter, byråer og frilansere som lager reklame ved hjelp av KI/AI (video, bilde, tekst). Finn navn, by, land, kategori, beskrivelse, nettsted og hvilke AI-tjenester de tilbyr. Finn også direktelenker til mp4-videoer eller logoer hvis de eksisterer.",
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                navn: { type: Type.STRING },
                nettsted: { type: Type.STRING },
                kontakt: { type: Type.STRING },
                beskrivelse: { type: Type.STRING },
                tilbyr_AI: { type: Type.BOOLEAN },
                AI_tjenester: { type: Type.ARRAY, items: { type: Type.STRING } },
                by: { type: Type.STRING },
                land: { type: Type.STRING },
                kategori: { type: Type.STRING },
                videoUrl: { type: Type.STRING },
                logo: { type: Type.STRING }
              }
            }
          }
        }
      });

      const rawData = JSON.parse(response.text || '[]');
      const formatted: Company[] = rawData.map((item: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: item.navn,
        desc: item.beskrivelse,
        website: item.nettsted,
        contact: item.kontakt,
        city: item.by,
        land: item.land,
        kategori: item.kategori,
        tilbyr_AI: item.tilbyr_AI,
        AI_tjenester: item.AI_tjenester,
        videoUrl: item.videoUrl || item.logo,
        segment: (item.kategori === 'plattform' || item.land !== 'Norge') ? 'stor' : 'liten'
      }));

      setInternetResults(formatted);
    } catch (err) {
      console.error("Feil ved internett-oppdatering:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden selection:bg-blue-500/30">
      {/* Sidepanel */}
      <nav className="w-24 lg:w-80 border-r border-white/5 flex flex-col bg-[#050505] z-50">
        <div className="p-6">
          <div className="mb-12 flex items-center gap-4 px-2">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <span className="text-black font-black text-xs">KI</span>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-xl font-black tracking-tighter uppercase leading-none">KI REKLAME</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mt-1">Små er nå store</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 border bg-white/10 text-white border-white/20 shadow-xl">
              <span className="text-xl">📁</span>
              <div className="hidden lg:block text-left">
                <p className="font-bold text-sm tracking-tight">Katalog</p>
                <p className="text-[10px] opacity-40 font-medium leading-none">Full oversikt</p>
              </div>
            </button>
            
            <button onClick={() => setIsRegistering(true)} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 border border-white/5 hover:border-white/20 text-white/40 hover:text-white hover:bg-white/5 group">
              <span className="text-lg group-hover:scale-110 transition-transform">➕</span>
              <div className="hidden lg:block text-left">
                <p className="font-bold text-xs tracking-tight">Legg til</p>
                <p className="text-[9px] opacity-40 font-medium leading-none">Manuell registrering</p>
              </div>
            </button>
          </div>
        </div>

        {/* Internett-resultater område i sidepanelet */}
        <div className="flex-1 flex flex-col border-t border-white/5 bg-black/20 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Funn på nettet</h3>
            {isUpdating && <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
            {internetResults.length > 0 ? (
              internetResults.map(res => (
                <div 
                  key={res.id} 
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group relative cursor-pointer"
                  onClick={() => setSelectedCompany(res)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-bold truncate pr-4 uppercase">{res.name}</h4>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAddCompany(res); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-[8px] font-black uppercase px-2 py-0.5 rounded text-white"
                    >
                      Legg til
                    </button>
                  </div>
                  <p className="text-[9px] text-white/40 line-clamp-1">{res.desc}</p>
                  <p className="text-[8px] text-blue-500/60 mt-2 font-bold uppercase tracking-widest">{res.city}, {res.land}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <p className="text-[10px] text-white/10 uppercase font-black tracking-widest leading-relaxed">Søk etter nye bedrifter<br/>fra hele verden</p>
                {!isUpdating && (
                  <button 
                    onClick={updateFromInternet} 
                    className="mt-4 text-[9px] font-black uppercase text-blue-400 hover:text-white transition-colors border border-blue-400/20 px-3 py-1.5 rounded-lg"
                  >
                    Start AI-søk
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-white/5 bg-[#050505]">
          <div className="glass-card p-4 rounded-2xl text-[10px] text-white/30 space-y-1">
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live Register
            </p>
            <p>© 2025 Kireklame.com</p>
          </div>
        </div>
      </nav>

      {/* Hovedvisning */}
      <main className="flex-1 relative overflow-hidden flex flex-col h-full">
        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="flex-1 overflow-hidden">
          <KatalogMode 
            companies={companies} 
            setSelectedCompany={setSelectedCompany}
          />
        </div>
      </main>

      {isRegistering && <RegisterModal onClose={() => setIsRegistering(false)} onAdd={handleAddCompany} />}
      {selectedCompany && (
        <VideoModal 
          company={selectedCompany} 
          onClose={() => setSelectedCompany(null)} 
          onAdd={() => handleAddCompany(selectedCompany)} 
          showAdd={!companies.some(c => c.name.toLowerCase() === selectedCompany.name.toLowerCase())} 
        />
      )}
    </div>
  );
};

// --- VideoCard ---
const VideoCard: React.FC<{ company: Company; onOpen: (company: Company) => void }> = ({ company, onOpen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <article 
      className="group glass-card rounded-[2rem] p-5 hover:bg-white/[0.05] transition-all border-white/5 hover:border-white/10 cursor-pointer mb-6 animate-in slide-in-from-bottom-4"
      onClick={() => onOpen(company)}
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => { videoRef.current?.pause(); if(videoRef.current) videoRef.current.currentTime = 0; }}
    >
      <div className="aspect-video rounded-2xl bg-zinc-900 border border-white/5 mb-5 overflow-hidden relative">
        {company.videoUrl ? (
          company.videoUrl.match(/\.(mp4|webm|ogg)$/) ? (
            <video ref={videoRef} src={company.videoUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" muted loop />
          ) : (
            <img src={company.videoUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" alt={company.name} />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/10 text-4xl">{company.segment === 'liten' ? '💡' : '🏢'}</div>
        )}
      </div>
      <h4 className="text-lg font-bold mb-1 uppercase group-hover:text-blue-400 truncate">{company.name}</h4>
      <div className="flex justify-between items-center mb-3">
        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold truncate">{company.city || 'Digital'} {company.land ? `· ${company.land}` : ''}</p>
        {company.tilbyr_AI && <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-black uppercase flex-shrink-0">KI-Klar</span>}
      </div>
      <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">{company.desc}</p>
    </article>
  );
};

// --- KatalogMode ---
const KatalogMode: React.FC<{ companies: Company[]; setSelectedCompany: (c: Company) => void }> = ({ companies, setSelectedCompany }) => {
  const localCompanies = companies.filter(c => c.segment === 'liten');
  const globalCompanies = companies.filter(c => c.segment === 'stor');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="px-8 pt-12 pb-8 max-w-6xl mx-auto w-full flex-shrink-0 flex flex-col items-center lg:items-start">
        <h2 className="text-4xl lg:text-7xl font-black tracking-tighter italic mb-4 text-center lg:text-left">
          SMÅ ER NÅ <span className="text-white/20 italic">STORE</span>
        </h2>
        <div className="flex flex-col lg:flex-row gap-6 items-center w-full">
          <p className="text-sm lg:text-lg text-white/40 max-w-xl font-medium text-center lg:text-left leading-relaxed">
            Den kuraterte oversikten over små bedrifter og store byråer. Finn din neste samarbeidspartner her.
          </p>
        </div>
      </section>

      {/* Two-Column Scrollable Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden border-t border-white/5 h-full">
        {/* Små bedrifter */}
        <section className="w-full lg:flex-1 h-full flex flex-col bg-[#050505] border-b lg:border-b-0 lg:border-r border-white/5 group/col overflow-hidden">
          <div className="p-6 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 flex justify-between items-center shrink-0">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              Små bedrifter
            </h3>
            <span className="text-[10px] text-white/10 font-bold uppercase">{localCompanies.length} bedrifter</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
            <div className="max-w-md mx-auto space-y-2">
              {localCompanies.map(c => <VideoCard key={c.id} company={c} onOpen={setSelectedCompany} />)}
              <div className="h-32" /> {/* Extra space for scroll */}
            </div>
          </div>
        </section>

        {/* Store byråer */}
        <section className="w-full lg:flex-1 h-full flex flex-col bg-black group/col overflow-hidden">
          <div className="p-6 bg-black/95 backdrop-blur-md border-b border-white/5 flex justify-between items-center shrink-0">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
              Store byråer
            </h3>
            <span className="text-[10px] text-white/10 font-bold uppercase">{globalCompanies.length} bedrifter</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
            <div className="max-w-md mx-auto space-y-2">
              {globalCompanies.map(c => <VideoCard key={c.id} company={c} onOpen={setSelectedCompany} />)}
              <div className="h-32" /> {/* Extra space for scroll */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// --- Modal & Registration ---
const VideoModal: React.FC<{ company: Company; onClose: () => void; onAdd?: () => void; showAdd?: boolean }> = ({ company, onClose, onAdd, showAdd }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12" onClick={onClose}>
      <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" />
      <div className="relative w-full max-w-6xl glass-card rounded-[3rem] overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 duration-300 shadow-[0_0_100px_rgba(0,0,0,0.5)]" onClick={e => e.stopPropagation()}>
        <div className="flex-1 bg-black flex items-center justify-center min-h-[300px] lg:min-h-0 relative">
          {company.videoUrl ? (
            company.videoUrl.match(/\.(mp4|webm|ogg)$/) ? (
               <video src={company.videoUrl} controls autoPlay className="max-h-[85vh] w-full" />
            ) : <img src={company.videoUrl} className="max-h-[85vh] object-contain w-full" alt={company.name} />
          ) : <div className="text-white/5 font-black text-6xl lg:text-9xl uppercase select-none p-10 text-center leading-none">{company.name}</div>}
        </div>
        <div className="w-full lg:w-[450px] p-8 lg:p-14 border-l border-white/5 bg-[#050505]/80 backdrop-blur-2xl flex flex-col">
          <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white p-2 transition-colors">✕</button>
          
          <div className="mb-10">
            <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 ${company.segment === 'liten' ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}>
              {company.segment === 'liten' ? 'Små bedrifter' : 'Store byråer'}
            </span>
            <h2 className="text-4xl font-black uppercase italic mb-3 leading-none tracking-tighter">{company.name}</h2>
            <p className="text-xs text-blue-500 font-bold uppercase tracking-[0.2em]">{company.city}{company.land ? `, ${company.land}` : ''}</p>
          </div>

          <div className="space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-4">
            <div>
              <h5 className="text-[10px] uppercase font-black text-white/20 mb-3 tracking-widest">Beskrivelse</h5>
              <p className="text-sm text-white/70 leading-relaxed font-medium">{company.desc}</p>
            </div>

            {company.AI_tjenester && company.AI_tjenester.length > 0 && (
              <div>
                <h5 className="text-[10px] uppercase font-black text-white/20 mb-3 tracking-widest">AI Tjenester</h5>
                <div className="flex flex-wrap gap-2">
                  {company.AI_tjenester.map(t => <span key={t} className="text-[10px] bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 font-bold">{t}</span>)}
                </div>
              </div>
            )}

            <div className="pt-8 border-t border-white/5 space-y-6">
              {company.contact && (
                <div>
                  <h5 className="text-[10px] uppercase font-black text-white/20 mb-1 tracking-widest">Kontakt</h5>
                  <p className="text-sm font-bold text-white/90 select-all">{company.contact}</p>
                </div>
              )}
              {company.website && (
                <div>
                  <h5 className="text-[10px] uppercase font-black text-white/20 mb-1 tracking-widest">Nettsted</h5>
                  <a href={company.website} target="_blank" rel="noreferrer" className="text-sm font-bold hover:text-blue-400 truncate block transition-colors">{company.website}</a>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 space-y-3">
            {showAdd && onAdd && (
              <button onClick={onAdd} className="w-full py-5 bg-blue-600 text-white rounded-[1.25rem] font-black uppercase text-xs hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                Lagre i Katalog
              </button>
            )}
            <button className="w-full py-5 bg-white text-black rounded-[1.25rem] font-black uppercase text-xs hover:scale-105 transition-transform active:scale-95">
              Start Prosjekt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RegisterModal: React.FC<{ onClose: () => void; onAdd: (c: Company) => void }> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    desc: '', 
    city: '', 
    contact: '', 
    videoUrl: '', 
    land: '', 
    segment: 'liten' as Segment 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      tilbyr_AI: true,
      AI_tjenester: []
    } as Company);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />
      <div className="relative w-full max-w-xl glass-card rounded-[2.5rem] p-10 flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">✕</button>
        <h2 className="text-3xl font-black uppercase italic mb-8 tracking-tighter">Registrer bedrift</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mb-2">
            <button 
              type="button" 
              onClick={() => setFormData({...formData, segment: 'liten'})}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.segment === 'liten' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              Små bedrifter
            </button>
            <button 
              type="button" 
              onClick={() => setFormData({...formData, segment: 'stor'})}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.segment === 'stor' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              Store byråer
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-black text-white/30 tracking-[0.2em] ml-1">Bedriftsnavn</label>
              <input required placeholder="Eks: Byrå X" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-white/40 outline-none transition-colors" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-white/30 tracking-[0.2em] ml-1">By</label>
                <input required placeholder="Eks: Oslo" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-white/40 outline-none transition-colors" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-white/30 tracking-[0.2em] ml-1">Land</label>
                <input required placeholder="Eks: Norge" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-white/40 outline-none transition-colors" value={formData.land} onChange={e => setFormData({...formData, land: e.target.value})} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-black text-white/30 tracking-[0.2em] ml-1">Beskrivelse</label>
              <textarea required placeholder="Hva gjør dere unikt med KI?" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 h-28 resize-none focus:border-white/40 outline-none transition-colors" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-black text-white/30 tracking-[0.2em] ml-1">Video / Logo URL</label>
              <input placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-white/40 outline-none transition-colors" value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-black text-white/30 tracking-[0.2em] ml-1">Kontakt</label>
              <input required placeholder="E-post eller telefon" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-white/40 outline-none transition-colors" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-500/10 hover:bg-blue-500 transition-all active:scale-95 mt-4">
            Legg til i Katalog
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Rendering ---
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
