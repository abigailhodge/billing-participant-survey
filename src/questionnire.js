var electron = require('electron');
var ipc = electron.ipcRenderer;
var form = document.getElementById('questionnairePageOne');
var submitForm = function(event) {
    event.preventDefault();
    ipc.send('goToURL', 'spelling.html');
    var formResults = {};
    var formItems = document.getElementsByClassName('form-control');
    for (var i = 0; i < formItems.length; i++) {
        formResults[formItems[i].name] = formItems[i].value;
    }
    ipc.send('submit-questionnaire-1', formResults)
}

form.addEventListener('submit', submitForm, false);