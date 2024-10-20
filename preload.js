// preload.js
const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {

  window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector);
      if (element) {
        element.innerText = text;
      }
    }

    // Exemplo de expor a versão do Electron
    replaceText('electron-version', process.versions.electron);
  });

  // Usar contextBridge para expor APIs seguras ao frontend
  contextBridge.exposeInMainWorld('api', {
    fetch: (url, options) => {
      return fetch(url, options).then(response => response.json());
    }
  });
});
