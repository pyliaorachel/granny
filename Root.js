import React, { Component } from 'react';
import { Scene, Router } from 'react-native-router-flux';

import MainMenu from './src/MainMenu'
import Room from './src/Room'
import Report from './src/Report'

export default class Root extends Component {
  render() {
    return (
      <Router hideNavBar={true}>
        <Scene key='mainmenu' component={MainMenu} initial={true} />
        <Scene key='room' component={Room} />
        <Scene key='report' component={Report} />
      </Router>
    );
  }
}