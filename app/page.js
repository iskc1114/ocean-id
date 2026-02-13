"use client";
import { useState } from 'react';

export default function OceanID() {
const [image, setImage] = useState(null);
const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const handleUpload = async (e) => {
const file = e.target.files[0];
if (!file) return;

const reader = new FileReader();
reader.onloadend = async () => {
const base64String = reader.result;
setImage(base64String);
setLoading(true);
setError(null);
setResult(null);

try {
const response = await fetch('/api/identify', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ image: base64String }),
});

if (!response.ok) throw new Error('Network response was not ok');

const data = await response.json();
setResult(data);
} catch (err) {
console.error("Identification Error:", err);
setError("Could not identify the creature. Please try a clearer photo.");
} finally {
setLoading(false);
}
};
reader.readAsDataURL(file);
};

return (
<div className="min-h-screen bg-slate-950 text-teal-50 p-6 font-sans">
<header className="text-center mb-10 pt-8">
<h1 className="text-5xl font-bold text-teal-400 mb-2 tracking-tighter">OCEAN ID</h1>
<p className="text-slate-400 text-sm">Scan the depths in a flash.</p>
</header>

<main className="max-w-md mx-auto">
<div className="bg-slate-900 border-2 border-dashed border-teal-800 rounded-3xl p-4 text-center mb-8 relative overflow-hidden shadow-2xl transition-all hover:border-teal-400">
{image ? (
<img src={image} className="rounded-2xl w-full h-80 object-cover shadow-2xl" alt="Uploaded creature" />
) : (
<div className="py-24">
<div className="text-7xl mb-4 animate-bounce">🐙</div>
<p className="text-teal-400 font-bold">Tap to identify a creature</p>
<p className="text-slate-500 text-xs mt-2">Works for Nudibranchs, Fish, and Shrimps</p>
</div>
)}
<input
type="file"
accept="image/*"
onChange={handleUpload}
className="absolute inset-0 opacity-0 cursor-pointer"
disabled={loading}
/>
</div>

{loading && (
<div className="text-center space-y-4 mb-8">
<div className="inline-block w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
<p className="animate-pulse text-teal-400 font-medium">Marine Biologist is analyzing...</p>
</div>
)}

{error && (
<div className="bg-red-950/40 border border-red-900 p-4 rounded-2xl text-red-400 text-sm text-center mb-8">
{error}
</div>
)}
{result && !loading && (
<div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 border border-teal-800 shadow-2xl animate-in fade-in slide-in-from-bottom-6">
<div className="mb-6">
<h2 className="text-3xl font-black text-white mb-1">{result.commonName}</h2>
<p className="italic text-teal-500 text-base">{result.scientificName}</p>
</div>

<div className="space-y-6">
<div className="grid grid-cols-2 gap-4 text-sm">
<div>
<span className="text-[10px] uppercase text-teal-700 font-black tracking-widest block mb-1">Habitat</span>
<p className="text-slate-200">{result.habitat}</p>
</div>
<div>
<span className="text-[10px] uppercase text-teal-700 font-black tracking-widest block mb-1">Region</span>
<p className="text-slate-200">{result.location}</p>
</div>
</div>

<div className={`p-4 rounded-2xl border ${
result.dangerLevel?.toLowerCase().includes('dangerous')
? 'bg-red-950/50 border-red-900'
: 'bg-green-950/50 border-green-900'
}`}>
<span className={`text-[10px] uppercase font-black tracking-widest block mb-1 ${
result.dangerLevel?.toLowerCase().includes('dangerous') ? 'text-red-500' : 'text-green-500'
}`}>
Safety Level: {result.dangerLevel}
</span>
<p className="text-xs text-slate-300 leading-relaxed">{result.dangerDetails}</p>
</div>

<div className="bg-teal-900/30 p-4 rounded-2xl border border-teal-800/50">
<span className="text-[10px] uppercase text-teal-500 font-black tracking-widest block mb-1">Fun Fact</span>
<p className="text-sm text-teal-50 italic">"{result.funFact}"</p>
</div>
</div>

<button
onClick={() => {setImage(null); setResult(null);}}
className="w-full mt-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-2xl font-black text-lg transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] active:scale-95"
>
SCAN AGAIN
</button>
</div>
)}
</main>

<footer className="mt-16 text-center pb-8">
<div className="h-[1px] w-20 bg-teal-900 mx-auto mb-4"></div>
<p className="text-[10px] text-slate-600 uppercase font-black tracking-[0.4em]">Powered by Gemini Intelligence</p>
</footer>
</div>
);
}
