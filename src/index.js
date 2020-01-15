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
let ds;


const createWindow = () => {
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
  mainWindow.loadURL(`file://${__dirname}/index.html`);

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

ipc.on('submitSpelling', (event, arg) => {
  ds.setUserSpellingAnswers(arg);
  ds.setUserSpellingResult(autogradeSpelling(arg));
  ds.saveUserData();
});

ipc.on('submit-questionnaire-1', (event, arg) => {
  ds.setUserQuestionnaireOneAnswers(arg);
});


ipc.on('goToURL', (event, arg) => {
  mainWindow.loadURL(`file://${__dirname}/` + arg);
});

ipc.on('setup-user', (event, arg) => {
  ds.initUser(arg.participantID)
  if (typeof(ds.getUserData(arg.participantID)) === 'undefined') {
    ds.addUserStudy(arg.studyID);
    mainWindow.loadURL(`file://${__dirname}/questionnaire.html`);
  } else if (ds.checkUserStudy(arg.studyID)) {
    mainWindow.loadURL(`file://${__dirname}/userStudyExists.html`);
  } else {
    mainWindow.loadURL(`file://${__dirname}/userExists.html?participantID=${arg.participantID}&studyID=${arg.studyID}`);
  }
});

ipc.on('addUserToStudy', (event, arg) => {
  ds.addUserStudy(arg.studyID);
  ds.saveUserData();
  mainWindow.loadURL(`file://${__dirname}/startscreen.html`)
});

ipc.on('getUserLangs', (event) => {
  var userLangs = ds.getUserLangs();
  event.reply('updateUserLangs', userLangs);
});

ipc.on('exportData', (event, arg) => {
  var allUsers = ds.store;
  var keysWanted = ['userID', 'userSpellingResult','userDemographics'];
  var headerList = [];
  var headerListGenerated = false;
  var csvContent = "data:text/csv;charset=utf-8,";
  Object.values(allUsers).forEach((value) => {
    if (value['userStudies'].includes(arg)) {
      if (!headerListGenerated) {
        keysWanted.forEach((key) => {
          if (typeof value[key] === 'object') {
            headerList = headerList.concat(Object.keys(value[key]))
          } else {
            headerList.push(key)
          }
        })
        headerListGenerated = true;
        csvContent += headerList.join() + "\r\n";
      }
      var userValues = [];
      keysWanted.forEach((key) => {
        if (key.includes('.')) {
          var splitKey = key.split('.', 2);
          userValues.push(value[splitKey[0]][splitKey[1]])
        } else if (typeof value[key] === 'object') {
          userValues = userValues.concat(Object.values(value[key]))
        } else {
          userValues.push(value[key])
        }
      });
      var userValuesEscaped = userValues.map(function(item) {
        if (typeof item === 'string' && item.includes(",")) {
          return "\"" + item + "\"";
        } else {
          return item;
        }
      });
      csvContent += userValuesEscaped.join() + "\r\n";
    }
    });
    var encodedUri = encodeURI(csvContent);
    event.reply('csvFile', encodedUri);
});


var autogradeSpelling = function(userAnswers) {
  var correctAnswers = {
    "away": false,
    "cemetery": false,
    "foriegn": true,
    "kernal": true,
    "zipper": false,
    "refer": false,
    "valuable": false,
    "unnecessary": false,
    "graph": false,
    "nowhere": false,
    "join": false,
    "acquire": false,
    "allow": false,
    "calender": true,
    "doubt": false,
    "ocassion": true,
    "possess": false,
    "school": false,
    "zoology": false,
    "embarass": true,
    "vaccum": true,
    "publicly": false,
    "kite": false,
    "there": false,
    "twelfth": false,
    "orange": false,
    "privalege": true,
    "license": false,
    "libary": true,
    "existence": false,
    "yeild": true,
    "disipline": true,
    "usually": false,
    "impel": false,
    "night": false,
    "family": false,
    "maintenance": false,
    "zebera": true,
    "thier": true,
    "category": false,
    "exceed": false,
    "science": false,
    "octopus": false,
    "lightning": false,
    "wendsday": true,
    "mispell": true,
    "yellow": false,
    "gaurantee": true,
    "grateful": false,
    "weird": false,
    "enter": false,
    "receive": false,
    "resturant": true,
    "friend": false,
    "bargin": true,
    "judge": false,
    "harass": false,
    "kabob": false,
    "tray": false,
    "visible": false,
    "schedule": false,
    "marshmallow": false,
    "kangaroo": false,
    "humorous": false,
    "independant": true,
    "immediate": false,
    "usage": false,
    "haunt": false,
    "gauge": false,
    "aceptable": true,
    "nieghbor": true,
    "jewellry": true,
    "village": false,
    "jury": false,
    "ignorance": false,
    "noticeable": false,
    "your": false,
    "large": false,
    "wherever": false,
    "dumb": false,
    "bland": false,
    "miniature": false,
    "rhyme": false,
    "whole": false,
    "beleive": true,
    "untill": true,
    "hieght": true,
    "fault": false,
    "pastime": false,
    "column": false,
    "seperate": true,
    "occurrence": false,
    "better": false,
    "yacht": false,
    "definite": false,
    "hiortely": true,
    "prohibitive": false,
    "frequency": false,
    "generation": false,
    "blasphemy": false,
    "overhead": false,
    "conclave": false,
    "collusion": false,
    "opression": true,
    "hindrane": true,
    "software": false,
    "yolk": false,
    "secular": false,
    "laudatory": false,
    "interpretateon": true,
    "retentive": false,
    "minutiae": false,
    "confound": false,
    "supremacy": false,
    "gape": false,
    "nuisance": false,
    "grecefulness": true,
    "abysmal": false,
    "ubbiquitous": true,
    "irrecoverable": false,
    "jubilant": false,
    "liberate": false,
    "diagonal": false,
    "assess": false,
    "ramify": false,
    "sordid": false,
    "virse": true,
    "hierarchy": false,
    "foolhardy": false,
    "infatuatted": true,
    "shroud": false,
    "ammigriti": true,
    "proficient": false,
    "complementary": false,
    "consternation": false,
    "negligible": false,
    "alphabitic": true,
    "medieval": false,
    "reproach": false,
    "centenary": false,
    "questionnaire": false,
    "jurisdiction": false,
    "legendery": true,
    "yellowish": false,
    "vixen": false,
    "overdraw": false,
    "raze": false,
    "emperor": false,
    "lucrativi": true,
    "hypodermic": false,
    "verifiable": false,
    "stereotype": false,
    "idoleze": true,
    "wiggle": false,
    "regress": false,
    "mutton": false,
    "invert": false,
    "craass": true,
    "condone": false,
    "phrase": false,
    "pauper": false,
    "parliament": false,
    "retrech": true,
    "ordaell": true,
    "carriage": false,
    "connotation": false,
    "allay": false,
    "sovereign": false,
    "security": false,
    "ifringe": true,
    "referee": false,
    "indalent": true,
    "appraisal": false,
    "rispectively": true,
    "debase": false,
    "vicissitude": false,
    "deign": false,
    "left": false,
    "excerpt": false,
    "jargon": false,
    "cadence": false,
    "dialect": false,
    "circumscribe": false,
    "nourishment": false,
    "invest": false,
    "reconstruction": false,
    "indulget": true,
    "zenith": false,
    "chiarma": true,
    "surplus": false,
    "commission": false,
    "exacerbate": false,
    "legitimate": false,
    "odyssey": false,
    "affectation": false,
    "stiad": true,
    "cuvility": true,
    "emlem": true,
    "harvest": false,
    "lush": false,
    "callous": false,
    "interfered": false,
    "totaling": false,
    "tawdry": false,
    "disappearance": false,
    "tractable": false,
    "categorical": false,
    "imracticable": true,
    "bevy": false,
    "itinerary": false,
    "hiatus": false,
    "obtain": false,
    "complacent": false,
    "strife": false,
    "civilain": true
  }
  var truePositives = 0;
  var trueNegatives = 0;
  var actualPositives = 0;
  var actualNegatives = 0;
  Object.values(correctAnswers).forEach((value) => {
    if (value) {
      actualPositives++;
    } else {
      actualNegatives++;
    }
  });
  Object.entries(userAnswers).forEach(([key, value]) => {
    if (value && correctAnswers[key]) {
      truePositives++;
    } else if (!value && !correctAnswers[key]) {
      trueNegatives++;
    }
  });
  return ((trueNegatives / actualNegatives * 100) + (truePositives / actualPositives * 100)) / 2
}
