var electron = require('electron');
var ipc = electron.ipcRenderer;
var backButton = document.getElementById('backButton');
var addButton = document.getElementById('addToStudy');


var backToStart = function () {
    ipc.send('goToURL', 'startscreen.html');
}

var addToStudy = function() {
    var url = new URL(window.location.href);
    userStudyInfo = {};
    userStudyInfo["participantID"] = url.searchParams.get('participantID');
    userStudyInfo["studyID"] = url.searchParams.get('studyID');
    ipc.send('addUserToStudy', userStudyInfo);
}

backButton.addEventListener('click', backToStart, false);
addButton.addEventListener('click', addToStudy, false);