import * as firebase from 'firebase';
import db from './config';

const getMemberStart = (cb) => {
  firebase.auth().onAuthStateChanged(cb);
}

const getMember = () => {
  return firebase.auth().currentUser;
}

const createMember = (e, p) => {
  return firebase.auth().createUserWithEmailAndPassword(e, p);
}

const logInMember = (e, p) => {
  return firebase.auth().signInWithEmailAndPassword(e, p);
}

const logOutMember = () => {
  return firebase.auth().signOut();
};

module.exports = {
  getMemberStart,
  getMember,
  createMember,
  logInMember,
  logOutMember,
};
