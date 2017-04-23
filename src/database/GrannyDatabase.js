import * as firebase from "firebase";

const getMemberStart = () => {
  firebase.auth().onAuthStateChanged(function(user){
    if(user){
      return user;
    }
    return null;
  });
}

const getMember = () => {
  const user = firebase.auth().currentUser;
  if(user){
    return user;
  }
  return null;
}

const createMember = (e, p) => {
  firebase.auth().createUserWithEmailAndPassword(e, p);
}

const logInMember = (e, p) => {
  firebase.auth().signInWithEmailAndPassword(e, p);
}

const getMember = () => {
  const user = firebase.auth().currentUser;
  if(user){
    return user;
  }
  return null;
}

const getJournalEntry = (memberID, year, month, day, id) => {
  let JEPath = "/JournalEntry/" + memberID + "/" + year + "/" + month + "/" + day + "/" + id;
  firebase.database().ref(JEPath).on('value', (snapshot) => {
    var JE = "";
    if (snapshot.val()) {
      JE = snapshot.val()
    }
    return JE;
  });
}

const getGraphDataMonth = (memberID, year, month) => {
  let GDMPath = "/GraphDataMonth/" + memberID + "/" + year + "/" + month;
  firebase.database().ref(GDMPath).on('value', (snapshot) => {
    var GDM = "";
    if (snapshot.val()) {
      GDM = snapshot.val()
    }
    return GDM;
  });
}

const getGraphDataDay = (memberID, year, month, day) => {
  let GDDPath = "/GraphDataMonth/" + memberID + "/" + year + "/" + month + "/" + day;
  firebase.database().ref(GDDPath).on('value', (snapshot) => {
    var GDD = "";
    if (snapshot.val()) {
      GDD = snapshot.val()
    }
    return GDD;
  });
}

module.exports = {
  getMemberStart,
  getMember,
  createMember,
  logInMember,
  getJournalEntry,
  getGraphDataMonth,
  getGraphDataDay,
};
