const Store = require('electron-store');

// saves and loads data to the config.json file in this app's AppData 
class DataStore extends Store {
    constructor(settings) {
        super(settings);
        this.userData = {
            "userID": 0,
            "userStudies": [],
            "userOxfordResult": 0,
            "userSpellingResult": 0,
            "userSpellingAnswers": {},
            "userOxfordAnswers":{},
            "userDemographics":{},
        }
    }

    saveUserData() {
        if (this.userId != 0) {
            this.set(this.userData.userID, this.userData);
            this.userData = {
            "userID": 0,
            "userStudies": [],
            "userOxfordResult": 0,
            "userSpellingResult": 0,
            "userSpellingAnswers": {}, 
            "userOxfordAnswers": {},
            "userDemographics": {},
            }
        }
        
    }

    getUserData(userID) {
        return this.get(userID);
    } 

    getUserLangs() {
        var langIds = ["langOne", "langTwo", "langThree", "langFour"];
        var userLangs = {}
        for (var i = 0; i < 4; i++) {
            var language = this.userData.userDemographics[langIds[i]];
            userLangs[langIds[i]] = language;
        }
        return userLangs;
    }

    initUser(userID) {
        if (typeof(this.getUserData(userID)) === 'undefined') {
            this.userData.userID = userID;
        } else {
            this.userData = this.getUserData(userID)
        }

    }

    checkUserStudy(studyID) {
        return this.userData.userStudies.includes(studyID);
    }

    addUserStudy(studyID) {
        this.userData.userStudies.push(studyID);
    }

    setUserSpellingAnswers(spellingAnswers) {
        this.userData.userSpellingAnswers = spellingAnswers;
    }

    setUserSpellingResult(spellingResult) {
        this.userData.userSpellingResult = spellingResult;
    }

    setUserOxfordAnswers(oxfordAnswers) {
        this.userData.userOxfordAnswers = oxfordAnswers;
    }

    setUserQuestionnaireOneAnswers(questionnaireOneAnswers) {
        this.userData.userDemographics = questionnaireOneAnswers;
    }

    setUserOxfordResult(oxfordResult) {
        this.userData.userOxfordResult = oxfordResult;
    }
}

module.exports = DataStore