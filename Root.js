import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Scene, Router } from 'react-native-router-flux';

import Main from './src/Main';
import Room from './src/Room';
import Report from './src/Report';
import NavBar from './src/NavBar';

export default class Root extends Component {

  render() {
    return (
      <Router>
        <Scene key='main' component={Main} hideNavBar/>
        <Scene initial key='room' component={Room}  hideNavBar/>
        <Scene key='report' component={Report} navBar={NavBar} title='Report' />
      </Router>
    );
  }
}
