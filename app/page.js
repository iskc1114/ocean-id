"use client";

import { useState } from 'react';

export default function OceanID() {
const [image, setImage] = useState(null);
const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [lang, setLang] = useState('en');

const t = {
en: { title: "OCEAN ID", subtitle: "Marine Intelligence", scan: "Tap to Identify", loading: "Identifying...", again: "SCAN AGAIN", habitat: "Habitat", safety: "Safety", fact: "Fun Fact", depth: "Depth", temp: "Temp", regions: "Common Regions" },
zh: { title: "海洋識別", subtitle: "水下生物智能鑑定", scan: "點擊識別生物", loading: "正在鑑定中...", again: "再次掃描", habitat: "棲息環境", safety: "安全資訊", fact: "趣味小知識", depth: "水深範圍", temp: "建議水溫", regions: "常見分佈區域" }
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
canvas.width = 1000;
canvas.height = (img.height / img.width) * 1000;
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
if (!res.ok) throw new Error(data.error || 'AI Failed');
setResult(data);
} catch (err) { setError(err.message); } finally { setLoading(false); }
};

return (
<div style={{ backgroundColor: '#020617', minHeight: '100vh', color: '#f0fdfa', padding: '24px', fontFamily: 'sans-serif' }}>
<nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '440px', margin: '0 auto 40px' }}>
<div style={{ fontSize: '28px', fontWeight: '900', color: '#2dd4bf', letterSpacing: '-1.5px' }}>{t.title}</div>
<button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid #115e59', padding: '6px 16px', borderRadius: '30px', color: '#f0fdfa', fontSize: '13px', fontWeight: '800' }}>
{lang === 'en' ? '繁體中文' : 'English'}
</button>
</nav>
<main style={{ maxWidth: '440px', margin: '0 auto' }}>
<div style={{ backgroundColor: '#0f172a', border: '2px dashed rgba(45,212,191,0.3)', borderRadius: '40px', padding: '16px', textAlign: 'center', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
{image ? (
<img src={image} style={{ borderRadius: '28px', width: '100%', height: '340px', objectFit: 'cover' }} alt="Creature" />
) : (
<div style={{ padding: '80px 0' }}>
<div style={{ fontSize: '80px', marginBottom: '24px' }}>🐚</div>
<p style={{ color: '#2dd4bf', fontWeight: '900', fontSize: '22px' }}>{t.scan}</p>
<p style={{ color: '#64748b', fontSize: '11px', marginTop: '8px', letterSpacing: '3px', textTransform: 'uppercase' }}>{t.subtitle}</p>
</div>
)}
<input type="file" accept="image/*" onChange={handleUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} disabled={loading} />
</div>

{loading && <div style={{ textAlign: 'center', color: '#2dd4bf', fontWeight: 'bold', fontSize: '12px' }}>{t.loading.toUpperCase()}</div>}
{result && !loading && (
<div style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', borderRadius: '40px', padding: '32px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
<div style={{ marginBottom: '24px' }}>
<h2 style={{ fontSize: '32px', fontWeight: '900', color: 'white', lineHeight: '1.1', marginBottom: '8px' }}>{result.commonName}</h2>
<p style={{ fontStyle: 'italic', color: '#2dd4bf', fontSize: '18px' }}>{result.scientificName}</p>
</div>

<div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
{/* Habitat & Regions Section */}
<div>
<span style={{ color: '#0d9488', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '4px' }}>{t.habitat}</span>
<p style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.5' }}>{result.habitat}</p>
</div>
<div>
<span style={{ color: '#0d9488', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '4px' }}>{t.regions}</span>
<p style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.5' }}>{result.regions}</p>
</div>

{/* Dive Specs Grid */}
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
<div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
<span style={{ color: '#2dd4bf', fontWeight: '900', fontSize: '9px', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>{t.depth}</span>
<p style={{ fontSize: '14px', fontWeight: 'bold' }}>{result.depthRange || '---'}</p>
</div>
<div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
<span style={{ color: '#2dd4bf', fontWeight: '900', fontSize: '9px', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>{t.temp}</span>
<p style={{ fontSize: '14px', fontWeight: 'bold' }}>{result.temperature || '---'}</p>
</div>
</div>

<div>
<span style={{ color: '#0d9488', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>{t.safety}</span>
<div style={{ padding: '16px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: result.dangerLevel?.toLowerCase().includes('dangerous') ? 'rgba(127, 29, 29, 0.3)' : 'rgba(20, 83, 45, 0.3)' }}>
<p style={{ fontWeight: '900', fontSize: '14px', marginBottom: '4px' }}>{result.dangerLevel}</p>
<p style={{ fontSize: '12px', opacity: 0.8 }}>{result.dangerDetails}</p>
</div>
</div>

<div style={{ background: 'rgba(45,212,191,0.1)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(45,212,191,0.1)', fontStyle: 'italic' }}>
<span style={{ color: '#2dd4bf', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>{t.fact}</span>
<p style={{ fontSize: '14px', lineHeight: '1.6' }}>"{result.funFact}"</p>
</div>
</div>
<button onClick={() => {setImage(null); setResult(null);}} style={{ width: '100%', marginTop: '32px', padding: '20px', backgroundColor: '#2dd4bf', color: '#020617', borderRadius: '24px', fontWeight: '900', fontSize: '18px', border: 'none' }}>
{t.again.toUpperCase()}
</button>
</div>
)}
</main>
</div>
);
}
