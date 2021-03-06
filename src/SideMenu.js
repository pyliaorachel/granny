import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import * as Auth from './utils/db/authentication';
import { Actions } from 'react-native-router-flux';
import * as colors from './utils/colors';

import { style_const, drawer_const, granny_const } from './utils/constants';
const HAPPY_GRANNY = require('../assets/emotions/happy.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: style_const.color.BGGrey,
  },
  cell: {
    borderBottomWidth: 1,
    borderColor: '#CCCCCC',
    height: drawer_const.HEIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  icon: {
    color: 'black',
    opacity: 0.6,
    padding: 10,
  },
  text: {
    color: 'black',
    opacity: 0.6,
  },
  email: {
    color: style_const.color.themeGreen,
    opacity: 1,
  },
  imageStyle: {
    width: 60,
    height: 60 * granny_const.HEIGHT / granny_const.WIDTH,
    margin: 10,
    alignSelf: 'center',
  },
  imageContainer: {
    borderBottomWidth: 1,
    borderColor: '#eeeeee',
    backgroundColor: colors.happiness,
  }
});

export default class SideMenu extends Component {

  constructor(props) {
    super(props);

    this.state = {
      UID: '',
      member: null,
    };

    this.logInOut = this.logInOut.bind(this);
    this.changePin = this.changePin.bind(this);
  }

  componentWillMount() {
    Auth.getMemberStart(member => {
      console.log('member', member);
      if (member) {
        this.setState({ UID: member.uid, member });
      }
    });
  }

  logInOut() {
    console.log('uid', this.state.UID);
    if (this.state.UID === '') {
      Actions.refresh({key: 'settings', open: value => !value});
      setTimeout(() => Actions.account(), 0);
    } else {
      this.setState({ UID: '', member: null });
      Auth.logOutMember().then(() => {
        console.log('Logged out');
        Actions.refresh({key: 'settings', open: value => !value});
      }).catch((err) => console.log(err));
    }
  }

  changePin() {
    console.log('change pin');
  }

  render(){
    const { UID } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image style={styles.imageStyle} source={HAPPY_GRANNY} />
        </View>
        <TouchableOpacity onPress={() => this.logInOut()}>
          <View style={styles.cell}>
            <Icon
                  name='login'
                  size={20}
                  style={styles.icon}
              />
            {
              (UID === '') ? 
              (
                <Text style={styles.text}>Login</Text>
              ) : 
                <Text numberOfLines={1} ellipsizeMode='middle' style={styles.text}>Logout <Text style={styles.email}>{this.state.member.email}</Text></Text>
            }
          </View>
        </TouchableOpacity>
        {/*(UID !== '') ?
          <TouchableOpacity onPress={() => this.changePin()}>
            <View style={styles.cell}>
              <Icon
                    name='key'
                    size={20}
                    style={styles.icon}
                />
              <Text style={styles.text}>Change PIN</Text>
            </View>
          </TouchableOpacity>
        :
          null*/}
      </View>
    );
  }
}