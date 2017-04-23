import * as firebase from "firebase";
class GrannyFirebase {
  static initialise() {
    firebase.initializeApp({
      apiKey: "AIzaSyD5iW4tmbW30YcQkRBvzgsQrhLkXHAVWFQ",
      authDomain: "granny-9da5e.firebaseapp.com",
      databaseURL: "https://granny-9da5e.firebaseio.com",
      storageBucket: "granny-9da5e.appspot.com"
    });
  }
}
module.exports = GrannyFirebase;
