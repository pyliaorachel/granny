import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Scene, Router, ActionConst } from 'react-native-router-flux';

import Main from './src/Main';
import Room from './src/Room';
import Report from './src/Report';
import NavBar from './src/NavBar';

export default class Root extends Component {

  render() {
    return (
      <Router>
        <Scene key='main' component={Main} title='granny' />
        <Scene key='room' component={Room}  hideNavBar/>
        <Scene key='report' component={Report} title='Report' />
      </Router>
    );
  }
}
