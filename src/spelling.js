// event listeners for word and submit buttons

var electron = require('electron');
var ipc = electron.ipcRenderer;
var wordsSelected = {};
var wordButtons = document.getElementsByClassName("btn-light");  
var toggleWordButton = function() {
    var word = this.innerHTML;
    if (this.classList.contains("incorrect")) {
        this.classList.remove("incorrect");
    } else {
        this.classList.add("incorrect")
    }
    wordsSelected[word] = !wordsSelected[word];
}
for (var i = 0; i < wordButtons.length; i++) {
    wordsSelected[wordButtons[i].innerHTML] = false;
    wordButtons[i].addEventListener('click', toggleWordButton, false);
}

var submitButton = document.getElementById("submit-button");
var submitDoc = function() {
    ipc.send('submitSpelling', wordsSelected);
    ipc.send('goToURL', 'startscreen.html')
}
submitButton.addEventListener('click', submitDoc, false);