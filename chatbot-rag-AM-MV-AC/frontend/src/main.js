import { App } from './App.js'
import './style.css'
document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById("app");
  appContainer.className = 'min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple to-fuchsia-500';  const app = App()
  appContainer.appendChild(app)
  console.log("App inicial");
})

