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
<div style={{ backgroundColor: '#020617', minHeight: '100vh', color: '#f0fdfa', padding: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
<nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '440px', margin: '0 auto 40px', paddingTop: '20px' }}>
<div style={{ fontSize: '28px', fontWeight: '900', color: '#2dd4bf', letterSpacing: '-1.5px', textShadow: '0 0 20px rgba(45,212,191,0.3)' }}>{t.title}</div>
<button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid #115e59', padding: '6px 16px', borderRadius: '30px', color: '#f0fdfa', fontSize: '13px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' }}>
{lang === 'en' ? '繁體中文' : 'English'}
</button>
</nav>
<main style={{ maxWidth: '440px', margin: '0 auto' }}>
<div style={{ backgroundColor: '#0f172a', border: '2px dashed rgba(45,212,191,0.3)', borderRadius: '40px', padding: '16px', textAlign: 'center', marginBottom: '32px', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
{image ? (
<img src={image} style={{ borderRadius: '28px', width: '100%', height: '340px', objectFit: 'cover' }} alt="Creature" />
) : (
<div style={{ padding: '80px 0' }}>
<div style={{ fontSize: '80px', marginBottom: '24px', filter: 'drop-shadow(0 0 15px rgba(45,212,191,0.2))' }}>🐚</div>
<p style={{ color: '#2dd4bf', fontWeight: '900', fontSize: '22px', letterSpacing: '-0.5px' }}>{t.scan}</p>
<p style={{ color: '#64748b', fontSize: '11px', marginTop: '8px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 'bold' }}>{t.subtitle}</p>
</div>
)}
<input type="file" accept="image/*" onChange={handleUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }} disabled={loading} />
</div>
{loading && (
<div style={{ textAlign: 'center', marginBottom: '40px' }}>
<div style={{ display: 'inline-block', width: '30px', height: '30px', border: '4px solid #2dd4bf', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
<p style={{ color: '#2dd4bf', fontWeight: '800', fontSize: '12px', marginTop: '12px', letterSpacing: '2px' }}>{t.loading.toUpperCase()}</p>
<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
</div>
)}

{result && !loading && (
<div style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '40px', padding: '32px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', animation: 'slideUp 0.5s ease-out' }}>
<div style={{ marginBottom: '32px' }}>
<h2 style={{ fontSize: '36px', fontWeight: '900', color: 'white', lineHeight: '1', marginBottom: '8px', letterSpacing: '-1px' }}>{result.commonName}</h2>
<p style={{ fontStyle: 'italic', color: '#2dd4bf', fontSize: '20px', fontWeight: '500' }}>{result.scientificName}</p>
</div>
<div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
<div>
<span style={{ color: '#0d9488', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2.5px', display: 'block', marginBottom: '8px' }}>{t.habitat}</span>
<p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: '1.6' }}>{result.habitat}</p>
</div>

<div>
<span style={{ color: '#0d9488', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2.5px', display: 'block', marginBottom: '8px' }}>{t.safety}</span>
<div style={{ padding: '16px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: result.dangerLevel?.toLowerCase().includes('dangerous') ? 'rgba(127, 29, 29, 0.3)' : 'rgba(20, 83, 45, 0.3)' }}>
<p style={{ fontWeight: '900', fontSize: '14px', marginBottom: '4px', color: result.dangerLevel?.toLowerCase().includes('dangerous') ? '#fca5a5' : '#86efac' }}>{result.dangerLevel}</p>
<p style={{ fontSize: '12px', opacity: 0.8, lineHeight: '1.5', color: '#e2e8f0' }}>{result.dangerDetails}</p>
</div>
</div>

<div style={{ background: 'linear-gradient(135deg, rgba(45,212,191,0.15), transparent)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(45,212,191,0.1)' }}>
<span style={{ color: '#2dd4bf', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2.5px', display: 'block', marginBottom: '8px' }}>{t.fact}</span>
<p style={{ fontSize: '15px', lineHeight: '1.7', color: '#f0fdfa', fontStyle: 'italic' }}>"{result.funFact}"</p>
</div>
</div>

<button onClick={() => {setImage(null); setResult(null);}} style={{ width: '100%', marginTop: '40px', padding: '24px', backgroundColor: '#2dd4bf', color: '#020617', borderRadius: '28px', fontWeight: '900', fontSize: '20px', border: 'none', boxShadow: '0 15px 30px rgba(45,212,191,0.3)', cursor: 'pointer', transition: 'transform 0.1s' }}>
{t.again.toUpperCase()}
</button>
<style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
</div>
)}
</main>
<footer style={{ marginTop: '60px', textAlign: 'center', opacity: '0.4' }}>
<p style={{ fontSize: '10px', letterSpacing: '4px', fontWeight: 'bold' }}>POWERED BY GEMINI 2.0</p>
</footer>
</div>
);
}