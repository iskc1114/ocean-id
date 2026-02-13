"use client";
import { useState } from 'react';

export default function OceanID() {
const [image, setImage] = useState(null);
const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [lang, setLang] = useState('en');

const t = {
en: { title: "OCEAN ID", subtitle: "Marine Intelligence", scan: "Tap to Identify", loading: "Identifying...", again: "SCAN AGAIN", habitat: "Habitat", safety: "Safety info", fact: "Fun Fact" },
zh: { title: "海洋識別", subtitle: "水下生物智能鑑定", scan: "點擊識別生物", loading: "正在鑑定中...", again: "再次掃描", habitat: "棲息地", safety: "安全資訊", fact: "趣味小知識" }
}[lang];

const compressImage = (file) => {
return new Promise((resolve) => {
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = (e) => {
const img = new Image();
img.src = e.target.result;
img.onload = () => {
const canvas = document.createElement('canvas');
const MAX_WIDTH = 1000;
const scale = MAX_WIDTH / img.width;
canvas.width = MAX_WIDTH;
canvas.height = img.height * scale;
const ctx = canvas.getContext('2d');
ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
resolve(canvas.toDataURL('image/jpeg', 0.8));
};
};
});
};

const handleUpload = async (e) => {
const file = e.target.files[0];
if (!file) return;
setLoading(true); setError(null); setResult(null);
try {
const compressed = await compressImage(file);
setImage(compressed);
const res = await fetch('/api/identify', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ image: compressed, lang }),
});
const data = await res.json();
if (!res.ok) throw new Error(data.error || 'Failed');
setResult(data);
} catch (err) { setError(err.message); } finally { setLoading(false); }
};

return (
<div className="min-h-screen bg-slate-950 text-teal-50 p-6 font-sans">
<nav className="flex justify-between items-center max-w-md mx-auto mb-8">
<div className="text-2xl font-black tracking-tighter text-teal-400">{t.title}</div>
<button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} className="bg-slate-900 border border-teal-800 px-3 py-1 rounded-full text-xs font-bold hover:border-teal-400 transition-colors">
{lang === 'en' ? '繁體中文' : 'English'}
</button>
</nav>

<main className="max-w-md mx-auto">
<div className="bg-slate-900 border-2 border-dashed border-teal-800/50 rounded-3xl p-4 text-center mb-8 relative overflow-hidden shadow-2xl">
{image ? (
<img src={image} className="rounded-2xl w-full h-80 object-cover shadow-2xl" alt="Creature" />
) : (
<div className="py-24">
<div className="text-7xl mb-6">🐚</div>
<p className="text-teal-400 font-extrabold tracking-tight text-xl">{t.scan}</p>
<p className="text-slate-500 text-xs mt-2 uppercase tracking-widest opacity-60">{t.subtitle}</p>
</div>
)}
<input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={loading} />
</div>

{loading && <div className="text-center animate-pulse text-teal-400 font-black tracking-widest text-xs uppercase mb-8">{t.loading}</div>}
{error && <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-xs text-center mb-8">{error}</div>}
{result && !loading && (
<div className="bg-slate-900 rounded-3xl p-8 border border-white/5 shadow-2xl animate-in fade-in slide-in-from-bottom-6">
<div className="mb-6">
<h2 className="text-3xl font-black text-white leading-tight mb-1">{result.commonName}</h2>
<p className="italic text-teal-500 font-medium text-lg">{result.scientificName}</p>
</div>

<div className="space-y-6 text-sm">
<div>
<span className="text-teal-700 font-black uppercase text-[10px] tracking-widest block mb-1">{t.habitat}</span>
<p className="text-slate-200">{result.habitat}</p>
</div>

<div>
<span className="text-teal-700 font-black uppercase text-[10px] tracking-widest block mb-1">{t.safety}</span>
<div className={`p-4 rounded-2xl border ${result.dangerLevel?.toLowerCase().includes('dangerous') ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-green-500/10 border-green-500/20 text-green-200'}`}>
<p className="font-black text-sm mb-1 uppercase">{result.dangerLevel}</p>
<p className="text-xs opacity-80">{result.dangerDetails}</p>
</div>
</div>

<div className="bg-teal-900/20 p-5 rounded-2xl border border-teal-500/10 italic">
<span className="text-teal-400 font-black uppercase text-[10px] tracking-widest block mb-2">{t.fact}</span>
<p className="text-sm text-teal-100/90 leading-relaxed">"{result.funFact}"</p>
</div>
</div>

<button onClick={() => {setImage(null); setResult(null);}} className="w-full mt-8 py-5 bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-2xl font-black text-lg shadow-xl active:scale-95">
{t.again}
</button>
</div>
)}
</main>
</div>
);
}
