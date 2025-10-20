import React, { useRef, useState } from 'react';
import axios from 'axios';

export default function Recorder({ onTranscribed }) {
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const [rec, setRec] = useState(false);
  const [playingUrl, setPlayingUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const start = async () => {
    const s = await navigator.mediaDevices.getUserMedia({ audio:true });
    const mr = new MediaRecorder(s);
    mediaRef.current = mr;
    chunksRef.current = [];
    mr.ondataavailable = e => chunksRef.current.push(e.data);
    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      setPlayingUrl(URL.createObjectURL(blob));
      const fd = new FormData();
      fd.append('file', blob, 'rec.webm');
      try {
        setLoading(true);
        const res = await axios.post('/api/transcribe', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        const text = res.data.text || res.data || '';
        // For scoring: optionally include expected text from last AI message:
        // We'll pass text + expect to parent; parent will add expected when adding user msg.
        onTranscribed(text, blob);
      } catch (e) {
        console.error(e);
        onTranscribed('', blob);
      } finally { setLoading(false); }
    };
    mr.start();
    setRec(true);
  };

  const stop = () => {
    if(mediaRef.current && mediaRef.current.state !== 'inactive') mediaRef.current.stop();
    setRec(false);
  };

  return (
    <div>
      <div style={{display:'flex', gap:8}}>
        {!rec ? <button onClick={start}>🎙️ Bắt đầu</button> : <button onClick={stop}>⏹️ Dừng</button>}
        {playingUrl && <audio src={playingUrl} controls />}
      </div>
      <div style={{marginTop:8}} className="small-muted">{loading ? 'Đang chuyển âm thanh...' : ''}</div>
    </div>
  )
}
