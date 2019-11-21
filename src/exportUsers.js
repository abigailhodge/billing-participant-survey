var electron = require('electron');
var ipc = electron.ipcRenderer;
var form = document.getElementById('exportUsersForm');
var submitForm = function(event) {
    event.preventDefault();
    var studyID = document.getElementsByClassName('form-control')[0];
    ipc.send('exportData', studyID.value);
}

ipc.on('csvFile', (event, arg) => {
    window.open(arg);
});


form.addEventListener('submit', submitForm, false);