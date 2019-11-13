const Store = require('electron-store');

class DataStore extends Store {
    constructor(settings) {
        super(settings);

        this.userData = {
            "userID": 0,
            "userWordAnswers": {}
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
        this.get(userID);
    } 

    initUser(userID) {
        this.userData.userID = userID;
    }

    setUserWordAnswers(wordAnswers) {
        this.userData.userWordAnswers = wordAnswers;
    }
}

module.exports = DataStore