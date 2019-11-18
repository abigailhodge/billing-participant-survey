var electron = require('electron');
var ipc = electron.ipcRenderer;
var form = document.getElementById('questionnairePageOne');
var languageTable = document.getElementById('languageTable')
var submitForm = function(event) {
    event.preventDefault();
    var formResults = {};
    var formItems = document.getElementsByClassName('form-control');
    for (var i = 0; i < formItems.length; i++) {
        formResults[formItems[i].name] = formItems[i].value;
    }
    ipc.send('submit-questionnaire-1', formResults)
    ipc.send('goToURL', 'spelling.html');
}

var updateLanguages = function(event) {
    var langName = event.target.getAttribute('name');
    var value = event.target.value;
    var langNames = ['langOne', 'langTwo', 'langThree', 'langFour'];
    if (langNames.includes(langName)) {
        var cellsToFill = document.getElementsByName(langName);
        var cellsToEnable = document.getElementsByClassName(langName);
        for (var i = 0; i < cellsToFill.length; i++) {
            cellsToFill[i].setAttribute('value', value);
        }
        if (value) {
            for (var i = 0; i < cellsToEnable.length; i++) {
                cellsToEnable[i].removeAttribute('disabled');
            }
        } else {
            var cellsToDisable = document.getElementsByClassName(langName);
            for (var i = 0; i < cellsToDisable.length; i++) {
                cellsToDisable[i].setAttribute('disabled', '');
            }
        }
    }
}


form.addEventListener('submit', submitForm, false);
languageTable.addEventListener('focusout', updateLanguages, false);
