var electron = require('electron');
var ipc = electron.ipcRenderer;
var enterParticipants = document.getElementById('enterParticipants');
var exportData = document.getElementById('exportData');

var goToStart = function() {
    ipc.send('goToURL', 'startscreen.html');
}

var exportUserData = function() {
    ipc.send('goToURL', 'exportUsers.html');
}



enterParticipants.addEventListener('click', goToStart, false);
exportData.addEventListener('click', exportUserData, false);