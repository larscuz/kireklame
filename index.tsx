
import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// --- Typer ---
type Segment = 'oslo' | 'norge';
type View = 'katalog' | 'opplæring' | 'foredrag';

interface Company {
  id: string;
  name: string;
  segment: Segment;
  desc: string;
  city?: string;
  videoUrl?: string;
  website?: string;
  contact?: string;
  tilbyr_AI?: boolean;
  AI_tjenester?: string[];
}

const CONTACT_EMAIL = "x@larscuzner.com";

// HJELPEFUNKSJON FOR Å GENERERE MOCK-DATA
const generateMocks = () => {
  const osloData: Partial<Company>[] = [
    { name: 'Good Morning Naug', website: 'https://www.goodmorning.no', videoUrl: 'https://www.youtube.com/embed/4puf5Kvgh9Q', desc: 'Prisvinnende kreativt byrå som kombinerer strategi, design og teknologi.' },
    { name: 'Well Told', website: 'https://www.welltold.no', desc: 'Spesialister på historiefortelling og digitalt innhold.' },
    { name: 'INEVO', website: 'https://inevo.no', videoUrl: 'https://www.youtube.com/embed/videoseries?list=UUccl-H9_W_W6H_p3W3z0L3g', desc: 'Operativt markedsføringsbyrå med fokus på vekst og målbare resultater.' },
    { name: 'Digital Driv', website: 'https://digitaldriv.no', desc: 'Hjelper bedrifter med digital transformasjon og synlighet.' },
    { name: 'Tigon Marketing', website: 'https://tigonmarketing.no', desc: 'Datadrevet markedsføring og vekststrategier.' },
    { name: 'DIGSTRA', website: 'https://digstra.no', desc: 'Spesialister på digital strategi og konverteringsoptimalisering.' },
    { name: 'M51 Marketing', website: 'https://m51.no', desc: 'Fullservice digitalbyrå med fokus på ROI.' },
    { name: 'MediaCatch', website: 'https://aheadgroup.no/mediacatch', desc: 'AI-drevet medieovervåking og analyse fra Ahead Group.' },
    { name: 'MotherX AI', website: 'https://motherx.ai', desc: 'Plattform og byrå for AI-drevet innholdsproduksjon.' },
    { name: 'Iteo', website: 'https://iteo.no', desc: 'B2B-markedsføring med fokus på innhold og PR.' },
    { name: 'Effekt Media', website: 'https://effektmedia.no', desc: 'Eksperter på søkemotormarkedsføring og betalt annonsering.' },
    { name: 'NXT Oslo', website: 'https://nxt.oslo.no', desc: 'Kreativt teknologibyrå i hjertet av Oslo.' },
    { name: 'FaceFirst', website: 'https://www.facefirst.no', desc: 'Digital markedsføring med fokus på sosiale medier.' },
    { name: 'Synlighet (Oslo)', website: 'https://synlighet.no', videoUrl: 'https://www.youtube.com/embed/F6mN_D0Z1oQ', desc: 'Et av Norges ledende performance marketing-miljøer.' },
    { name: 'GAGNER', website: 'https://gagner.no', desc: 'Strategisk rådgivning og digital utførelse.' },
  ];

  const norgeData: Partial<Company>[] = [
    { name: 'Synlighet (Bergen)', city: 'Bergen', website: 'https://synlighet.no', videoUrl: 'https://www.youtube.com/embed/F6mN_D0Z1oQ', desc: 'Hovedkontoret til Synlighet med fokus på performance og strategi.' },
    { name: 'Attentio', city: 'Bergen', website: 'https://www.attentio.no', desc: 'Spesialister på digital synlighet og innhold i Bergen.' },
    { name: 'TenneT', city: 'Bergen', website: 'https://tennet.no', desc: 'Leverer moderne digitale tjenester og markedsføringsløsninger.' },
    { name: 'Cannonball PR', city: 'Bergen', website: 'https://www.cannonballpr.no', desc: 'PR og kommunikasjonsbyrå med hjerte for gode historier.' },
    { name: 'Glø / Heiglo', city: 'Tromsø', website: 'https://heiglo.no', desc: 'Kreativt miljø i nord med fokus på visuell kommunikasjon.' },
    { name: 'Essential Media', city: 'Tromsø', website: 'https://essentialmedia.no', desc: 'Digitalt innhold og markedsføring fra Nord-Norge.' },
    { name: 'Involve', city: 'Trondheim/Tromsø', website: 'https://involve.no', desc: 'Nasjonalt byrå som leverer reklame og strategi over hele landet.' },
    { name: 'Preferium', city: 'Fredrikstad', website: 'https://preferium.no', desc: 'Digitalbyrå i Fredrikstad med fokus på vekst.' },
    { name: 'UXAR', city: 'Østlandet', website: 'https://uxar.ai', desc: 'Fremtidens reklame med AI, XR og Augmented Reality.' },
    { name: 'AWISEE', city: 'Remote/Norge', website: 'https://awisee.com', desc: 'Internasjonalt fokus på linkbuilding og SEO for det norske markedet.' },
    { name: 'Babylovegrowth', city: 'Bergen', website: 'https://babylovegrowth.com', desc: 'AI-drevet vekst og performance markedsføring.' },
    { name: 'Riktig Spor', city: 'Bodø', website: 'https://riktigspr.no', desc: 'Strategi, design og innhold i Nord-Norge.' },
    { name: 'DMT', city: 'Nordland', website: 'https://dmt.no', desc: 'Digital Medie & Teknologi – din partner i Nordland.' },
    { name: 'Webfabrikk', city: 'Billingstad', website: 'https://webfabrikk.com', videoUrl: 'https://www.youtube.com/embed/kx8oZIPlWb4', desc: 'AI-drevet markedsføring som automatiserer og optimaliserer.' },
  ];

  const allMocks: Company[] = [];

  for (let i = 0; i < 50; i++) {
    const data = osloData[i] || { name: `Ledig plass Oslo #${i + 1}`, website: '', desc: 'Her kan du legge til en ny bedrift manuelt i koden.' };
    allMocks.push({
      id: `oslo-${i}`,
      name: data.name!,
      segment: 'oslo',
      desc: data.desc || '',
      city: 'Oslo',
      videoUrl: data.videoUrl || '',
      website: data.website || '',
      contact: 'kontakt@bedrift.no',
      tilbyr_AI: true,
      AI_tjenester: ['KI-Reklame']
    });
  }

  for (let i = 0; i < 50; i++) {
    const data = norgeData[i] || { name: `Ledig plass Norge #${i + 1}`, website: '', desc: 'Her kan du legge til en ny bedrift manuelt i koden.' };
    allMocks.push({
      id: `norge-${i}`,
      name: data.name!,
      segment: 'norge',
      desc: data.desc || '',
      city: data.city || 'Norge',
      videoUrl: data.videoUrl || '',
      website: data.website || '',
      contact: 'kontakt@bedrift.no',
      tilbyr_AI: true,
      AI_tjenester: ['KI-Reklame']
    });
  }

  return allMocks;
};

const MOCK_COMPANIES = generateMocks();

// --- MediaDisplay ---
const MediaDisplay: React.FC<{ url?: string; autoPlay?: boolean; muted?: boolean }> = ({ url, autoPlay = false, muted = true }) => {
  if (!url) return null;
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const isVideoFile = url.match(/\.(mp4|webm|ogg)$/i);
  const isImage = url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i);

  if (isYouTube) {
    const embedUrl = url.includes('embed') ? url : url.replace('watch?v=', 'embed/').split('&')[0];
    return <iframe src={`${embedUrl}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&controls=0&loop=1`} className="w-full h-full border-none" allow="autoplay; encrypted-media" />;
  }
  if (isVideoFile) return <video src={url} className="w-full h-full object-cover" autoPlay={autoPlay} muted={muted} loop />;
  if (isImage || !isVideoFile) return <img src={url} className="w-full h-full object-cover" alt="Media" />;
  return null;
};

// --- App ---
const App: React.FC = () => {
  const [view, setView] = useState<View>('katalog');
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden selection:bg-blue-500/30">
      <nav className="w-24 lg:w-80 border-r border-white/5 flex flex-col bg-[#050505] z-50">
        <div className="p-6">
          <div className="mb-12 flex items-center gap-4 px-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-pointer" onClick={() => setView('katalog')}>
              <span className="text-white font-black text-xs italic">KI</span>
            </div>
            <div className="hidden lg:block cursor-pointer" onClick={() => setView('katalog')}>
              <h1 className="text-xl font-black tracking-tighter uppercase leading-none">KI REKLAME</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mt-1">Oslo / Norge</p>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => setView('katalog')} 
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all ${view === 'katalog' ? 'border-white/20 bg-white/10 text-white shadow-xl' : 'border-white/5 text-white/40 hover:text-white'}`}
            >
              <span className="text-xl">📁</span>
              <div className="hidden lg:block text-left">
                <p className="font-bold text-sm tracking-tight">Katalog</p>
                <p className="text-[10px] opacity-40 font-medium">Alle bedrifter</p>
              </div>
            </button>

            <button 
              onClick={() => setView('opplæring')} 
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all ${view === 'opplæring' ? 'border-blue-500/50 bg-blue-500/10 text-white shadow-xl shadow-blue-500/5' : 'border-white/5 text-white/40 hover:text-white'}`}
            >
              <span className="text-xl">🎓</span>
              <div className="hidden lg:block text-left">
                <p className="font-bold text-sm tracking-tight">KI-Opplæring</p>
                <p className="text-[10px] opacity-40 font-medium">Lær det selv</p>
              </div>
            </button>

            <button 
              onClick={() => setView('foredrag')} 
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all ${view === 'foredrag' ? 'border-blue-500/50 bg-blue-500/10 text-white shadow-xl shadow-blue-500/5' : 'border-white/5 text-white/40 hover:text-white'}`}
            >
              <span className="text-xl">🎤</span>
              <div className="hidden lg:block text-left">
                <p className="font-bold text-sm tracking-tight">Foredrag</p>
                <p className="text-[10px] opacity-40 font-medium">Inspirasjon & KI</p>
              </div>
            </button>
            
            <a 
              href={`mailto:${CONTACT_EMAIL}`}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-white/5 hover:border-white/20 text-white/40 hover:text-white transition-all"
            >
              <span className="text-lg">➕</span>
              <div className="hidden lg:block text-left">
                <p className="font-bold text-xs tracking-tight">Send inn ny bedrift</p>
              </div>
            </a>
          </div>
        </div>
        
        <div className="flex-1" />
        <div className="p-6 border-t border-white/5">
          <div className="p-4 rounded-2xl bg-white/[0.02] text-[10px] text-white/30 space-y-1">
             <p className="flex items-center gap-2 font-bold text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Drevet av Cuz Media
            </p>
            <p>© 2025 KI Reklame Norge</p>
          </div>
        </div>
      </nav>

      <main className="flex-1 relative overflow-hidden flex flex-col h-full bg-[#030303]">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
        
        {view === 'katalog' && <KatalogMode companies={companies} setSelectedCompany={setSelectedCompany} />}
        {view === 'opplæring' && <TrainingPage />}
        {view === 'foredrag' && <KeynotePage />}
      </main>

      {selectedCompany && <VideoModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />}
    </div>
  );
};

// --- Sidetyper ---
const TrainingPage: React.FC = () => (
  <div className="h-full overflow-y-auto custom-scrollbar p-10 lg:p-20">
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Opplæring av Cuz Media</span>
      <h2 className="text-5xl lg:text-7xl font-black italic tracking-tighter mb-10 leading-none">LAG DINE EGNE <br/> <span className="text-white/20">KI-REKLAMER</span></h2>
      
      <div className="aspect-video rounded-[2.5rem] bg-zinc-900 border border-white/10 overflow-hidden mb-12 shadow-2xl relative">
        <video src="https://www.w3schools.com/html/mov_bbb.mp4" className="w-full h-full object-cover opacity-80" controls autoPlay muted loop />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h3 className="text-2xl font-bold italic uppercase tracking-tight">Hva du vil lære</h3>
          <ul className="space-y-6">
            {[
              { t: 'Prompt Engineering', d: 'Lær å kommunisere med KI-modeller for å få nøyaktig det visuelle resultatet du ønsker.' },
              { t: 'Video-generering', d: 'Bruk verktøy som Runway, Luma og Kling for å lage film fra tekst eller bilder.' },
              { t: 'AI-Stemmer & Audio', d: 'Integrer profesjonelle voiceovers og musikk generert i sanntid.' },
              { t: 'Arbeidsflyt', d: 'Hvordan kutte produksjonstiden fra uker til timer.' }
            ].map(item => (
              <li key={item.t} className="flex gap-4 group">
                <div className="w-1 h-12 bg-blue-600 group-hover:h-16 transition-all" />
                <div>
                  <h4 className="font-black text-sm uppercase mb-1">{item.t}</h4>
                  <p className="text-sm text-white/40 leading-relaxed">{item.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-card p-10 rounded-[2rem] border-blue-500/20 self-start">
          <h4 className="text-xl font-black mb-4 uppercase italic">Klar for kurs?</h4>
          <p className="text-sm text-white/60 mb-8 leading-relaxed">Vi skreddersyr opplæring for markedsavdelinger og kreative team som ønsker å ta eierskap over KI-verktøyene.</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="w-full block py-5 bg-white text-black rounded-2xl font-black uppercase text-xs hover:scale-105 active:scale-95 transition-all mb-4 text-center">Kontakt Cuz Media</a>
          <p className="text-center text-[10px] text-white/20 font-bold uppercase tracking-widest">Kurs holdes i Oslo eller digitalt</p>
        </div>
      </div>
    </div>
  </div>
);

const KeynotePage: React.FC = () => (
  <div className="h-full overflow-y-auto custom-scrollbar p-10 lg:p-20">
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Foredrag av Cuz Media</span>
      <h2 className="text-5xl lg:text-7xl font-black italic tracking-tighter mb-10 leading-none">FREMTIDENS <br/> <span className="text-white/20">MARKEFØRING</span></h2>
      
      <div className="aspect-video rounded-[2.5rem] bg-zinc-900 border border-white/10 overflow-hidden mb-12 shadow-2xl relative">
        <video src="https://www.w3schools.com/html/movie.mp4" className="w-full h-full object-cover opacity-80" controls autoPlay muted loop />
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h3 className="text-2xl font-bold italic uppercase tracking-tight">Temaer i foredraget</h3>
          <div className="space-y-4">
             {['KI-revolusjonen i reklamebransjen', 'Slik sparer store merkevarer millioner', 'Etikk og autentisitet i en syntetisk verden', 'Fremtidens kreative roller'].map(t => (
               <div key={t} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all cursor-default">
                 <p className="font-bold text-sm tracking-tight">{t}</p>
               </div>
             ))}
          </div>
        </div>
        <div className="glass-card p-10 rounded-[2rem] border-white/10 self-start">
          <h4 className="text-xl font-black mb-4 uppercase italic">Book Cuz Media</h4>
          <p className="text-sm text-white/60 mb-8 leading-relaxed">Vi holder inspirerende foredrag for ledergrupper, konferanser og fagmiljøer som ønsker å forstå kraften i generativ KI.</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="w-full block py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs hover:bg-blue-500 active:scale-95 transition-all mb-4 shadow-xl shadow-blue-500/20 text-center">Send forespørsel</a>
          <p className="text-center text-[10px] text-white/20 font-bold uppercase tracking-widest">Tilgjengelig for oppdrag i hele Norge</p>
        </div>
      </div>
    </div>
  </div>
);

// --- KatalogModuler ---
const VideoCard: React.FC<{ company: Company; onOpen: (c: Company) => void }> = ({ company, onOpen }) => {
  return (
    <article className="group glass-card rounded-[2rem] p-5 hover:bg-white/[0.06] transition-all border-white/5 hover:border-blue-500/30 cursor-pointer mb-6 animate-in slide-in-from-bottom-4 relative overflow-hidden" onClick={() => onOpen(company)}>
      <div className="aspect-video rounded-2xl bg-zinc-900/50 border border-white/5 mb-5 overflow-hidden relative group-hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all">
        {company.videoUrl ? <MediaDisplay url={company.videoUrl} autoPlay={false} /> : <div className="absolute inset-0 flex items-center justify-center text-white/5 font-black text-2xl uppercase tracking-tighter">{company.name}</div>}
        {company.website && (
          <button onClick={(e) => { e.stopPropagation(); window.open(company.website, '_blank'); }} className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </button>
        )}
      </div>
      <h4 className="text-lg font-bold mb-1 uppercase group-hover:text-blue-400 truncate tracking-tight">{company.name}</h4>
      <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-3">{company.city}</p>
      <p className="text-xs text-white/50 line-clamp-2 leading-relaxed h-8">{company.desc}</p>
    </article>
  );
};

const KatalogMode: React.FC<{ companies: Company[]; setSelectedCompany: (c: Company) => void }> = ({ companies, setSelectedCompany }) => {
  const oslo = companies.filter(c => c.segment === 'oslo');
  const norge = companies.filter(c => c.segment === 'norge');
  return (
    <div className="h-full flex flex-col">
      <header className="px-10 pt-16 pb-12 shrink-0">
        <h2 className="text-5xl lg:text-8xl font-black tracking-tighter italic mb-4">NORSK <span className="text-white/20">KI-KATALOG</span></h2>
        <p className="text-sm lg:text-lg text-white/30 max-w-2xl font-medium">En kuratert oversikt over norske byråer og bedrifter som leder an innen AI-reklame.</p>
      </header>
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden border-t border-white/5">
        <section className="w-full lg:flex-1 h-full flex flex-col border-r border-white/5">
          <div className="p-6 bg-black/50 backdrop-blur-xl border-b border-white/5 flex justify-between items-center z-10"><h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-500 flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_blue]" />Bedrifter i Oslo</h3><span className="text-[10px] font-black text-white/20 uppercase">{oslo.length}</span></div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8"><div className="max-w-md mx-auto">{oslo.map(c => <VideoCard key={c.id} company={c} onOpen={setSelectedCompany} />)}</div></div>
        </section>
        <section className="w-full lg:flex-1 h-full flex flex-col bg-[#020202]">
          <div className="p-6 bg-black/50 backdrop-blur-xl border-b border-white/5 flex justify-between items-center z-10"><h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/40 flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-white/40" />Bedrifter i Norge</h3><span className="text-[10px] font-black text-white/20 uppercase">{norge.length}</span></div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8"><div className="max-w-md mx-auto">{norge.map(c => <VideoCard key={c.id} company={c} onOpen={setSelectedCompany} />)}</div></div>
        </section>
      </div>
    </div>
  );
};

const VideoModal: React.FC<{ company: Company; onClose: () => void }> = ({ company, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" />
      <div className="relative w-full max-w-6xl bg-[#080808] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-[0_0_100px_rgba(0,0,0,0.8)]" onClick={e => e.stopPropagation()}>
        <div className="flex-1 bg-black flex items-center justify-center min-h-[400px]"><MediaDisplay url={company.videoUrl} autoPlay={true} muted={false} /></div>
        <div className="w-full lg:w-[450px] p-12 border-l border-white/5 bg-zinc-950 flex flex-col">
          <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">✕</button>
          <div className="mb-10"><h2 className="text-4xl font-black uppercase italic mb-2 tracking-tighter leading-none">{company.name}</h2><p className="text-xs text-blue-500 font-bold uppercase tracking-[0.2em]">{company.city}</p></div>
          <div className="space-y-8 flex-1"><div><h5 className="text-[10px] uppercase font-black text-white/20 mb-3 tracking-widest">Om bedriften</h5><p className="text-sm text-white/70 leading-relaxed">{company.desc}</p></div>{company.contact && (<div><h5 className="text-[10px] uppercase font-black text-white/20 mb-1 tracking-widest">Kontakt</h5><p className="text-sm font-bold text-white">{company.contact}</p></div>)}</div>
          <div className="mt-12 space-y-3">
            {company.website && <a href={company.website} target="_blank" className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95 text-center">Besøk Nettside</a>}
            <a href={`mailto:${CONTACT_EMAIL}`} className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase text-xs hover:bg-white/10 transition-all text-center">Send Forespørsel</a>
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) { createRoot(container).render(<App />); }
