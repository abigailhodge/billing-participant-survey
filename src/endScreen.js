var electron = require('electron');
var ipc = electron.ipcRenderer;
var toStart = document.getElementById('toStart');

var goToStart = function() {
    ipc.send('goToURL', 'startscreen.html')
};

toStart.addEventListener('click', goToStart, false);
