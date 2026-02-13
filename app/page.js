"use client";
import { useState } from 'react';

export default function OceanID() {
const [image, setImage] = useState(null);
const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const compressImage = (file) => {
return new Promise((resolve) => {
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = (event) => {
const img = new Image();
img.src = event.target.result;
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

setLoading(true);
setError(null);
setResult(null);

try {
const compressedBase64 = await compressImage(file);
setImage(compressedBase64);

const response = await fetch('/api/identify', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ image: compressedBase64 }),
});

const data = await response.json();
if (!response.ok) throw new Error(data.error || 'The AI deep sea scout failed.');
setResult(data);
} catch (err) {
setError(err.message);
} finally {
setLoading(false);
}
};

return (
<div className="min-h-screen bg-slate-950 text-teal-50 p-6 font-sans">
<header className="text-center mb-10 pt-8">
<h1 className="text-5xl font-bold text-teal-400 mb-2 tracking-tighter">OCEAN ID</h1>
<p className="text-slate-400 text-sm">Real-time Marine Intelligence</p>
</header>

<main className="max-w-md mx-auto">
<div className="bg-slate-900 border-2 border-dashed border-teal-800 rounded-3xl p-4 text-center mb-8 relative overflow-hidden shadow-2xl">
{image ? (
<img src={image} className="rounded-2xl w-full h-80 object-cover shadow-2xl" alt="Creature" />
) : (
<div className="py-24 text-center">
<div className="text-7xl mb-4">🐙</div>
<p className="text-teal-400 font-bold">Tap to Scan a Creature</p>
<p className="text-slate-500 text-xs mt-2 italic">Works best for Macro & Reef fish</p>
</div>
)}
<input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={loading} />
</div>

{loading && (
<div className="text-center space-y-4 mb-8">
<div className="inline-block w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
<p className="animate-pulse text-teal-400 font-medium">Identifying species...</p>
</div>
)}

{error && (
<div className="bg-red-900/30 border border-red-800 p-4 rounded-2xl text-red-300 text-xs text-center mb-8 shadow-inner">
<p className="font-bold mb-1">DIVE ERROR:</p>
{error}
</div>
)}

{result && !loading && (
<div className="bg-slate-900 rounded-3xl p-8 border border-teal-800 shadow-2xl animate-in fade-in slide-in-from-bottom-6">
<div className="mb-6">
<h2 className="text-3xl font-black text-white leading-tight">{result.commonName}</h2>
<p className="italic text-teal-500 text-base">{result.scientificName}</p>
</div>

<div className="space-y-5 text-sm">
<div>
<span className="text-teal-700 font-black uppercase text-[10px] tracking-widest block mb-1">Habitat</span>
<p className="text-slate-200">{result.habitat}</p>
</div>

<div>
<span className="text-teal-700 font-black uppercase text-[10px] tracking-widest block mb-1">Safety Info</span>
<div className={`mt-1 p-3 rounded-xl border ${result.dangerLevel?.toLowerCase().includes('dangerous') ? 'bg-red-950/40 border-red-900 text-red-200' : 'bg-green-950/40 border-green-900 text-green-200'}`}>
<p className="font-bold mb-1">{result.dangerLevel}</p>
<p className="text-xs opacity-80">{result.dangerDetails}</p>
</div>
</div>

<div className="bg-teal-900/20 p-4 rounded-2xl border border-teal-800/30">
<span className="text-teal-500 font-black uppercase text-[10px] tracking-widest block mb-2 text-center">Fun Fact</span>
<p className="text-sm text-teal-100 italic text-center leading-relaxed">"{result.funFact}"</p>
</div>
</div>
<button
onClick={() => {setImage(null); setResult(null);}}
className="w-full mt-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-2xl font-black text-lg shadow-[0_0_25px_rgba(45,212,191,0.2)] transition-all active:scale-95"
>
SCAN AGAIN
</button>
</div>
)}
</main>
</div>
);
}
