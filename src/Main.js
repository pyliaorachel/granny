import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';

import * as Auth from './utils/db/authentication';
import * as api from './utils/db/api';
import MainPageReport from './MainPageReport';
import { navbar_const, style_const } from './utils/constants';
import NavBar from './NavBar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: navbar_const.HEIGHT,
    backgroundColor: style_const.color.themeGreen,
  },
  tabsContainerStyle: {
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  tabBarUnderlineStyle: {
    backgroundColor: 'white',
    opacity: 0.8,
  },
  startRecordButton: {
    backgroundColor: style_const.color.themeGreen,
    elevation: 3,
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    bottom: 15,
    right: 15,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default class Main extends Component {
  constructor(props) {
    super(props);

    const now = new Date();

    this.state = {
      UID: null,
      date: `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`,
    };

    this.startNewRecord = this.startNewRecord.bind(this);
    this.search = this.search.bind(this);
  }

  static renderNavigationBar(props) {
    return (<NavBar title={props.title} leaveType={navbar_const.type.MAIN} search={Main.search} />);
  }

  componentWillReceiveProps(props) {
    if (props.member) {
      console.log('member', member.uid);
      this.setState({ UID: member.uid });
    }
    if (props.search) {
      console.log('search', props.search);
      this.search(props.search.target, props.search.date);
    }
  }

  componentWillMount() {
    Auth.getMemberStart(member => {
      console.log('member', member);
      if (member) {
        api.setUserID(member.uid);
        this.setState({ UID: member.uid });
      } else{
        Actions.account();
      }
    });
  }

  startNewRecord() {
    Actions.room();
  }

  search(target, date) {
    console.log('search', target, date);
    this.setState({date});
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollableTabView 
          style={{flex: 1}} 
          tabsContainerStyle={styles.tabsContainerStyle}
          tabBarBackgroundColor={style_const.color.themeGreen}
          tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
          tabBarActiveTextColor='white'
          tabBarInactiveTextColor='rgba(255, 255, 255, 0.8)'
        >
          <MainPageReport tabLabel='Day' UID={this.state.UID} date={this.state.date}/>
          <MainPageReport tabLabel='Month' UID={this.state.UID} date={this.state.date}/>
          <MainPageReport tabLabel='Year' UID={this.state.UID} date={this.state.date}/>
        </ScrollableTabView>
        <TouchableHighlight 
          style={styles.startRecordButton}
          underlayColor={style_const.color.themeGreen}
          onPress={this.startNewRecord}
        >
          <Icon
              name='md-mic'
              size={35}
              color='rgba(255, 255, 255, 0.4)'
          />
        </TouchableHighlight>
      </View>
    );
  }
}
