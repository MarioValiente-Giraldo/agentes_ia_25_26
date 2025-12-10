export function App() {
  // ---------------------------------------------------------
  // 1. Contenedor Principal
  // ---------------------------------------------------------
  const container = document.createElement('div');
  container.className = 'flex h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900';

  // ---------------------------------------------------------
  // 2. Sidebar
  // ---------------------------------------------------------
  const sidebar = document.createElement('div');
  sidebar.className = 'w-64 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 flex flex-col';

  const sidebarHeader = document.createElement('div');
  sidebarHeader.className = 'p-6 border-b border-slate-700/50';

  const logo = document.createElement('div');
  logo.className = 'flex items-center gap-3';

  const logoIcon = document.createElement('div');
  logoIcon.className = 'w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center text-2xl shadow-lg';
  logoIcon.textContent = '🤖';

  const logoText = document.createElement('span');
  logoText.className = 'text-white font-bold text-xl';
  logoText.textContent = 'ROF Assistant';

  logo.appendChild(logoIcon);
  logo.appendChild(logoText);
  sidebarHeader.appendChild(logo);

  const sidebarContent = document.createElement('div');
  sidebarContent.className = 'flex-1 p-4';

  const newChatBtn = document.createElement('button');
  newChatBtn.className = 'w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl px-4 py-3 font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-200 flex items-center justify-center gap-2';
  newChatBtn.innerHTML = '➕ Nueva Conversación';

  // Información del sistema
  const infoBox = document.createElement('div');
  infoBox.className = 'mt-4 p-4 bg-slate-700/30 rounded-xl text-slate-300 text-sm';
  infoBox.innerHTML = `
    <div class="font-semibold text-white mb-2">📚 Sistema RAG</div>
    <div class="space-y-1">
      <div>🔍 Búsqueda semántica</div>
      <div>🤖 Ollama AI</div>
      <div>💾 Base vectorial</div>
    </div>
  `;

  sidebarContent.appendChild(newChatBtn);
  sidebarContent.appendChild(infoBox);

  const sidebarFooter = document.createElement('div');
  sidebarFooter.className = 'p-4 border-t border-slate-700/50';

  const userProfile = document.createElement('div');
  userProfile.className = 'flex items-center gap-3 text-slate-300 hover:text-white transition-colors cursor-pointer p-2 rounded-lg hover:bg-slate-700/50';

  const userAvatar = document.createElement('div');
  userAvatar.className = 'w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-sm';
  userAvatar.textContent = '👤';

  const userName = document.createElement('span');
  userName.className = 'text-sm font-medium';
  userName.textContent = 'Estudiante';

  userProfile.appendChild(userAvatar);
  userProfile.appendChild(userName);
  sidebarFooter.appendChild(userProfile);

  sidebar.appendChild(sidebarHeader);
  sidebar.appendChild(sidebarContent);
  sidebar.appendChild(sidebarFooter);

  // ---------------------------------------------------------
  // 3. Área Principal del Chat
  // ---------------------------------------------------------
  const mainArea = document.createElement('div');
  mainArea.className = 'flex-1 flex flex-col';

  // Header del chat
  const chatHeader = document.createElement('div');
  chatHeader.className = 'bg-slate-800/30 backdrop-blur-xl border-b border-slate-700/50 p-4 flex items-center justify-between';

  const headerLeft = document.createElement('div');
  headerLeft.className = 'flex items-center gap-3';

  const headerAvatar = document.createElement('div');
  headerAvatar.className = 'w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center text-xl';
  headerAvatar.textContent = '🤖';

  const headerInfo = document.createElement('div');

  const headerTitle = document.createElement('h3');
  headerTitle.className = 'text-white font-semibold text-lg';
  headerTitle.textContent = 'Asistente ROF';

  const headerStatus = document.createElement('div');
  headerStatus.className = 'flex items-center gap-2 text-emerald-400 text-sm';
  headerStatus.id = 'status-indicator';

  const statusDot = document.createElement('span');
  statusDot.className = 'w-2 h-2 bg-emerald-400 rounded-full animate-pulse';

  const statusText = document.createTextNode('Verificando conexión...');

  headerStatus.appendChild(statusDot);
  headerStatus.appendChild(statusText);
  headerInfo.appendChild(headerTitle);
  headerInfo.appendChild(headerStatus);
  headerLeft.appendChild(headerAvatar);
  headerLeft.appendChild(headerInfo);
  chatHeader.appendChild(headerLeft);

  // ---------------------------------------------------------
  // 4. Área de mensajes (CENTRADA)
  // ---------------------------------------------------------
  const messagesWrapper = document.createElement('div');
  messagesWrapper.className = 'flex-1 overflow-y-auto p-6 flex justify-center';
  messagesWrapper.style.backgroundImage = 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)';

  const messages = document.createElement('div');
  messages.className = 'w-full max-w-4xl flex flex-col gap-4';

  messagesWrapper.appendChild(messages);

  // ---------------------------------------------------------
  // 5. Formulario (CENTRADO)
  // ---------------------------------------------------------
  const formContainer = document.createElement('div');
  formContainer.className = 'p-6 bg-slate-800/30 backdrop-blur-xl border-t border-slate-700/50 flex justify-center';

  const form = document.createElement('form');
  form.className = 'w-full max-w-4xl flex gap-3';

  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'flex-1 relative';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Pregunta sobre el ROF...';
  input.className = 'w-full bg-slate-700/50 text-white placeholder-slate-400 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-slate-700 transition-all border border-slate-600/50';

  inputWrapper.appendChild(input);

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl px-8 py-4 font-medium hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2';

  const buttonText = document.createElement('span');
  buttonText.textContent = 'Enviar';

  const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgIcon.setAttribute("fill", "none");
  svgIcon.setAttribute("viewBox", "0 0 24 24");
  svgIcon.setAttribute("stroke-width", "2");
  svgIcon.setAttribute("stroke", "currentColor");
  svgIcon.classList.add("w-5", "h-5");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  path.setAttribute("d", "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5");

  svgIcon.appendChild(path);
  button.appendChild(buttonText);
  button.appendChild(svgIcon);

  form.appendChild(inputWrapper);
  form.appendChild(button);
  formContainer.appendChild(form);

  mainArea.appendChild(chatHeader);
  mainArea.appendChild(messagesWrapper);
  mainArea.appendChild(formContainer);

  container.appendChild(sidebar);
  container.appendChild(mainArea);

  // ---------------------------------------------------------
  // 6. Función agregar mensaje con fragmentos
  // ---------------------------------------------------------
  function addMessage(text, sender = 'user', fragmentos = null) {
    const wrapper = document.createElement('div');
    wrapper.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`;

    const msgContainer = document.createElement('div');
    msgContainer.className = 'flex flex-col gap-2 max-w-3xl w-full';

    const mainContent = document.createElement('div');
    mainContent.className = 'flex items-start gap-3';

    if (sender === 'bot') {
      const botAvatar = document.createElement('div');
      botAvatar.className = 'w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center text-sm flex-shrink-0';
      botAvatar.textContent = '🤖';
      mainContent.appendChild(botAvatar);
    }

    const msg = document.createElement('div');
    msg.textContent = text;

    if (sender === 'user') {
      msg.className = 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white px-6 py-3 rounded-2xl rounded-tr-md shadow-lg break-words';
    } else {
      msg.className = 'bg-slate-700/50 backdrop-blur-sm text-white border border-slate-600/50 px-6 py-3 rounded-2xl rounded-tl-md shadow-lg break-words';
    }

    mainContent.appendChild(msg);
    msgContainer.appendChild(mainContent);

    // Mostrar fragmentos si existen
    if (fragmentos && fragmentos.length > 0) {
      const fragmentosContainer = document.createElement('div');
      fragmentosContainer.className = 'ml-11 space-y-2';

      const fragmentosTitle = document.createElement('div');
      fragmentosTitle.className = 'text-slate-400 text-xs font-medium mb-2';
      fragmentosTitle.textContent = '📚 Fragmentos encontrados (por similitud):';
      fragmentosContainer.appendChild(fragmentosTitle);

      fragmentos.forEach((frag, i) => {
        const fragCard = document.createElement('div');
        fragCard.className = 'bg-slate-800/50 border border-slate-600/30 rounded-lg p-3 text-sm';

        const fragHeader = document.createElement('div');
        fragHeader.className = 'flex items-center gap-2 mb-2';

        const similitudBadge = document.createElement('span');
        const similitudNum = parseFloat(frag.similitud);
        const colorClass = similitudNum > 0.7 ? 'bg-green-500/20 text-green-400' : 
                          similitudNum > 0.5 ? 'bg-yellow-500/20 text-yellow-400' : 
                          'bg-orange-500/20 text-orange-400';
        
        similitudBadge.className = `px-2 py-1 rounded-full text-xs font-medium ${colorClass}`;
        similitudBadge.textContent = `${(similitudNum * 100).toFixed(1)}% similar`;

        const fragNumber = document.createElement('span');
        fragNumber.className = 'text-slate-500 text-xs';
        fragNumber.textContent = `Fragmento ${i + 1}`;

        fragHeader.appendChild(similitudBadge);
        fragHeader.appendChild(fragNumber);

        const fragContent = document.createElement('div');
        fragContent.className = 'text-slate-300 text-xs leading-relaxed';
        fragContent.textContent = frag.contenido;

        fragCard.appendChild(fragHeader);
        fragCard.appendChild(fragContent);
        fragmentosContainer.appendChild(fragCard);
      });

      msgContainer.appendChild(fragmentosContainer);
    }

    wrapper.appendChild(msgContainer);
    messages.appendChild(wrapper);

    setTimeout(() => {
      messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
    }, 50);

    return wrapper;
  }

  // ---------------------------------------------------------
  // 7. Verificar estado del servidor
  // ---------------------------------------------------------
  async function verificarEstado() {
    try {
      const resp = await fetch("http://localhost:3002/api/health");
      const data = await resp.json();
      
      const statusIndicator = document.getElementById('status-indicator');
      if (data.status === 'ok') {
        statusIndicator.innerHTML = `
          <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          En línea (${data.database.fragmentos} fragmentos)
        `;
      }
    } catch (e) {
      const statusIndicator = document.getElementById('status-indicator');
      statusIndicator.innerHTML = `
        <span class="w-2 h-2 bg-red-400 rounded-full"></span>
        Servidor desconectado
      `;
    }
  }

  // ---------------------------------------------------------
  // 8. Enviar pregunta al backend
  // ---------------------------------------------------------
  async function consultarBackend(prompt) {
    try {
      const resp = await fetch("http://localhost:3002/api/consulta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      if (!resp.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await resp.json();
      return {
        respuesta: data.respuesta || "No pude obtener la respuesta 😢",
        fragmentos: data.fragmentos || []
      };
    } catch (e) {
      console.error('Error:', e);
      return {
        respuesta: "❌ Error al conectar con el servidor. Asegúrate de que:\n\n1. El servidor está corriendo (npm run server)\n2. Ollama está activo\n3. La base de datos existe",
        fragmentos: []
      };
    }
  }

  // ---------------------------------------------------------
  // 9. Submit del chat
  // ---------------------------------------------------------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";
    input.disabled = true;
    button.disabled = true;

    // mensaje de "pensando"
    const thinkingWrapper = addMessage("🔍 Buscando en el ROF y generando respuesta...", "bot");

    const resultado = await consultarBackend(text);

    // borrar mensaje de "pensando"
    messages.removeChild(thinkingWrapper);

    addMessage(resultado.respuesta, "bot", resultado.fragmentos);

    input.disabled = false;
    button.disabled = false;
    input.focus();
  });

  // Evento del botón nueva conversación
  newChatBtn.addEventListener('click', () => {
    messages.innerHTML = '';
    setTimeout(() => addMessage('¡Hola! Soy tu asistente especializado en el ROF del centro. Puedo responder preguntas sobre:\n\n📋 Reglamentos y normas\n⏰ Horarios\n👔 Uniformes\n📚 Procedimientos\n\n¿Qué te gustaría saber?', 'bot'), 100);
  });

  // Inicializar
  verificarEstado();
  setTimeout(() => addMessage('¡Hola! Soy tu asistente especializado en el ROF del centro. Puedo responder preguntas sobre:\n\n📋 Reglamentos y normas\n⏰ Horarios\n👔 Uniformes\n📚 Procedimientos\n\n¿Qué te gustaría saber?', 'bot'), 100);

  return container;
}