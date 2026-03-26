"use client";
import React, { useState, useEffect } from 'react';

export default function YalePractice() {
    const quizData = [
        { word: "唔", yale: ["m", "mh"], note: "常用的否定詞" },
        { word: "係", yale: ["hai", "haih"], note: "係/是" },
        { word: "啲", yale: ["di"], note: "些/啲" },
        { word: "咗", yale: ["jo"], note: "了 (過去式)" },
        { word: "佢", yale: ["keui", "keuih"], note: "他/她" },
        { word: "諗", yale: ["lam"], note: "想/考慮" },
        { word: "㗎", yale: ["ga"], note: "語氣助詞" },
        { word: "嘢", yale: ["ye", "yeh"], note: "東西/事物" },
        { word: "嘅", yale: ["ge"], note: "的" },
        { word: "攞", yale: ["lo"], note: "拿" },
        { word: "喺", yale: ["hai"], note: "在" },
        { word: "仲", yale: ["jung", "juhng"], note: "還/仍然" }
    ];

    const [currentIdx, setCurrentIdx] = useState(0);
    const [input, setInput] = useState('');
    const [feedback, setFeedback] = useState('');
    const [showHint, setShowHint] = useState(false);

    const checkAnswer = () => {
        const answers = Array.isArray(quizData[currentIdx].yale) ? quizData[currentIdx].yale : [quizData[currentIdx].yale];
        const isCorrect = answers.some(ans => ans.toLowerCase() === input.trim().toLowerCase());
        
        if (isCorrect) {
            setFeedback("✅ 啱喇！好叻呀！");
        } else {
            setFeedback("❌ 差少少，再試下？");
        }
    };

    const showHintAction = () => {
        setShowHint(true);
    };

    const nextWord = () => {
        setCurrentIdx((prev) => (prev + 1) % quizData.length);
        setInput('');
        setFeedback('');
        setShowHint(false);
    };

    return (
        <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: '#f0fdfa', padding: '24px', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#0f172a', padding: '30px', borderRadius: '40px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
                <h1 style={{ color: '#2dd4bf', fontSize: '28px', fontWeight: '900' }}>耶魯拼音練習 🐙</h1>
                <p style={{ color: '#64748b', fontSize: '14px' }}>請輸入對應中文字的拼音：</p>
                
                <div style={{ fontSize: '80px', fontWeight: '900', margin: '40px 0', color: 'white' }}>
                    {quizData[currentIdx].word}
                </div>
                
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    style={{ width: '100%', padding: '20px', fontSize: '20px', borderRadius: '20px', border: '2px solid #1e293b', background: '#1e293b', color: 'white', textAlign: 'center', outline: 'none', boxSizing: 'border-box' }}
                    placeholder="在此輸入拼音..."
                />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
                    <button onClick={showHintAction} style={{ padding: '16px', borderRadius: '16px', border: 'none', background: '#334155', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                        唔識打？睇答案
                    </button>
                    <button onClick={checkAnswer} style={{ padding: '16px', borderRadius: '16px', border: 'none', background: '#2dd4bf', color: '#020617', fontWeight: 'bold', cursor: 'pointer' }}>
                        檢查答案
                    </button>
                </div>

                {feedback && <div style={{ marginTop: '24px', fontSize: '18px', fontWeight: 'bold', color: feedback.startsWith('✅') ? '#2dd4bf' : '#f87171' }}>{feedback}</div>}
                
                {showHint && (
                    <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(45, 212, 191, 0.1)', borderRadius: '16px', border: '1px solid rgba(45, 212, 191, 0.2)' }}>
                        正確拼音：<strong style={{ color: '#2dd4bf' }}>{Array.isArray(quizData[currentIdx].yale) ? quizData[currentIdx].yale.join(' / ') : quizData[currentIdx].yale}</strong><br/>
                        <small style={{ color: '#94a3b8' }}>{quizData[currentIdx].note}</small>
                    </div>
                )}
                
                <button onClick={nextWord} style={{ marginTop: '32px', width: '100%', background: 'none', border: '1px solid #2dd4bf', color: '#2dd4bf', padding: '16px', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                    下一個
                </button>
            </div>
            <footer style={{ marginTop: '40px', opacity: '0.4', fontSize: '10px', fontWeight: 'bold' }}>
                YALE PRACTICE v1.0 • POWERED BY MARY
            </footer>
        </div>
    );
}
