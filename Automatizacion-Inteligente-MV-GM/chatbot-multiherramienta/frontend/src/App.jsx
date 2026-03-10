import { useState, useEffect } from 'react'

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/chatbot'

const BG_PAGE    = '#f7f0f0'
const BG_HEADER  = '#efe6e6'
const BG_AREA    = '#f7f0f0'
const BG_RECV    = '#e8d8d8'
const BG_INPUT   = '#efe6e6'
const CLR_SENT   = '#8b3a3a'   
const CLR_ACCENT = '#8b3a3a'   
const CLR_BORDER = '#d4b8b8'

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function TypingIndicator() {
  return (
    <div style={{ color: '#8b3a3a', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 4 }}>
      <span className="material-symbols-outlined" style={{ fontSize: 18, animation: 'pulse 1.5s infinite' }}>more_horiz</span>
      <span style={{ fontSize: 12, fontStyle: 'italic', color: '#a07070' }}>Escribiendo...</span>
    </div>
  )
}

function ReceivedBubble({ msg }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '75%', gap: 4 }}>
      <div style={{
        background: BG_RECV,
        border: `1px solid ${CLR_BORDER}`,
        color: '#3d1515',
        padding: '10px 16px',
        borderRadius: '1rem',
        borderBottomLeftRadius: '0.25rem',
        fontSize: 14,
        lineHeight: 1.5,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {msg.content}
      </div>
      <span style={{ fontSize: 10, color: '#a07070', marginLeft: 4 }}>{formatTime(msg.ts)}</span>
    </div>
  )
}

function SentBubble({ msg }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', alignSelf: 'flex-end', maxWidth: '75%', gap: 4 }}>
      <div style={{
        background: CLR_SENT,
        color: '#fdf0f0',
        padding: '10px 16px',
        borderRadius: '1rem',
        borderBottomRightRadius: '0.25rem',
        fontSize: 14,
        lineHeight: 1.5,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {msg.content}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 4 }}>
        <span style={{ fontSize: 10, color: '#c4a4a4' }}>{formatTime(msg.ts)}</span>
        <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#c4a4a4' }}>done_all</span>
      </div>
    </div>
  )
}

function WelcomeCard() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '32px 16px',
      borderBottom: `1px solid ${CLR_BORDER}`,
      marginBottom: 24,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'linear-gradient(135deg, #7f1d1d, #be4040)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, marginBottom: 12,
        boxShadow: '0 4px 16px rgba(139,58,58,0.2)',
      }}>🤖</div>
      <span style={{ fontWeight: 700, fontSize: 16, color: '#3d1515' }}>Chatbot Multiherramienta</span>
      <p style={{ color: '#8b5555', fontSize: 13, marginTop: 8, maxWidth: 280, textAlign: 'center', lineHeight: 1.5 }}>
        Pregúntame sobre el clima, países, Wikipedia o cualquier cosa.
      </p>
      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[['🌤️','Clima'],['🌍','Países'],['📖','Wikipedia'],['💬','General']].map(([icon, label]) => (
          <span key={label} style={{
            background: '#f0e4e4', border: `1px solid ${CLR_BORDER}`,
            color: '#8b3a3a', borderRadius: 999, padding: '4px 12px', fontSize: 12,
          }}>{icon} {label}</span>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID())

  useEffect(() => {
    document.getElementById('chat-bottom')?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text, id: Date.now(), ts: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    document.getElementById('chat-input').style.height = 'auto'
    setLoading(true)

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const botText =
        data?.output || data?.message || data?.text || data?.response ||
        (Array.isArray(data) && (data[0]?.output || data[0]?.message || data[0]?.text)) ||
        'Lo siento, no pude obtener una respuesta.'
      setMessages(prev => [...prev, { role: 'bot', content: botText, id: Date.now() + 1, ts: Date.now() + 1 }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: `Error al conectar: ${err.message}. Asegúrate de que N8N esté activo.`,
        id: Date.now() + 1, ts: Date.now() + 1,
      }])
    } finally {
      setLoading(false)
      document.getElementById('chat-input')?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleInput = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
  }

  const canSend = input.trim() && !loading

  return (
    <div style={{ height: '100vh', background: BG_PAGE, display: 'flex', flexDirection: 'column', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* Header */}
      <div style={{
        background: BG_HEADER + 'cc',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${CLR_BORDER}`,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7f1d1d, #be4040)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>🤖</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#f5e6e6', lineHeight: 1.2 }}>Chatbot Multiherramienta</div>
            <div style={{ fontSize: 12, color: '#7a4040' }}>Clima · Países · Wikipedia</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#be4040', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 12, color: '#7a4040' }}>Conectado</span>
        </div>
      </div>

      {/* Messages */}
      <div
        className="custom-scrollbar"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 20px',
          background: BG_AREA,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ maxWidth: 720, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 16 }}>
          <WelcomeCard />
          {messages.map(msg =>
            msg.role === 'user'
              ? <SentBubble key={msg.id} msg={msg} />
              : <ReceivedBubble key={msg.id} msg={msg} />
          )}
          {loading && <TypingIndicator />}
          <div id="chat-bottom" />
        </div>
      </div>

      {/* Input */}
      <div style={{
        background: BG_INPUT,
        borderTop: `1px solid ${CLR_BORDER}`,
        padding: '12px 20px',
        flexShrink: 0,
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 8,
            background: BG_RECV,
            border: `1px solid ${CLR_BORDER}`,
            borderRadius: '1rem',
            padding: '8px 8px 8px 12px',
            transition: 'border-color 0.2s',
          }}
            onFocus={e => e.currentTarget.style.borderColor = CLR_ACCENT}
            onBlur={e => e.currentTarget.style.borderColor = CLR_BORDER}
          >
            <textarea
              id="chat-input"
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={loading}
              rows={1}
              placeholder="Escribe un mensaje..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#f5e6e6',
                fontSize: 14,
                fontFamily: "'Be Vietnam Pro', sans-serif",
                resize: 'none',
                padding: '6px 4px',
                minHeight: 36,
                maxHeight: 128,
                overflowY: 'auto',
              }}
              className="custom-scrollbar"
            />
            <button
              onClick={sendMessage}
              disabled={!canSend}
              style={{
                padding: 8,
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                cursor: canSend ? 'pointer' : 'not-allowed',
                color: canSend ? CLR_ACCENT : '#4a2020',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s, background 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={e => { if (canSend) e.currentTarget.style.background = '#3d1a1a' }}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>send</span>
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: 11, color: '#4a2020', marginTop: 6 }}>
            Enter para enviar · Shift+Enter para nueva línea
          </p>
        </div>
      </div>

    </div>
  )
}
