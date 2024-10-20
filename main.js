// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'build/icones/logo.ico'), // Caminho para o ícone
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,  // Se você estiver usando nodeIntegration
            enableRemoteModule: true
        }
    });

    mainWindow.setMenuBarVisibility(false); // Desativa a barra de menus

     // Limpa o cache antes de carregar a página
     mainWindow.webContents.session.clearCache().then(() => {
        mainWindow.loadURL('http://econograma.infinityfreeapp.com/html/login.html');
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
