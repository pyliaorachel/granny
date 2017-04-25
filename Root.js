import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Scene, Router, ActionConst } from 'react-native-router-flux';

import SettingsDrawer from './src/SettingsDrawer';
import Account from './src/Account';
import Main from './src/Main';
import Room from './src/Room';
import Report from './src/Report';
import Search from './src/Search';

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
            <Scene key='room' component={Room}  hideNavBar direction='vertical' />
            <Scene key='report' component={Report} title='Report' direction='vertical' />
            <Scene key='account' component={Account} title='Welcome' direction='vertical' />
            <Scene key='search' component={Search} title='Search' direction='vertical' />
          </Scene>
        </Scene>
      </Router>
    );
  }
}
