var electron = require('electron');
var ipc = electron.ipcRenderer;
var form = document.getElementById('participantIntakeForm');
var submitForm = function(event) {
    event.preventDefault();
    var formResults = {};
    var formItems = document.getElementsByClassName('form-control');
    for (var i = 0; i < formItems.length; i++) {
        formResults[formItems[i].name] = formItems[i].value;
    }
    ipc.send('setup-user', formResults)
}

form.addEventListener('submit', submitForm, false);