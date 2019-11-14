var electron = require('electron');
var ipc = electron.ipcRenderer;
var backButton = document.getElementById('backButton');

var backToStart = function () {
    ipc.send('goToURL', 'startscreen.html')
}

backButton.addEventListener('click', backToStart, false);