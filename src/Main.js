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
    borderWidth: 0,
  },
  tabBarTextStyle: {
    color: 'white',
    opacity: 0.6,
  },
  tabBarUnderlineStyle: {
    backgroundColor: 'white',
    opacity: 0.6,
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
        tabBarTextStyle={styles.tabBarTextStyle}
        tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
      >
        <MainPageReport tabLabel='Today' />
        <MainPageReport tabLabel='This Month' />
        <MainPageReport tabLabel='All Time' />
      </ScrollableTabView>
    );
  }
}
