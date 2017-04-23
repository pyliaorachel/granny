import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Scene, Router, ActionConst } from 'react-native-router-flux';

import SettingsDrawer from './src/SettingsDrawer';
import Account from './src/Account';
import Main from './src/Main';
import Room from './src/Room';
import Report from './src/Report';

export default class Root extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Router>
        <Scene key="settings" component={SettingsDrawer} open={false} >
          <Scene key="root">
            <Scene key='main' component={Main} title='granny' />
            <Scene key='room' component={Room}  hideNavBar/>
            <Scene key='report' component={Report} title='Report' />
            <Scene key='account' component={Account} />
          </Scene>
        </Scene>
      </Router>
    );
  }
}
