import * as firebase from 'firebase';
import db from './config';

const getMemberStart = () => {
  firebase.auth().onAuthStateChanged((user) => {
    return user;
  });
}

const getMember = () => {
  const user = firebase.auth().currentUser;
  return user;
}

const createMember = (e, p) => {
  firebase.auth().createUserWithEmailAndPassword(e, p);
}

const logInMember = (e, p) => {
  firebase.auth().signInWithEmailAndPassword(e, p);
}

const getJournalEntry = (memberID, year, month, day, id) => {
  const JEPath = `/JournalEntry/${memberID}/${year}/${month}/${day}/${id}`;
  db.ref(JEPath).on('value', (snapshot) => {
    return snapshot.val() || '';
  });
}

const getGraphDataMonth = (memberID, year, month) => {
  let GDMPath = `/GraphDataMonth/${memberID}/${year}/${month}`;
  db.ref(GDMPath).on('value', (snapshot) => {
    return snapshot.val() || '';
  });
}

const getGraphDataDay = (memberID, year, month, day) => {
  let GDDPath = `/GraphDataMonth/${memberID}/${year}/${month}/${day}`;
  db.ref(GDDPath).on('value', (snapshot) => {
    return snapshot.val() || '';
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
