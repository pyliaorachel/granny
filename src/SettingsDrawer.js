import React, { Component } from 'react';
import {
  View,
  Dimensions,
} from 'react-native';
import Drawer from 'react-native-drawer';
import SideMenu from './SideMenu';
import { Actions, DefaultRenderer } from 'react-native-router-flux';

const styles = {
  drawer: {
    elevation: 2,
  },
  main: {
    backgroundColor: 'black',
  }
};

export default class SettingsDrawer extends Component {
  render(){
    const state = this.props.navigationState;
    const children = state.children;
    return (
      <Drawer
        ref='drawer'
        styles={styles}
        open={state.open}
        onOpen={()=>Actions.refresh({key:state.key, open: true})}
        onClose={()=>Actions.refresh({key:state.key, open: false})}
        type='overlay'
        content={<SideMenu />}
        tapToClose={true}
        openDrawerOffset={0.3}
        negotiatePan={true}
        elevation={3}
        tweenHandler={(ratio) => ({
          main: { opacity:Math.max(0.3,1-ratio) }
      })}>
        <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
      </Drawer>
    );
  }
}