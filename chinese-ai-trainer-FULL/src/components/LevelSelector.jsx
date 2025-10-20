import React from 'react';
export default function LevelSelector({ level, setLevel }) {
  return (
    <select value={level} onChange={e=>setLevel(Number(e.target.value))} style={{padding:8,borderRadius:8}}>
      {[1,2,3,4,5,6].map(i=> <option key={i} value={i}>HSK {i}</option>)}
    </select>
  )
}
