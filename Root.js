import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Scene, Router, ActionConst } from 'react-native-router-flux';

import Account from './src/Account';
import Main from './src/Main';
import Room from './src/Room';
import Report from './src/Report';
import NavBar from './src/NavBar';
import GrannyFirebase from "./src/database/GrannyFirebase";

export default class Root extends Component {
  constructor(props) {
    super(props);
    GrannyFirebase.initialise();
  }
  render() {
    return (
      <Router>
        <Scene key='account' component={Account} />
        <Scene key='main' component={Main} title='granny' />
        <Scene key='room' component={Room}  hideNavBar/>
        <Scene key='report' component={Report} title='Report' />
      </Router>
    );
  }
}
