import React, { useEffect, useRef, useState } from 'react'
import ChatBox from './components/ChatBox'
import Recorder from './components/Recorder'
import LevelSelector from './components/LevelSelector'
import axios from 'axios'

export default function App(){
  const [level, setLevel] = useState(1)
  const [messages, setMessages] = useState([
    { id: Date.now(), role: 'ai', text: '你好！我们开始练习吧。', pinyin:'Nǐ hǎo! Wǒmen kāishǐ liànxí ba.', meaning:'Chào! Chúng ta bắt đầu luyện nhé.' }
  ])
  const [loading, setLoading] = useState(false)
  const chatRef = useRef(null)

  useEffect(() => { if(chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight }, [messages])

  const addMessage = (role, text, extras={}) => {
    setMessages(m => [...m, { id: Date.now()+Math.random(), role, text, ...extras }])
  }

  const handleUser = async (userText, audioBlob=null) => {
    if(!userText) return
    addMessage('user', userText)
    setLoading(true)
    try {
      const res = await axios.post('/api/chat', { message: userText, level })
      const aiReply = res.data.reply || '(Không có phản hồi)'
      // AI reply expected sentence might be the Chinese sentence in start of reply - we will store aiReply as text
      addMessage('ai', aiReply)
    } catch(e){
      addMessage('ai','(Lỗi khi gọi API)')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h2 style={{margin:0}}>Chinese AI Trainer — Assistant</h2>
          <div style={{display:'flex', gap:10, alignItems:'center'}}>
            <LevelSelector level={level} setLevel={setLevel} />
            <div className="small-muted">HSK level</div>
          </div>
        </div>

        <div ref={chatRef} className="chat-area mt-4">
          <ChatBox messages={messages} />
        </div>

        <div className="controls">
          <Recorder onTranscribed={handleUser} />
          <div style={{flex:1, display:'flex', justifyContent:'flex-end', gap:8}}>
            <button className="pill" onClick={()=>{
              const lastAI = [...messages].reverse().find(m=>m.role==='ai')
              if(lastAI) navigator.clipboard.writeText(lastAI.text)
            }}>Sao chép câu AI</button>
            <button className="pill" onClick={()=>{
              // TTS using Web Speech API
              const lastAI = [...messages].reverse().find(m=>m.role==='ai')
              if(lastAI){
                const msg = new SpeechSynthesisUtterance(lastAI.text)
                msg.lang = 'zh-CN'
                speechSynthesis.speak(msg)
              }
            }}>Nghe AI (TTS)</button>
          </div>
        </div>
      </div>
    </div>
  )
}
