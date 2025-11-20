// App.js
export function App() {
  // ---------------------------------------------------------
  // 1. Contenedor Principal
  // ---------------------------------------------------------
  const container = document.createElement('div');
  container.className = 'flex flex-col h-[80vh] max-w-md mx-auto mt-8 rounded-3xl overflow-hidden bg-white shadow-2xl shadow-indigo-200 ring-1 ring-gray-100 font-sans';

  // ---------------------------------------------------------
  // 2. Header
  // ---------------------------------------------------------
  const header = document.createElement('div');
  header.className = 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-500 p-4 text-white shadow-md z-10';

  // Wrapper del contenido del header
  const headerContent = document.createElement('div');
  headerContent.className = 'flex items-center gap-3';

  // Avatar
  const avatar = document.createElement('div');
  avatar.className = 'w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl';
  avatar.textContent = '🤖';

  // Información (Texto)
  const infoDiv = document.createElement('div');

  const title = document.createElement('h3');
  title.className = 'font-bold text-lg leading-tight';
  title.textContent = 'Asistente Virtual';

  const statusText = document.createElement('p');
  statusText.className = 'text-indigo-100 text-xs flex items-center gap-1';

  // Indicador de estado (Punto verde)
  const statusDot = document.createElement('span');
  statusDot.className = 'w-2 h-2 bg-green-400 rounded-full animate-pulse';

  // Texto "En línea"
  const statusLabel = document.createTextNode(' En línea');

  // Ensamblaje del Header
  statusText.appendChild(statusDot);
  statusText.appendChild(statusLabel);
  infoDiv.appendChild(title);
  infoDiv.appendChild(statusText);
  headerContent.appendChild(avatar);
  headerContent.appendChild(infoDiv);
  header.appendChild(headerContent);
  container.appendChild(header);

  // ---------------------------------------------------------
  // 3. Área de mensajes
  // ---------------------------------------------------------
  const messages = document.createElement('div');
  messages.className = 'flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-slate-50 scroll-smooth';
  container.appendChild(messages);

  // ---------------------------------------------------------
  // 4. Formulario de entrada
  // ---------------------------------------------------------
  const form = document.createElement('form');
  form.className = 'p-4 bg-white border-t border-gray-100 flex gap-2';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Escribe algo bonito...';
  input.className = 'flex-1 bg-gray-100 text-gray-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all';
  form.appendChild(input);

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:shadow-lg hover:shadow-purple-300 transform hover:scale-105 transition-all duration-200';

  // Creación del icono SVG de forma segura (Namespaced)
  const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgIcon.setAttribute('fill', 'none');
  svgIcon.setAttribute('viewBox', '0 0 24 24');
  svgIcon.setAttribute('stroke-width', '2');
  svgIcon.setAttribute('stroke', 'currentColor');
  svgIcon.classList.add('w-5', 'h-5');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('d', 'M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5');

  svgIcon.appendChild(path);
  button.appendChild(svgIcon);
  form.appendChild(button);
  container.appendChild(form);

  // ---------------------------------------------------------
  // 5. Lógica del Chat
  // ---------------------------------------------------------
  function addMessage(text, sender = 'user') {
    const wrapper = document.createElement('div');
    wrapper.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;

    const msg = document.createElement('div');
    msg.textContent = text;

    if (sender === 'user') {
      msg.className = 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white px-5 py-2.5 rounded-2xl rounded-tr-none shadow-md max-w-[80%] break-words text-sm';
    } else {
      msg.className = 'bg-white text-gray-800 border border-gray-100 px-5 py-2.5 rounded-2xl rounded-tl-none shadow-sm max-w-[80%] break-words text-sm';
    }

    wrapper.appendChild(msg);
    messages.appendChild(wrapper);
    
    setTimeout(() => {
      messages.scrollTop = messages.scrollHeight;
    }, 50);
  }

  // Mensaje inicial
  setTimeout(() => addMessage('¡Hola! ¿En qué puedo ayudarte hoy? 🎨', 'bot'), 100);

  // Manejo del Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    
    addMessage(text, 'user');
    input.value = '';
    input.focus();

    // Respuesta simulada
    setTimeout(() => {
      addMessage('¡Eso suena genial! Cuéntame más. ✨', 'bot');
    }, 800);
  });

  return container;
}