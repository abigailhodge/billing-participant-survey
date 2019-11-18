const electron = require('electron')
const { app, BrowserWindow } = require('electron');
const DataStore = require('./DataStore'); 
var ipc = electron.ipcMain;


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let testWindow;
let userID;
let ds;
var wordsSelected = {};

const createWindow = () => {
  console.log('hit here')
  // Create the browser window.
  // nodeIntegration = true to allow for require keyword in client-side code
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/startscreen.html`);

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  ds = new DataStore();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipc.on('word-button-toggled', (event, arg) => {
  wordsSelected[arg] = !wordsSelected[arg];
});

ipc.on('init-word', (event, arg) => {
  wordsSelected[arg] = false;
});

ipc.on('submit-answers', () => {
  ds.setUserWordAnswers(wordsSelected);
  ds.saveUserData();
});

ipc.on('submit-questionnaire-1', (event, arg) => {
  ds.setUserQuestionnaireOneAnswers(arg);
})

ipc.on('goToURL', (event, arg) => {
  mainWindow.loadURL(`file://${__dirname}/` + arg);
});

ipc.on('setup-user', (event, arg) => {
  if (typeof(ds.getUserData(arg.participantID)) === 'undefined') {
    ds.initUser(arg.participantID);
    ds.addUserStudy(arg.studyID);
    mainWindow.loadURL(`file://${__dirname}/questionnaire.html`);
  } else if (ds.checkUserStudy(arg.participantID, arg.studyID)) {
    mainWindow.loadURL(`file://${__dirname}/userStudyExists.html`);
  } else {
    mainWindow.loadURL(`file://${__dirname}/userExists.html?participantID=${arg.participantID}&studyID=${arg.studyID}`);
  }
});

ipc.on('addUserToStudy', (event, arg) => {
  ds.initUser(arg.participantID);
  ds.addUserStudy(arg.studyID);
  ds.saveUserData();
  mainWindow.loadURL(`file://${__dirname}/startscreen.html`)
});

ipc.on('getUserLangs', (event) => {
  var userLangs = ds.getUserLangs();
  event.reply('updateUserLangs', userLangs);
})





// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
