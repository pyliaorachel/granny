import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import MainPageReport from './MainPageReport';
import { navbar_const, style_const } from './utils/constants';
import NavBar from './NavBar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: navbar_const.HEIGHT,
  },
  tabsContainerStyle: {
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  tabBarUnderlineStyle: {
    backgroundColor: 'white',
    opacity: 0.8,
  },
});

export default class Main extends Component {
  constructor(props) {
    super(props);
  }

  static renderNavigationBar(props) {
    return (<NavBar title={props.title} type={navbar_const.type.MAIN} />);
  }

  render() {
    return (
      <ScrollableTabView 
        style={styles.container} 
        tabsContainerStyle={styles.tabsContainerStyle}
        tabBarBackgroundColor={style_const.color.themeGreen}
        tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
        tabBarActiveTextColor='white'
        tabBarInactiveTextColor='rgba(255, 255, 255, 0.8)'
      >
        <MainPageReport tabLabel='Today' />
        <MainPageReport tabLabel='This Month' />
        <MainPageReport tabLabel='All Time' />
      </ScrollableTabView>
    );
  }
}
