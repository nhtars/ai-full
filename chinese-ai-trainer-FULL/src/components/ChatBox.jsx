import React, { useState } from 'react';

function scoreSimilarity(a, b){
  // simple normalized Levenshtein implemented in JS
  const la = a.length, lb = b.length;
  if(la===0) return lb===0?1:0;
  const dp = Array(la+1).fill(null).map(()=>Array(lb+1).fill(0));
  for(let i=0;i<=la;i++) dp[i][0]=i;
  for(let j=0;j<=lb;j++) dp[0][j]=j;
  for(let i=1;i<=la;i++){
    for(let j=1;j<=lb;j++){
      const cost = a[i-1]===b[j-1]?0:1;
      dp[i][j]=Math.min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+cost);
    }
  }
  const dist = dp[la][lb];
  const maxl = Math.max(la,lb);
  const sim = maxl===0?1:1 - (dist / maxl);
  return Math.max(0, Math.round(sim*100));
}

export default function ChatBox({ messages }) {
  const [expanded, setExpanded] = useState({});

  const toggle = id => setExpanded(p => ({...p, [id]: !p[id]}));

  return (
    <div>
      {messages.map(m=>(
        <div key={m.id} style={{marginBottom:12}}>
          <div style={{display:'flex', justifyContent: m.role==='user' ? 'flex-end' : 'flex-start'}}>
            <div className={m.role==='user' ? 'bubble-user' : 'bubble-ai'} onClick={()=>toggle(m.id)}>
              <div style={{fontWeight:700, marginBottom:6}}>{m.role==='ai' ? 'AI' : 'Bạn'}</div>
              <div style={{whiteSpace:'pre-wrap'}}>{m.text}</div>
              {expanded[m.id] && (
                <div style={{marginTop:8, fontSize:13}}>
                  {m.pinyin && <div><strong>Pinyin:</strong> {m.pinyin}</div>}
                  {m.meaning && <div><strong>Viet:</strong> {m.meaning}</div>}
                  {m.role==='user' && m.expected && (
                    <div style={{marginTop:6}}>
                      <div><strong>So sánh:</strong></div>
                      <div>Đáp án mong đợi: {m.expected}</div>
                      <div>Điểm phát âm: <span className="score">{scoreSimilarity(m.text || '', m.expected || '')}%</span></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
