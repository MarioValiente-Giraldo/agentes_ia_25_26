import { useState, useRef, useEffect } from 'react'

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/chat'

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center text-sm flex-shrink-0">
        🤖
      </div>
      <div className="bg-slate-700 border border-slate-600 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-5">
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-end gap-2 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
          isUser ? 'bg-purple-700' : 'bg-teal-700'
        }`}
      >
        {isUser ? '👤' : '🤖'}
      </div>
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? 'bg-purple-700 border border-purple-600 text-purple-50 rounded-br-sm'
            : 'bg-slate-700 border border-slate-600 text-slate-100 rounded-bl-sm'
        }`}
      >
        {msg.content}
      </div>
    </div>
  )
}

function WelcomeBubble() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center text-sm flex-shrink-0">
        🤖
      </div>
      <div className="bg-slate-700 border border-slate-600 text-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed max-w-[75%]">
        <p className="font-medium text-teal-300 mb-1">Hola! Soy tu Chatbot Multiherramienta.</p>
        <p className="text-slate-300">Puedo ayudarte con:</p>
        <ul className="mt-1 space-y-0.5 text-slate-400 list-none">
          <li>🌤️ <span className="text-slate-300">Clima</span> — pregunta por el tiempo en cualquier ciudad</li>
          <li>🌍 <span className="text-slate-300">Países</span> — datos de cualquier país del mundo</li>
          <li>📖 <span className="text-slate-300">Wikipedia</span> — busca personas, eventos, conceptos</li>
          <li>💬 <span className="text-slate-300">General</span> — conversación libre</li>
        </ul>
      </div>
    </div>
  )
}

export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID())
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text, id: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId }),
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      const data = await res.json()
      const botText =
        data?.output ||
        data?.message ||
        data?.text ||
        data?.response ||
        (Array.isArray(data) && (data[0]?.output || data[0]?.message || data[0]?.text)) ||
        'Lo siento, no pude obtener una respuesta.'

      const botMsg = { role: 'bot', content: botText, id: Date.now() + 1 }
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      const errMsg = {
        role: 'bot',
        content: `Error al conectar con el servidor: ${err.message}. Asegúrate de que N8N esté en ejecución.`,
        id: Date.now() + 1,
      }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl flex flex-col h-[90vh] max-h-[800px]">

        {/* Header */}
        <div className="bg-slate-800 border border-slate-700 rounded-t-2xl px-6 py-4 flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-teal-600 flex items-center justify-center text-lg">
            🤖
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 leading-tight">Chatbot Multiherramienta</h1>
            <p className="text-xs text-slate-400">Clima · Países · Wikipedia</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400">Conectado</span>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto bg-slate-900 border-x border-slate-700 px-4 py-4 scroll-smooth">
          <WelcomeBubble />
          {messages.map(msg => (
            <Message key={msg.id} msg={msg} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="bg-slate-800 border border-slate-700 rounded-b-2xl px-4 py-3 flex-shrink-0">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              rows={1}
              placeholder="Pregunta por el clima, un país o cualquier tema..."
              className="flex-1 bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors disabled:opacity-50 min-h-[42px] max-h-32"
              style={{ height: 'auto' }}
              onInput={e => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors flex-shrink-0 flex items-center gap-1.5 h-[42px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.288Z" />
              </svg>
              Enviar
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-2 text-center">
            Enter para enviar · Shift+Enter para nueva línea
          </p>
        </div>

      </div>
    </div>
  )
}
