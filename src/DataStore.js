const Store = require('electron-store');

// saves and loads data to the config.json file in this app's AppData 
class DataStore extends Store {
    constructor(settings) {
        super(settings);
        this.userData = {
            "userID": 0,
            "userStudies": [],
            "userWordAnswers": {},
            "userOEAnswers":{},
            "userDemographics":{},
        }
    }

    saveUserData() {
        if (this.userId != 0) {
            this.set(this.userData.userID, this.userData);
            this.userData = {
            "userID":0,
            "userWordAnswers":{}
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
            this.userData.userStudies = [];
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

    setUserWordAnswers(wordAnswers) {
        this.userData.userWordAnswers = wordAnswers;
    }

    setUserQuestionnaireOneAnswers(questionnaireOneAnswers) {
        this.userData.userDemographics = questionnaireOneAnswers;
    }
}

module.exports = DataStore