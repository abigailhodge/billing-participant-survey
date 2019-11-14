// event listeners for word and submit buttons

var electron = require('electron');
var ipc = electron.ipcRenderer;

var wordButtons = document.getElementsByClassName("btn-light");  
var toggleWordButton = function() {
    var word = this.innerHTML;
    if (this.classList.contains("incorrect")) {
        this.classList.remove("incorrect");
    } else {
        this.classList.add("incorrect")
    }
    ipc.send('word-button-toggled', word);
}
for (var i = 0; i < wordButtons.length; i++) {
    ipc.send('init-word', wordButtons[i].innerHTML);
    wordButtons[i].addEventListener('click', toggleWordButton, false);
}

var submitButton = document.getElementById("submit-button");
var submitDoc = function() {
    ipc.send('submit-answers');
    ipc.send('goToURL', 'startscreen.html')
}
submitButton.addEventListener('click', submitDoc, false);