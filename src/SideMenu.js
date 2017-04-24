import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import * as Auth from './utils/db/authentication';
import { Actions } from 'react-native-router-flux';

import { style_const, drawer_const } from './utils/constants';

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
});

export default class SideMenu extends Component {

  constructor(props) {
    super(props);

    this.state = {
      UID: '',
    };

    this.logInOut = this.logInOut.bind(this);
    this.changePin = this.changePin.bind(this);
  }

  componentWillMount() {
    Auth.getMemberStart(member => {
      console.log('member', member);
      if (member) {
        this.setState({ UID: member.uid });
      }
    });
  }

  logInOut() {
    console.log('uid', this.state.UID);
    if (this.state.UID === '') {
      Actions.account();
    } else {
      this.setState({ UID: '' });
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
        <TouchableOpacity onPress={() => this.logInOut()}>
          <View style={styles.cell}>
            <Icon
                  name='login'
                  size={20}
                  style={styles.icon}
              />
            <Text style={styles.text}>{(UID === '') ? 'Login' : 'Logout'}</Text>
          </View>
        </TouchableOpacity>
        {
          (UID !== '') ?
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
            null
        }
      </View>
    );
  }
}